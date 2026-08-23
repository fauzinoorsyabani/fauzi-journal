# Fauzi / Journal

> **Jurnal personal tentang kebiasaan kecil, cara berpikir, dan ruang untuk bertumbuh tanpa terburu-buru.**

Fauzi / Journal adalah platform editorial imersif yang dibangun sebagai pengalaman publik bernuansa gallery noir sekaligus workspace privat untuk penerbitan cerita. Website menggabungkan hero sinematik, story index full-bleed, halaman cerita dengan parallax yang lembut, dan sistem CMS internal agar tim dapat menyimpan draft serta menerbitkan cerita tanpa mengubah source code.

## Sorotan

| Area | Implementasi |
| --- | --- |
| **Jurnal publik** | Beranda editorial, arsip cerita, route detail per slug, navigasi antarcerita, dan footer pertanyaan media. |
| **Pembacaan sinematik** | Hero full-bleed, parallax berbasis `transform`, scroll progress, serta reveal teks berbasis viewport. Motion non-esensial dihormati melalui `prefers-reduced-motion`. |
| **CMS editorial** | Ruang kerja privat pada `/studio` untuk membuat draf, menulis dengan rich editor, melihat pratinjau layout baca, mengunggah gambar sampul, dan menerbitkan cerita. |
| **Inbox prospek** | Form pertanyaan media tervalidasi disimpan ke database dan dapat ditindaklanjuti lewat status `new`, `reviewed`, atau `contacted`. |
| **Pelanggan jurnal** | Footer opt-in dengan persetujuan eksplisit, daftar pelanggan privat, token unsubscribe, serta log notifikasi terbit yang siap dikirim melalui provider email di tahap berikutnya. |
| **Sistem merek** | Masthead **Fauzi / Journal**, aperture mark, palet obsidian–warm white–Signal Brass, serta kombinasi Bodoni Moda, Manrope, dan IBM Plex Mono. |

## Untuk Fauzi: Tambah Jurnal Tanpa Kode

