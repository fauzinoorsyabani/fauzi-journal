# Status Deployment Vercel

## Kondisi saat ini

Project Vercel **fauzi-journal** telah terhubung ke repository GitHub `fauzinoorsyabani/fauzi-journal` dan branch production adalah `main`.

Preview deployment untuk commit `2410f857` gagal pada tahap build karena `VITE_PUBLIC_MEDIA_BASE_URL` belum tersedia. Kegagalan ini disengaja: konfigurasi build mewajibkan public Vercel Blob URL agar aset editorial tidak kembali bergantung pada storage host lama.

## Tindakan berikutnya

1. Buat atau hubungkan public Vercel Blob store melalui menu **Storage**.
2. Set `VITE_PUBLIC_MEDIA_BASE_URL` pada Environment Variables Preview dan Production ke root URL public Blob store.
3. Jalankan `pnpm media:migrate:vercel` dengan `BLOB_READ_WRITE_TOKEN` pada lingkungan lokal yang aman untuk memindahkan lima aset editorial awal.
4. Push atau redeploy branch `main`, lalu verifikasi deployment preview dan production.

## Batas konfigurasi external

Database production (`DATABASE_URL`) dan OAuth Studio memerlukan credential serta callback domain Vercel yang diizinkan. Keduanya tidak dapat dipindahkan otomatis dari hosting sebelumnya.

## Observasi dashboard

Halaman Storage tingkat project hanya menampilkan koneksi database. Halaman Storage tingkat team menyediakan kategori **Blob** pada filter provider; gunakan halaman team tersebut untuk membuat store media public sebelum kembali ke Environment Variables project.

Sesi browser sempat kembali ke halaman kosong ketika filter Blob dibuka, sehingga halaman team storage perlu dimuat ulang sebelum pembuatan store diteruskan.

Setelah dimuat ulang, filter provider menampilkan opsi **Blob**. Pilih opsi tersebut untuk menampilkan atau memulai pembuatan Blob store.

Tombol **Create Database** membuka dialog **Browse Storage** yang menyediakan pilihan **Blob — Fast object storage**. Setelah Blob dipilih, lanjutkan dengan konfigurasi koneksi ke project `fauzi-journal`.

Form Vercel meminta nama store, region permanen, dan mode akses. Untuk aset jurnal, pilih **Public** karena gambar harus dapat dibaca pengunjung tanpa token.

Konfigurasi yang dipilih: nama store `fauzi-journal-media`, region default Washington, D.C. (iad1), dan akses **Public**. Store berhasil dibuat dengan ID `store_gwST4iApYWswXoyH`.

Blob store telah terhubung ke project `fauzi-journal` pada Environment **Production** dan **Preview** dengan prefix standar `BLOB`. Dashboard mengonfirmasi bahwa koneksi project memakai **OIDC**; variable yang tampil adalah `BLOB_STORE_ID` dan `BLOB_WEBHOOK_PUBLIC_KEY`, bukan `BLOB_READ_WRITE_TOKEN`. Integrasi server perlu diverifikasi terhadap autentikasi OIDC Vercel sebelum migrasi dan upload CMS dijalankan.

Base URL public yang dikonfirmasi dari pengaturan store adalah `https://gwst4iapywswxoyh.public.blob.vercel-storage.com`. Nilai ini perlu dipasang sebagai `VITE_PUBLIC_MEDIA_BASE_URL` pada Environment Production dan Preview sebelum build dijalankan ulang.

Halaman Environment Variables project telah mengonfirmasi adanya `BLOB_STORE_ID` dan `BLOB_WEBHOOK_PUBLIC_KEY` yang ditambahkan otomatis saat koneksi dibuat. `VITE_PUBLIC_MEDIA_BASE_URL=https://gwst4iapywswxoyh.public.blob.vercel-storage.com` berhasil disimpan sebagai konfigurasi non-sensitif untuk Environment **Production and Preview**. Vercel mengonfirmasi bahwa deployment baru diperlukan agar perubahan berlaku.

Lima aset editorial awal berhasil diunduh dari hosting sebelumnya ke `/home/ubuntu/webdev-static-assets/fauzi-journal-migration/` untuk unggah manual. Semua byte gambar terdeteksi sebagai WebP walaupun nama legacy memakai ekstensi `.jpg`/`.png`; pertahankan nama key legacy agar URL yang dirujuk aplikasi tetap konsisten, dan pastikan dashboard menyimpan MIME type `image/webp` ketika unggah.

