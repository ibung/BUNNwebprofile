# Aturan: desain dan UI

Baca `docs/DESIGN.md` sebelum menyentuh antarmuka. Referensi visual: `docs/design-reference/index.html` (jangan diedit).

- Desain sudah final dan disetujui pemilik. Tugasmu menerjemahkan ke komponen Nuxt dan merapikannya, bukan mendesain ulang.
- Jangan mengubah palet warna, pasangan font, bentuk kartu dan tombol, atau bayangan offset tanpa diminta.
- Warna, font, dan jarak diambil dari token CSS di `apps/web/app/assets/css/tokens.css`. Jangan menulis nilai hex atau ukuran baru di komponen.
- Memecah HTML menjadi komponen, menghapus duplikasi, memperbaiki kontras, urutan heading, dan target sentuh itu boleh.
- Setiap gambar punya `alt` dari database. Gambar dekoratif memakai `alt=""` dan `aria-hidden`.
- Video YouTube dimuat setelah diklik dan memakai `youtube-nocookie.com`. Jangan menaruh iframe YouTube yang langsung termuat.
- Hormati `prefers-reduced-motion`, sediakan `:focus-visible`, jaga tanpa scroll horizontal di 360 px.
- Panel admin memakai token yang sama tetapi lebih tenang dan padat (lihat bagian "Panel admin" di `docs/DESIGN.md`).
- Setelah mengubah UI, bandingkan hasilnya dengan referensi di lebar 360, 768, dan 1280 px.