Semua jurnal baru dibuat dari **Studio**; Anda tidak perlu membuka GitHub, mengubah source code, atau melakukan deploy manual. Buka [Studio Production](https://fauzi-journal.vercel.app/studio), masuk dengan akun editor, lalu ikuti alur berikut.

| Urutan | Tindakan di Studio | Hasil yang diharapkan |
| --- | --- | --- |
| 1 | Pilih **Cerita baru**. | Studio membuka draf baru yang belum terlihat publik. |
| 2 | Isi nomor cerita, kategori, judul, slug, dan pembuka singkat. | Identitas jurnal serta URL publik siap digunakan. |
| 3 | Tambahkan URL/unggah gambar sampul dan isi **teks alternatif** yang menjelaskan foto. | Cover dapat diakses dan tampil pada jurnal. |
| 4 | Tulis isi di editor. Gunakan **H2** untuk bagian, **italic** untuk judul buku, **tebal** untuk kata penting, dan **Kutipan** untuk satu gagasan yang ingin ditonjolkan. | Naskah memiliki ritme baca yang jelas. |
| 5 | Pilih **Simpan draf**, kemudian **Pratinjau**. | Anda dapat memeriksa judul, gambar, caption, tautan, dan susunan sebelum tayang. |
| 6 | Saat siap, pilih **Terbitkan cerita**. | Jurnal muncul di `/stories` dan URL `/stories/[slug]`. |

> **Kebiasaan yang aman:** selalu simpan draf sebelum menerbitkan. Jika ada revisi setelah tayang, buka jurnal di Studio, pilih **Sunting**, perbarui naskah, lalu simpan kembali. Perubahan pada jurnal terbit akan memperbarui halaman publiknya.

Panduan lengkap, contoh struktur tulisan, checklist publish, dan cara menangani pelanggan tersedia di [PANDUAN_PENERBITAN_JURNAL.md](./PANDUAN_PENERBITAN_JURNAL.md).

## Teknologi

| Layer | Stack |
| --- | --- |
| Frontend | React 19, TypeScript, Wouter, Tailwind CSS 4, TipTap rich text editor, Framer Motion utilities |
| Backend | Express 4 dan tRPC 11 |
| Persistence | MySQL/TiDB melalui Drizzle ORM |
| Auth | Manus OAuth dengan role `admin` untuk workspace editorial |
| Media | Object storage terkelola untuk upload cover image CMS |
| Tests | Vitest |

## Pengembangan Lokal

Install dependencies, lalu jalankan server development:

```bash
pnpm install
pnpm dev
```

Untuk menjalankan type-check, test, dan build production:

```bash
pnpm check
pnpm test
pnpm build
```

## Pengaturan Database

Schema editorial berada pada `drizzle/schema.ts` dan mencakup tabel `users`, `stories`, `mediaInquiries`, `subscribers`, serta `newsletterDeliveries`. Untuk menghasilkan migration baru setelah mengubah schema, gunakan:

```bash
pnpm drizzle-kit generate
```

Kemudian review SQL yang dihasilkan di `drizzle/` sebelum menerapkan migration ke database target. Tabel `stories` menyimpan metadata, chapter fallback, dan dokumen rich text TipTap. Tabel `mediaInquiries` menyimpan lead, sedangkan `subscribers` dan `newsletterDeliveries` menyimpan persetujuan pembaca serta catatan setiap notifikasi jurnal yang siap dikirim.

## Alur Penerbitan Ringkas

1. Buka `/studio` dan masuk menggunakan akun editor/admin.
2. Pilih **Cerita baru** untuk membuat draf baru.
3. Isi metadata, gambar sampul, teks alternatif, dan isi jurnal menggunakan rich editor.
4. Toolbar editor mendukung **tebal, italic, subjudul, kutipan, daftar, tautan, gambar, dan keterangan gambar**. Gunakan **Pratinjau** untuk memeriksa layout baca sebelum publikasi.
5. Pilih **Simpan draf** untuk menyimpan pekerjaan atau **Terbitkan cerita** untuk menayangkannya pada jurnal publik.
6. Buka **Pelanggan** untuk melihat pembaca yang melakukan opt-in dan log notifikasi terbit yang sudah diantrekan.
7. Buka **Pertanyaan** untuk melihat prospek dari footer pertanyaan media dan memperbarui status tindak lanjut.

> Akun owner akan dipetakan sebagai `admin` secara otomatis. Akun tambahan dapat dipromosikan melalui kolom `role` pada tabel `users`.

## Route

| Route | Purpose |
| --- | --- |
| `/` | Beranda dengan cerita pilihan, grid cerita, catatan dampak, dan di balik layar. |
| `/stories` | Arsip semua cerita publik. |
| `/stories/:slug` | Halaman cerita sinematik. |
| `/studio` | Dashboard CMS internal untuk draf dan cerita yang sudah diterbitkan. |
| `/studio/new` | Editor untuk membuat atau menyunting cerita. |
| `/studio/subscribers` | Daftar pelanggan opt-in dan log notifikasi terbit internal. |
| `/studio/inquiries` | Inbox prospek internal untuk pertanyaan media. |
| `/unsubscribe?token=…` | Halaman berhenti berlangganan berbasis token pribadi pelanggan. |

## Environment

Platform menyediakan environment variables untuk database, OAuth, dan storage secara otomatis. Jangan commit file `.env` atau credential ke repository.

Integrasi email outbound sengaja **ditunda** untuk saat ini. Ketika sebuah jurnal dipublikasikan, sistem membuat catatan notifikasi `queued` untuk setiap subscriber yang aktif; catatan tersebut dapat dikirim melalui provider pilihan—misalnya Resend atau Brevo—pada tahap berikutnya. Jangan commit file `.env` atau credential ke repository.

## Deploy di Vercel

Project ini sudah memiliki `vercel.json`, entrypoint serverless pada `api/index.ts`, serta command `pnpm build:vercel`. Vercel menjalankan Express sebagai Function dan menyajikan asset statis dari hasil Vite build; fallback rewrite menjaga deep link seperti `/stories/:slug` tetap dibuka oleh client router. Panduan resmi Vercel menyatakan asset static harus dilayani dari `public/**`, sedangkan `express.static()` tidak digunakan untuk Express yang berjalan sebagai Vercel Function.[^vercel-express]

### Langkah deploy

1. Di Vercel, pilih **Add New → Project**, lalu import repository privat `fauzinoorsyabani/fauzi-journal`.
2. Gunakan Node.js 22. `vercel.json` sudah menetapkan build command `pnpm build:vercel` dan output `dist/public`.
3. Buat **public Vercel Blob store**, lalu sambungkan store tersebut ke project Vercel. Public Blob URLs memang ditujukan untuk gambar yang ditampilkan kepada pembaca.[^vercel-blob]
4. Setelah store tersambung, ambil root URL publik Blob dan set environment variable berikut di Vercel untuk **Preview** dan **Production**:

   ```text
   VITE_PUBLIC_MEDIA_BASE_URL=https://<blob-store>.public.blob.vercel-storage.com
   ```

   Build Vercel sengaja akan berhenti jika variable ini tidak diisi. Dengan begitu, deployment tidak diam-diam kembali bergantung pada storage hosting lama.

5. Migrasikan lima gambar editorial awal ke prefix `fauzi-journal/`. Pada mesin lokal yang memiliki `BLOB_READ_WRITE_TOKEN`, jalankan:

   ```bash
   pnpm media:migrate:vercel
   ```

   Skrip mengambil aset lama satu kali lalu mengunggahnya ke Vercel Blob. Jangan commit token ini ke GitHub. Di Function Vercel yang project-nya sudah tersambung dengan Blob, SDK `@vercel/blob` memakai OIDC secara otomatis untuk upload cover baru.[^vercel-blob]

6. Tambahkan environment variable production berikut pada Vercel:

   | Variable | Kegunaan |
   | --- | --- |
   | `DATABASE_URL` | Database MySQL/TiDB yang dapat diakses dari Vercel Functions. Jalankan migration Drizzle terhadap database target sebelum memakai Studio. |
   | `JWT_SECRET` | Menandatangani session editor. Gunakan nilai baru yang panjang dan rahasia untuk deployment eksternal. |
   | `OWNER_OPEN_ID` | Menetapkan akun owner sebagai admin setelah OAuth berhasil. |
   | `VITE_APP_ID`, `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL` | Diperlukan bila Studio tetap memakai Manus OAuth. Redirect URI Vercel `/api/oauth/callback` harus diizinkan oleh provider OAuth. |
   | `VITE_PUBLIC_MEDIA_BASE_URL` | Root URL public Vercel Blob untuk visual editorial fallback. |

> **Catatan penting:** source code sudah Vercel-ready, tetapi database production dan OAuth tidak dapat dipindahkan otomatis karena keduanya memerlukan credential serta konfigurasi akun pemilik. Jika redirect OAuth Manus tidak menerima domain Vercel, gunakan provider auth yang mengizinkan callback domain baru atau selesaikan allowlist redirect dengan provider tersebut.

### Setelah GitHub terhubung

Setiap push ke branch `main` akan membuat deployment Vercel sesuai pengaturan Git Integration project. Uji dahulu URL Preview, terutama `/stories/...`, `/unsubscribe`, dan `/api/trpc`, sebelum melakukan promosi ke production. Rewrites Vercel mempertahankan URL asli saat meneruskan route SPA ke `index.html`.[^vercel-rewrites]

[^vercel-express]: [Vercel — Express on Vercel](https://vercel.com/docs/frameworks/backend/express)
[^vercel-blob]: [Vercel — Vercel Blob](https://vercel.com/docs/vercel-blob)
[^vercel-rewrites]: [Vercel — Rewrites](https://vercel.com/docs/routing/rewrites)

## Status Studio dan OAuth

Route `/studio` pada domain hosted telah memuat layar masuk dengan benar. Callback OAuth state-invalid kini diarahkan kembali ke Studio melalui `/studio?authError=state`, bukan ke respons `403` mentah. Login OAuth editor dengan state valid tetap memerlukan sesi editor yang sah untuk diverifikasi secara interaktif.

## Struktur Proyek

```text
client/src/
  components/       # Brand primitives, rich editor, subscriber form, scrolling motion, dashboard UI
  data/             # Fallback editorial stories
  lib/              # tRPC client dan mapping CMS record ke public story model
  pages/            # Public pages dan Studio CMS
drizzle/
  schema.ts         # Data models dan migrations
server/
  editorial.ts      # Database helpers untuk story, inquiry, subscriber, dan notification log
  routers/          # tRPC editorial procedures
  storage.ts        # Managed object storage helper
```

## Pemeriksaan Kualitas

Sebelum release, jalankan `pnpm test`, `pnpm check`, dan `pnpm build`. Verifikasi juga alur berikut secara manual: menulis rich content, menambahkan image-caption, preview draft, publish story, membuka story berdasarkan slug, subscribe dan unsubscribe, serta mengubah status lead pada inbox internal.

## Pengembangan Berikutnya

Hubungkan provider email seperti Resend, Brevo, atau Mailchimp untuk mengirim seluruh record `queued` pada `newsletterDeliveries` ke subscriber aktif. Fitur berikutnya yang layak dipertimbangkan adalah multi-author permissions, scheduled publishing, dan analytics newsletter.
