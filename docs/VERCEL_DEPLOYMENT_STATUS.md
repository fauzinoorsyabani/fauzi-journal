# Status Deployment Vercel — Fauzi / Journal

## Status akhir

Deployment **Production** Fauzi / Journal tersedia di [fauzi-journal.vercel.app][1]. Source terbaru pada branch `main` adalah commit [`1e42cc4`][2], dan deployment Production Vercel berstatus **Ready**. Konfigurasi ini menggantikan deployment sebelumnya yang gagal karena URL media publik belum tersedia.

| Komponen | Status | Konfigurasi terverifikasi |
|---|---|---|
| Situs Production | **Ready** | [fauzi-journal.vercel.app][1] |
| Repository | **Tersinkron** | [`fauzinoorsyabani/fauzi-journal`][3], branch `main` |
| Deployment aktif | **Ready** | Production dipicu dari branch `main` |
| Public media store | **Aktif** | `fauzi-journal-media`, region `iad1`, akses **Public** |
| URL dasar media | **Aktif** | `https://gwst4iapywswxoyh.public.blob.vercel-storage.com` |
| Build Vercel lokal | **Lulus** | `pnpm build:vercel` dengan URL media publik |
| Unit test | **Lulus** | 12 assertions pada 5 test files |
| Serverless API | **Pulih** | Bootstrap, tRPC health, dan callback OAuth diverifikasi di Production |

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
| Form publik | UI Production tervalidasi tanpa submit. Jalur submit lengkap diverifikasi melalui instance dry-run lokal yang tidak memanggil persistence database. |
| Bootstrap API | `GET /api` mencapai Express dan mengembalikan `404 Cannot GET /api`; tidak lagi `FUNCTION_INVOCATION_FAILED`. |
| tRPC health | `GET /api/trpc/system.health` mengembalikan `200` dengan `{ "ok": true }`. |
| Callback OAuth invalid-state | `GET /api/oauth/callback` dengan state tidak valid mengembalikan `303` ke `/studio?authError=state`. |

## QA form tanpa data Production

Mode `FORM_DRY_RUN=true` membuat router memvalidasi input lalu mengembalikan `dryRun: true` sebelum service inquiry atau subscriber dipanggil. Dokumentasi [FORM_DRY_RUN.md](./FORM_DRY_RUN.md) menjelaskan cara menjalankan server QA pada port terpisah serta harness `pnpm test:forms:e2e`.

| Alur | Pemeriksaan harness | Hasil |
|---|---|---|
| Subscribe | Submit UI ke instance dry-run | Response `200`, state sukses tampil, `dryRun: true` |
| Media inquiry | Submit UI ke instance dry-run | Response `200`, state sukses tampil, `dryRun: true` |
| Unsubscribe | Token sintetis ke instance dry-run | Response `200`, state sukses tampil, `dryRun: true` |

## Pemulihan Vercel Serverless

Pada pemeriksaan Production, seluruh request `/api/*` sebelumnya gagal saat inisialisasi Function dengan `FUNCTION_INVOCATION_FAILED`. Diagnosis respons terkontrol menunjukkan Node runtime tidak dapat menemukan `/var/task/server/app`. Perbaikan mengganti pemuatan dinamis entrypoint menjadi import statis dan menormalkan import runtime pada graph server ke ekstensi `.js`, sehingga Vercel dapat menelusuri serta menyertakan modul server ke dalam Function bundle. Pendekatan export Express statis ini sejalan dengan kontrak deployment Express Vercel.[6]

Perbaikan tersebut telah diperiksa pada Production tanpa mengirim data form atau menjalankan login editor: endpoint dasar sekarang dijawab oleh Express, health tRPC mengembalikan `200`, dan callback OAuth state-invalid menghasilkan redirect pemulihan `303`. Keberhasilan login editor dengan state valid tetap merupakan verifikasi terpisah yang memerlukan sesi pengguna sah.

## Operasional selanjutnya

Untuk pembaruan kode berikutnya, push ke branch `main` pada repository GitHub. Vercel akan membuat deployment Production otomatis dengan environment media yang sudah terpasang. Jika aset editorial baru perlu ditambahkan melalui Studio pada Vercel, verifikasi dahulu alur upload berbasis OIDC pada runtime, karena token `BLOB_READ_WRITE_TOKEN` tidak diekspos sebagai environment variable project.