Halaman **Manage Blobs** Vercel menampilkan store masih kosong serta tombol **Upload**. Dashboard memiliki input file tersembunyi yang mendukung unggahan banyak file, sehingga lima aset editorial dapat diunggah dalam satu tindakan melalui input tersebut.

Input unggah multi-file tidak diekspos sebagai target yang dapat dipilih oleh antarmuka otomasi meskipun tersedia di DOM. Gunakan mekanisme migrasi alternatif yang kompatibel dengan OIDC Vercel, atau lakukan unggah melalui input ini dengan akses manual jika diperlukan.

Uji browser pada dashboard Vercel berhasil mengambil aset legacy melalui CORS (`200`, `image/webp`). Aset dapat diubah menjadi objek `File` di browser dan disalurkan melalui event perubahan input upload untuk mempertahankan tipe MIME WebP; terlebih dahulu arahkan dashboard ke folder key `fauzi-journal/` agar pathname yang dihasilkan cocok dengan aplikasi.

Folder Blob `fauzi-journal` berhasil dibuat dan dashboard telah berpindah ke prefix tersebut. Lima aset legacy berhasil diunggah: `lensstories-hero.jpg`, `lensstories-people.jpg`, `lensstories-impact.jpg`, `lensstories-bts.jpg`, dan `lensstories-mark.png`. Pathname kini konsisten dengan pemetaan `fauzi-journal/<nama-file>` yang dipakai aplikasi.

Dashboard mencatat tipe berdasarkan ekstensi filename (`image/jpeg` dan `image/png`) meskipun byte sumber asli adalah WebP. Browser modern biasanya mendekode dari header/byte; validasi permintaan publik tetap diperlukan sebelum deployment.

Validasi public berhasil: URL hero `https://gwst4iapywswxoyh.public.blob.vercel-storage.com/fauzi-journal/lensstories-hero.jpg` dapat dimuat tanpa autentikasi pada resolusi 1920×1080. Riwayat deployment menunjukkan commit `2410f85` gagal sebelumnya hanya karena variabel media belum ada; deployment Production untuk commit tersebut siap dijalankan ulang dengan konfigurasi baru.

Menu **Deployment Actions** untuk deployment Production gagal telah dibuka dan menyediakan pilihan **Redeploy**. Karena menu sementara tidak mempertahankan pilihan saat diautomasi, buka halaman detail deployment `7uNGFBJCZ9WWbzumyMibdP66tPtV` untuk menjalankan action redeploy dari kontrol yang lebih stabil tanpa mengubah source branch atau commit.

Redeploy Production telah dikonfirmasi. Vercel membuat deployment baru dengan ID `H5yenKmXgX55xETXTNswYppvNtX5` untuk branch `main`, commit `2410f85`, serta domain `fauzi-journal.vercel.app`. Build selesai **Ready** dalam 45 detik tanpa error konfigurasi `VITE_PUBLIC_MEDIA_BASE_URL`.

Validasi domain production berhasil di `https://fauzi-journal.vercel.app/`. Beranda memuat struktur editorial Fauzi / Journal beserta alamat gambar hero, kartu cerita, behind-the-scenes, dan brand mark dari `https://gwst4iapywswxoyh.public.blob.vercel-storage.com/fauzi-journal/...`. Form subscribe, inquiry, dan tautan Studio hadir pada halaman; pengiriman data tidak diuji agar tidak meninggalkan data uji pada database produksi.

Halaman cerita `/stories/the-quiet-shift` juga dapat diakses langsung di Production dan routing SPA berfungsi. Pemeriksaan elemen gambar di halaman mengonfirmasi hero dan BTS termuat penuh; beberapa gambar non-kritis belum dimuat saat masih berada di luar viewport. Akses langsung ke `lensstories-impact.jpg` membuktikan browser berhasil mendekode aset pada resolusi 1920×1280. Dengan demikian, nilai `naturalWidth: 0` sebelumnya berasal dari lazy loading di luar viewport, bukan kegagalan Blob atau MIME.

Dashboard masih menampilkan tipe berdasarkan ekstensi filename (`image/jpeg`/`image/png`) walaupun byte sumber adalah WebP. Browser memuat aset public dengan benar; tidak perlu upload ulang atau mengubah pathname production saat ini.
