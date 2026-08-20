# Status Deployment Vercel — Fauzi / Journal

## Status akhir

Deployment **Production** Fauzi / Journal telah berhasil dan tersedia di [fauzi-journal.vercel.app][1]. Versi aktif berasal dari branch `main` pada commit [`130ed2b`][2], dengan deployment Vercel `DqAArwdsdgykmsVJ8eoVbJK1qPyy` berstatus **Ready**. Konfigurasi ini menggantikan deployment sebelumnya yang gagal karena URL media publik belum tersedia.

| Komponen | Status | Konfigurasi terverifikasi |
|---|---|---|
| Situs Production | **Ready** | [fauzi-journal.vercel.app][1] |
| Repository | **Tersinkron** | [`fauzinoorsyabani/fauzi-journal`][3], branch `main` |
| Deployment aktif | **Ready** | [Vercel deployment `DqAArwdsdgykmsVJ8eoVbJK1qPyy`][4] |
| Public media store | **Aktif** | `fauzi-journal-media`, region `iad1`, akses **Public** |
| URL dasar media | **Aktif** | `https://gwst4iapywswxoyh.public.blob.vercel-storage.com` |
| Build Vercel lokal | **Lulus** | `pnpm build:vercel` dengan URL media publik |
| Unit test | **Lulus** | 4 assertions pada 3 test files |

## Konfigurasi yang diterapkan

Vercel Blob store `fauzi-journal-media` telah terhubung pada Environment **Production** dan **Preview**. Variabel `VITE_PUBLIC_MEDIA_BASE_URL` telah disetel untuk kedua environment dengan nilai public Blob base URL. Koneksi storage Vercel menggunakan OIDC dan menyediakan `BLOB_STORE_ID` serta `BLOB_WEBHOOK_PUBLIC_KEY`; runtime Vercel tidak lagi bergantung pada storage host sebelumnya.

Lima aset editorial awal telah dipindahkan ke prefix `fauzi-journal/`: `lensstories-hero.jpg`, `lensstories-people.jpg`, `lensstories-impact.jpg`, `lensstories-bts.jpg`, dan `lensstories-mark.png`. Hero, brand mark, kartu cerita, gambar behind-the-scenes, serta gambar pada halaman cerita mengarah ke URL Blob publik. Aset impact juga telah diperiksa langsung dan dapat didekode browser pada resolusi 1920×1280.[5]

## Validasi production

| Area | Hasil |
|---|---|
| Beranda | Memuat masthead Fauzi / Journal, hero, indeks cerita, marquee, footer, dan gambar dari Vercel Blob. |
| Halaman cerita | Route langsung `/stories/the-quiet-shift` berfungsi dan memuat asset hero, impact, serta behind-the-scenes. |
| Routing SPA | URL beranda dan halaman cerita dapat diakses langsung pada domain Production. |
| Identitas browser | Title Production: **Fauzi / Journal — The Everyday Archive**. |
| Metadata | Description telah diperbarui menjadi identitas Fauzi / Journal. |
| Form publik | Form subscribe dan media inquiry tampil, tetapi tidak dikirim selama validasi agar database Production tidak menerima data uji. |

## Operasional selanjutnya

Untuk pembaruan kode berikutnya, push ke branch `main` pada repository GitHub. Vercel akan membuat deployment Production otomatis dengan environment media yang sudah terpasang. Jika aset editorial baru perlu ditambahkan melalui Studio pada Vercel, verifikasi dahulu alur upload berbasis OIDC pada runtime, karena token `BLOB_READ_WRITE_TOKEN` tidak diekspos sebagai environment variable project.

> **Catatan batasan yang masih terpisah dari deployment:** autentikasi Studio berbasis Manus OAuth masih memerlukan pemulihan akses platform/redirect yang sebelumnya menghasilkan 403. Hal ini tidak memblokir halaman publik Vercel, media Blob, atau deployment Production.

## Referensi

[1]: https://fauzi-journal.vercel.app/ "Fauzi / Journal Production"
[2]: https://github.com/fauzinoorsyabani/fauzi-journal/commit/130ed2be57c55105935e5baec43d67b28df4363b "Commit metadata Fauzi / Journal"
[3]: https://github.com/fauzinoorsyabani/fauzi-journal "Repository Fauzi / Journal"
[4]: https://vercel.com/fauzins-projects/fauzi-journal/DqAArwdsdgykmsVJ8eoVbJK1qPyy "Vercel Production Deployment"
[5]: https://gwst4iapywswxoyh.public.blob.vercel-storage.com/fauzi-journal/lensstories-impact.jpg "Aset impact pada Vercel Blob"
