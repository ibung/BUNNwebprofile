import { test } from '@japa/runner'
import MarkdownService from '#services/markdown_service'
import PublicMediaTransformer from '#transformers/public_media_transformer'
import Media from '#models/media'

test.group('Fase 4: MarkdownService', () => {
  test('mengonversi markdown dasar menjadi HTML', async ({ assert }) => {
    const md = '# Judul Proyek\n\nIni paragraf dengan **tebal** dan *miring*.'
    const html = await MarkdownService.render(md)

    assert.include(html, '<h1>Judul Proyek</h1>')
    assert.include(html, '<strong>tebal</strong>')
    assert.include(html, '<em>miring</em>')
  })

  test('mengonversi daftar dan blok kode', async ({ assert }) => {
    const md = '- Item satu\n- Item dua\n\n```ts\nconst angka = 42\n```'
    const html = await MarkdownService.render(md)

    assert.include(html, '<ul>')
    assert.include(html, '<li>Item satu</li>')
    assert.include(html, '<li>Item dua</li>')
    assert.include(html, '<pre><code')
    assert.include(html, 'const angka = 42')
  })

  test('menghapus skrip jahat dan tag terlarang (XSS sanitization)', async ({ assert }) => {
    const malicious =
      'Halo <script>alert("hacked")</script> dunia! <iframe src="https://evil.com"></iframe>'
    const html = await MarkdownService.render(malicious)

    assert.notInclude(html, '<script>')
    assert.notInclude(html, 'alert("hacked")')
    assert.notInclude(html, '<iframe>')
    assert.include(html, 'Halo')
    assert.include(html, 'dunia!')
  })

  test('menghapus atribut event handler berbahaya (onerror, onclick)', async ({ assert }) => {
    const xss = '<img src="invalid" onerror="alert(1)" alt="test"> Teks normal'
    const html = await MarkdownService.render(xss)

    assert.notInclude(html, 'onerror')
    assert.notInclude(html, 'alert(1)')
    assert.include(html, 'Teks normal')
  })

  test('menghapus tautan dengan skema javascript: atau data:', async ({ assert }) => {
    const xssLink = '[Klik Disini](javascript:alert("xss")) dan [Data](data:text/html,evil)'
    const html = await MarkdownService.render(xssLink)

    assert.notInclude(html, 'javascript:')
    assert.notInclude(html, 'data:')
    assert.include(html, 'Klik Disini')
  })

  test('menambahkan target=_blank dan rel=noopener noreferrer pada link eksternal', async ({
    assert,
  }) => {
    const md = '[Google](https://google.com) dan [Proyek Saya](/projects/bunn)'
    const html = await MarkdownService.render(md)

    assert.match(
      html,
      /<a\s+href="https:\/\/google\.com"\s+target="_blank"\s+rel="noopener noreferrer"/
    )
    assert.match(html, /<a\s+href="\/projects\/bunn"/)
    assert.notMatch(html, /<a\s+href="\/projects\/bunn"[^>]*target="_blank"/)
  })

  test('menangani nilai null dan string kosong dengan aman', async ({ assert }) => {
    assert.equal(await MarkdownService.render(null), '')
    assert.equal(await MarkdownService.render(''), '')
    assert.equal(await MarkdownService.render('   '), '')

    assert.isNull(await MarkdownService.renderOrNull(null))
    assert.isNull(await MarkdownService.renderOrNull(''))
    assert.isNull(await MarkdownService.renderOrNull('   \n\t'))
    assert.isNotNull(await MarkdownService.renderOrNull('Ada teks'))
  })
})

test.group('Fase 4: PublicMediaTransformer', () => {
  test('mentransformasi media gambar dengan varian responsif', ({ assert }) => {
    const imageMedia = new Media()
    imageMedia.id = 10
    imageMedia.kind = 'image'
    imageMedia.title = 'Screenshot Aplikasi'
    imageMedia.altText = 'Tampilan beranda portofolio'
    imageMedia.caption = 'Foto tangkapan layar v1'
    imageMedia.storageKey = 'images/abc.webp'
    imageMedia.mimeType = 'image/webp'
    imageMedia.width = 1600
    imageMedia.height = 900
    imageMedia.variants = {
      thumb: 'images/abc-thumb.webp',
      md: 'images/abc-md.webp',
      lg: 'images/abc-lg.webp',
    }

    const transformed = PublicMediaTransformer.transform(imageMedia)
    assert.isNotNull(transformed)
    assert.equal(transformed?.id, 10)
    assert.equal(transformed?.kind, 'image')
    assert.equal(transformed?.altText, 'Tampilan beranda portofolio')
    assert.equal(transformed?.urls.original, '/uploads/images/abc.webp')
    assert.equal(transformed?.urls.thumb, '/uploads/images/abc-thumb.webp')
    assert.equal(transformed?.urls.md, '/uploads/images/abc-md.webp')
    assert.equal(transformed?.urls.lg, '/uploads/images/abc-lg.webp')
    assert.isNull(transformed?.youtube)
    assert.isNull(transformed?.posterUrl)
  })

  test('mentransformasi media video dengan poster', ({ assert }) => {
    const videoMedia = new Media()
    videoMedia.id = 20
    videoMedia.kind = 'video'
    videoMedia.storageKey = 'videos/demo.mp4'
    videoMedia.posterKey = 'videos/demo-poster.webp'
    videoMedia.mimeType = 'video/mp4'
    videoMedia.durationSeconds = 120

    const transformed = PublicMediaTransformer.transform(videoMedia)
    assert.isNotNull(transformed)
    assert.equal(transformed?.kind, 'video')
    assert.equal(transformed?.urls.original, '/uploads/videos/demo.mp4')
    assert.equal(transformed?.posterUrl, '/uploads/videos/demo-poster.webp')
    assert.equal(transformed?.durationSeconds, 120)
    assert.isNull(transformed?.youtube)
  })

  test('mentransformasi media YouTube', ({ assert }) => {
    const ytMedia = new Media()
    ytMedia.id = 30
    ytMedia.kind = 'youtube'
    ytMedia.youtubeId = 'dQw4w9WgXcQ'
    ytMedia.youtubeStartSeconds = 45

    const transformed = PublicMediaTransformer.transform(ytMedia)
    assert.isNotNull(transformed)
    assert.equal(transformed?.kind, 'youtube')
    assert.deepEqual(transformed?.youtube, {
      id: 'dQw4w9WgXcQ',
      startSeconds: 45,
    })
    assert.deepEqual(transformed?.urls, {})
    assert.isNull(transformed?.posterUrl)
  })

  test('mentransformasi media dokumen PDF', ({ assert }) => {
    const docMedia = new Media()
    docMedia.id = 40
    docMedia.kind = 'document'
    docMedia.storageKey = 'docs/resume.pdf'
    docMedia.mimeType = 'application/pdf'

    const transformed = PublicMediaTransformer.transform(docMedia)
    assert.isNotNull(transformed)
    assert.equal(transformed?.kind, 'document')
    assert.equal(transformed?.urls.original, '/uploads/docs/resume.pdf')
    assert.isNull(transformed?.youtube)
  })

  test('mentransformasi banyak media dan menyaring null', ({ assert }) => {
    const imageMedia = new Media()
    imageMedia.id = 1
    imageMedia.kind = 'image'
    imageMedia.storageKey = 'img.webp'

    const list = PublicMediaTransformer.transformMany([null, imageMedia, undefined])
    assert.lengthOf(list, 1)
    assert.equal(list[0].id, 1)
  })
})
