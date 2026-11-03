import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import sharp from 'sharp'
import app from '@adonisjs/core/services/app'
import env from '#start/env'
import { type MediaKind, type AllowedUploadMime, UPLOAD_LIMITS, IMAGE_VARIANTS } from '@bunn/shared'

export interface SniffedFile {
  mime: AllowedUploadMime
  kind: MediaKind
  ext: string
}

export interface ProcessedMediaFile {
  storageKey: string
  originalName: string
  mimeType: AllowedUploadMime
  sizeBytes: number
  width: number | null
  height: number | null
  checksumSha256: string
  variants: Record<string, string> | null
}

export class MediaService {
  /**
   * Mengembalikan path absolut ke direktori penyimpanan unggahan.
   */
  static getUploadsDir(): string {
    const rawDir = env.get('UPLOADS_DIR')
    return path.isAbsolute(rawDir) ? rawDir : app.makePath(rawDir)
  }

  /**
   * Memastikan folder tujuan penyimpanan tersedia.
   */
  static async ensureUploadsDir(): Promise<string> {
    const dir = this.getUploadsDir()
    await fs.mkdir(dir, { recursive: true })
    return dir
  }

  /**
   * Sniffing tipe berkas berdasarkan magic bytes (isi berkas awal).
   * Mencegah pemalsuan ekstensi/header dan menolak SVG (risiko XSS).
   */
  static sniffType(buffer: Buffer): SniffedFile | null {
    if (!buffer || buffer.length < 12) return null

    // 1. JPEG: FF D8 FF
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      return { mime: 'image/jpeg', kind: 'image', ext: 'jpg' }
    }

    // 2. PNG: 89 50 4E 47 0D 0A 1A 0A
    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    ) {
      return { mime: 'image/png', kind: 'image', ext: 'png' }
    }

    // 3. WebP: RIFF .... WEBP
    if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
      return { mime: 'image/webp', kind: 'image', ext: 'webp' }
    }

    // 4. AVIF: byte 4-12 mengandung 'ftypavif' atau 'ftypavis'
    if (buffer.length >= 16) {
      const ftypSub = buffer.toString('ascii', 4, 12)
      if (ftypSub === 'ftypavif' || ftypSub === 'ftypavis') {
        return { mime: 'image/avif', kind: 'image', ext: 'avif' }
      }
    }

    // 5. MP4: byte 4-8 adalah 'ftyp'
    if (buffer.length >= 16) {
      const ftyp = buffer.toString('ascii', 4, 8)
      if (ftyp === 'ftyp') {
        const brand = buffer.toString('ascii', 8, 12)
        // Pastikan bukan avif
        if (brand !== 'avif' && brand !== 'avis') {
          return { mime: 'video/mp4', kind: 'video', ext: 'mp4' }
        }
      }
    }

    // 6. WebM: 1A 45 DF A3 (EBML Header)
    if (buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3) {
      return { mime: 'video/webm', kind: 'video', ext: 'webm' }
    }

    // 7. PDF: %PDF- (25 50 44 46 2D)
    if (buffer.toString('ascii', 0, 5) === '%PDF-') {
      return { mime: 'application/pdf', kind: 'document', ext: 'pdf' }
    }

    return null
  }

  /**
   * Validasi ukuran berkas sesuai batasan jenis media.
   */
  static validateSize(sizeBytes: number, kind: MediaKind): { valid: boolean; maxBytes: number } {
    let maxBytes: number = UPLOAD_LIMITS.imageBytes
    if (kind === 'video') maxBytes = UPLOAD_LIMITS.videoBytes
    if (kind === 'document') maxBytes = UPLOAD_LIMITS.documentBytes

    return {
      valid: sizeBytes <= maxBytes,
      maxBytes,
    }
  }

  /**
   * Menghitung hash SHA-256 dari buffer berkas.
   */
  static calculateSha256(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex')
  }

  /**
   * Memproses dan menyimpan berkas unggahan:
   * - Sniffing tipe riil
   * - Untuk gambar: rotasi EXIF, pembersihan metadata (GPS/EXIF), generate WebP varian thumb, md, lg
   * - Untuk video/dokumen: penyimpanan langsung tanpa modifikasi biner
   */
  static async processAndStore(buffer: Buffer, originalName: string): Promise<ProcessedMediaFile> {
    const sniffed = this.sniffType(buffer)
    if (!sniffed) {
      throw new Error(
        'Format berkas tidak diizinkan atau tidak dikenali. Format yang didukung: JPEG, PNG, WebP, AVIF, MP4, WebM, PDF.'
      )
    }

    const sizeValidation = this.validateSize(buffer.length, sniffed.kind)
    if (!sizeValidation.valid) {
      const maxMb = Math.round(sizeValidation.maxBytes / (1024 * 1024))
      throw new Error(`Ukuran berkas melebihi batas maksimal (${maxMb} MB).`)
    }

    const uploadsDir = await this.ensureUploadsDir()
    const fileId = crypto.randomUUID()
    const checksum = this.calculateSha256(buffer)

    let width: number | null = null
    let height: number | null = null
    let variants: Record<string, string> | null = null
    const baseKey = `${fileId}.${sniffed.ext}`
    const destPath = path.join(uploadsDir, baseKey)

    if (sniffed.kind === 'image') {
      // Proses gambar dengan sharp
      const imageInstance = sharp(buffer).rotate() // rotate() tanpa parameter otomatis menerapkan orientasi EXIF & menghapus EXIF tag
      const metadata = await imageInstance.metadata()

      width = metadata.width ?? null
      height = metadata.height ?? null

      // Simpan berkas utama bersih tanpa EXIF/GPS
      await imageInstance.toFile(destPath)

      // Generate varian WebP responsif
      variants = {}
      for (const [variantKey, maxWidth] of Object.entries(IMAGE_VARIANTS)) {
        const variantFileName = `${fileId}_${variantKey}.webp`
        const variantPath = path.join(uploadsDir, variantFileName)

        await sharp(buffer)
          .rotate()
          .resize({ width: maxWidth, withoutEnlargement: true })
          .webp({ quality: 82 })
          .toFile(variantPath)

        variants[variantKey] = variantFileName
      }
    } else {
      // Video atau Dokumen: tulis langsung ke disk
      await fs.writeFile(destPath, buffer)
    }

    return {
      storageKey: baseKey,
      originalName,
      mimeType: sniffed.mime,
      sizeBytes: buffer.length,
      width,
      height,
      checksumSha256: checksum,
      variants,
    }
  }

  /**
   * Menghapus seluruh berkas fisik media dari disk termasuk varian gambar.
   */
  static async deletePhysicalFiles(
    storageKey: string | null,
    variants: Record<string, string> | null,
    posterKey?: string | null
  ): Promise<void> {
    const uploadsDir = this.getUploadsDir()

    const filesToDelete: string[] = []
    if (storageKey) filesToDelete.push(storageKey)
    if (posterKey) filesToDelete.push(posterKey)
    if (variants) {
      for (const variantKey of Object.values(variants)) {
        if (typeof variantKey === 'string') {
          filesToDelete.push(variantKey)
        }
      }
    }

    await Promise.all(
      filesToDelete.map(async (fileName) => {
        try {
          // Cegah path traversal dalam nama berkas
          const safeName = path.basename(fileName)
          const fullPath = path.join(uploadsDir, safeName)
          await fs.unlink(fullPath)
        } catch (err: any) {
          if (err.code !== 'ENOENT') {
            // Abaikan jika berkas memang sudah tidak ada
            console.error(`Gagal menghapus berkas ${fileName}:`, err)
          }
        }
      })
    )
  }
}