> **Catatan batasan yang masih terpisah dari deployment:** pemeriksaan terakhir menunjukkan route hosted `/studio` telah kembali merespons halaman sign-in, bukan lagi error CloudFront 403. Callback dengan state tidak valid kini juga terbukti kembali ke halaman pemulihan Studio. Autentikasi Studio berbasis Manus OAuth yang lengkap tetap membutuhkan login interaktif; karena itu keberhasilan callback dengan sesi editor yang sah belum dapat diklaim. Hal ini tidak memblokir halaman publik Vercel, media Blob, atau deployment Production.

## Status Studio dan OAuth

Pemeriksaan langsung pada `https://lensstory-sw8onh5d.manus.space/studio` kini menampilkan shell **Sign in to continue** beserta tombol **Enter studio**, bukan respons CloudFront 403. Tidak ada perubahan kode atau konfigurasi aplikasi yang dapat diatribusikan sebagai perbaikan CloudFront; karena itu pemulihan dicatat sebagai gangguan hosting/platform yang **tidak lagi reproduktif**, bukan root-cause fix yang telah terbukti.

Implementasi OAuth menggunakan `window.location.origin` untuk `redirectUri` dan nonce satu kali pada cookie host-only. Route `registerOAuthRecoveryRoute(app)` didaftarkan sebelum route framework OAuth sehingga runtime hosted menggunakan callback milik aplikasi. Test callback memverifikasi bahwa state/cookie yang tidak cocok dihentikan sebelum pertukaran token dan dialihkan secara aman, sedangkan parameter callback yang tidak lengkap menghasilkan `400`; total suite memuat 12 assertions pada 5 test files. Login interaktif dan publish CMS end-to-end tetap memerlukan sesi editor yang sah.

### Perbaikan pemulihan callback

State OAuth yang tidak cocok tetap dihentikan **sebelum** pertukaran token, tetapi callback sekarang mengembalikan `303` ke `/studio?authError=state` alih-alih menampilkan halaman `403` mentah. Studio menampilkan pesan bahwa sesi sign-in kadaluarsa atau terinterupsi dan menawarkan login ulang. Verifikasi browser pada **hosted domain** menunjukkan callback dengan state tidak valid berakhir di state pemulihan tersebut. Callback dengan nonce yang cocok diuji terhadap provider mock, sehingga guard keamanan dan jalur pertukaran token dapat diperiksa tanpa kredensial pengguna.

> **Batas bukti:** verifikasi ini membuktikan jalur pemulihan untuk login yang terputus atau memiliki state tidak valid; verifikasi ini **belum** membuktikan bahwa seorang editor dapat menyelesaikan login OAuth dengan state valid pada hosted domain. Penyebab awal respons CloudFront 403 juga tidak lagi dapat direproduksi dan tidak dapat diatribusikan sebagai root-cause aplikasi tanpa akses platform.

| Verifikasi yang tertunda | Prasyarat | Langkah aman setelah tersedia |
|---|---|---|
| Redirect OAuth end-to-end | Sesi editor dapat login pada browser | Tekan **Enter studio**, selesaikan autentikasi, lalu konfirmasi callback kembali ke aplikasi tanpa `403`. |
| Publish CMS end-to-end | Akun editor dengan peran admin | Buat draft dengan slug unik, gunakan preview, publish, dan buka URL cerita publik. Jangan gunakan email atau inquiry uji pada Production. |

## Referensi

[1]: https://fauzi-journal.vercel.app/ "Fauzi / Journal Production"
[2]: https://github.com/fauzinoorsyabani/fauzi-journal/commit/1e42cc4 "Commit kompatibilitas Node ESM untuk Vercel API"
[3]: https://github.com/fauzinoorsyabani/fauzi-journal "Repository Fauzi / Journal"
[5]: https://gwst4iapywswxoyh.public.blob.vercel-storage.com/fauzi-journal/lensstories-impact.jpg "Aset impact pada Vercel Blob"
[6]: https://vercel.com/docs/frameworks/backend/express "Express on Vercel"
