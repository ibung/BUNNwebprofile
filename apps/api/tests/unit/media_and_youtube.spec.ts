import { test } from '@japa/runner'
import { YouTubeService } from '#services/youtube_service'
import { MediaService } from '#services/media_service'

test.group('YouTubeService', () => {
  test('dapat mengekstrak ID dari URL youtube.com/watch', ({ assert }) => {
    const result = YouTubeService.parse('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    assert.isNotNull(result)
    assert.equal(result?.id, 'dQw4w9WgXcQ')
    assert.equal(result?.startSeconds, 0)
  })

  test('dapat mengekstrak ID dari youtu.be dengan timestamp', ({ assert }) => {
    const result = YouTubeService.parse('https://youtu.be/dQw4w9WgXcQ?t=90s')
    assert.isNotNull(result)
    assert.equal(result?.id, 'dQw4w9WgXcQ')
    assert.equal(result?.startSeconds, 90)
  })

  test('dapat mengekstrak ID dari YouTube Shorts', ({ assert }) => {
    const result = YouTubeService.parse('https://www.youtube.com/shorts/dQw4w9WgXcQ')
    assert.isNotNull(result)
    assert.equal(result?.id, 'dQw4w9WgXcQ')
  })

  test('dapat mengekstrak ID dari YouTube Embed', ({ assert }) => {
    const result = YouTubeService.parse('https://www.youtube.com/embed/dQw4w9WgXcQ')
    assert.isNotNull(result)
    assert.equal(result?.id, 'dQw4w9WgXcQ')
  })

  test('dapat mengurai format waktu kompleks (1h2m3s)', ({ assert }) => {
    const result = YouTubeService.parse('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=1h2m3s')
    assert.isNotNull(result)
    assert.equal(result?.startSeconds, 3723)
  })

  test('menolak URL yang bukan YouTube atau ID tidak valid', ({ assert }) => {
    assert.isNull(YouTubeService.parse('https://vimeo.com/123456'))
    assert.isNull(YouTubeService.parse('https://youtube.com/watch?v=pendek'))
    assert.isNull(YouTubeService.parse('bukan url'))
  })
})

test.group('MediaService Sniffing & Validasi', () => {
  test('dapat mendeteksi magic bytes JPEG', ({ assert }) => {
    const jpegHeader = Buffer.from([
      0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
    ])
    const sniffed = MediaService.sniffType(jpegHeader)
    assert.isNotNull(sniffed)
    assert.equal(sniffed?.mime, 'image/jpeg')
    assert.equal(sniffed?.kind, 'image')
  })

  test('dapat mendeteksi magic bytes PNG', ({ assert }) => {
    const pngHeader = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
    ])
    const sniffed = MediaService.sniffType(pngHeader)
    assert.isNotNull(sniffed)
    assert.equal(sniffed?.mime, 'image/png')
    assert.equal(sniffed?.kind, 'image')
  })

  test('dapat mendeteksi magic bytes WebP', ({ assert }) => {
    const webpHeader = Buffer.from('RIFF\x00\x00\x00\x00WEBPVP8 ')
    const sniffed = MediaService.sniffType(webpHeader)
    assert.isNotNull(sniffed)
    assert.equal(sniffed?.mime, 'image/webp')
    assert.equal(sniffed?.kind, 'image')
  })

  test('dapat mendeteksi PDF', ({ assert }) => {
    const pdfHeader = Buffer.from('%PDF-1.7\n%test')
    const sniffed = MediaService.sniffType(pdfHeader)
    assert.isNotNull(sniffed)
    assert.equal(sniffed?.mime, 'application/pdf')
    assert.equal(sniffed?.kind, 'document')
  })

  test('menolak SVG dan file teks mentah', ({ assert }) => {
    const svgContent = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>')
    const textContent = Buffer.from('Hello world this is plain text')
    assert.isNull(MediaService.sniffType(svgContent))
    assert.isNull(MediaService.sniffType(textContent))
  })

  test('validasi ukuran berkas sesuai batasan jenis media', ({ assert }) => {
    const image1MB = 1024 * 1024
    const image15MB = 15 * 1024 * 1024

    assert.isTrue(MediaService.validateSize(image1MB, 'image').valid)
    assert.isFalse(MediaService.validateSize(image15MB, 'image').valid)
  })

  test('perhitungan SHA-256 akurat', ({ assert }) => {
    const sample = Buffer.from('hello bunn')
    const hash = MediaService.calculateSha256(sample)
    assert.equal(hash.length, 64)
  })
})
