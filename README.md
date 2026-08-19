# Fauzi / Journal

> **A visual journal for field notes, image-led stories, and the work beneath the surface.**

Fauzi / Journal adalah platform editorial imersif yang dibangun sebagai pengalaman publik bernuansa gallery noir sekaligus workspace privat untuk penerbitan cerita. Website menggabungkan hero sinematik, story index full-bleed, halaman cerita dengan parallax yang lembut, dan sistem CMS internal agar tim dapat menyimpan draft serta menerbitkan cerita tanpa mengubah source code.

## Highlight

| Area | Implementasi |
| --- | --- |
| **Public journal** | Landing page editorial, story archive, route detail per slug, navigasi antarcerita, dan footer media inquiry. |
| **Cinematic reading** | Hero full-bleed, parallax berbasis `transform`, scroll progress, serta reveal teks berbasis viewport. Motion non-esensial dihormati melalui `prefers-reduced-motion`. |
| **Editorial CMS** | Workspace privat pada `/studio` untuk membuat draft, menulis dengan rich editor, preview reading layout, upload cover image, dan menerbitkan cerita. |
| **Lead inbox** | Form media inquiry tervalidasi tersimpan ke database dan dapat ditindaklanjuti lewat status `new`, `reviewed`, atau `contacted`. |
| **Journal subscribers** | Footer opt-in dengan persetujuan eksplisit, daftar subscriber privat, unsubscribe token, serta log notifikasi publish yang siap dikirim melalui provider email di tahap berikutnya. |
| **Brand system** | Masthead **Fauzi / Journal**, aperture mark, palette obsidian–warm white–Signal Brass, serta kombinasi Bodoni Moda, Manrope, dan IBM Plex Mono. |

## Technology

| Layer | Stack |
| --- | --- |
| Frontend | React 19, TypeScript, Wouter, Tailwind CSS 4, TipTap rich text editor, Framer Motion utilities |
| Backend | Express 4 dan tRPC 11 |
| Persistence | MySQL/TiDB melalui Drizzle ORM |
| Auth | Manus OAuth dengan role `admin` untuk workspace editorial |
| Media | Object storage terkelola untuk upload cover image CMS |
| Tests | Vitest |

## Local Development

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

## Database Setup

Schema editorial berada pada `drizzle/schema.ts` dan mencakup tabel `users`, `stories`, `mediaInquiries`, `subscribers`, serta `newsletterDeliveries`. Untuk menghasilkan migration baru setelah mengubah schema, gunakan:

```bash
pnpm drizzle-kit generate
```

Kemudian review SQL yang dihasilkan di `drizzle/` sebelum menerapkan migration ke database target. Tabel `stories` menyimpan metadata, chapter fallback, dan dokumen rich text TipTap. Tabel `mediaInquiries` menyimpan lead, sedangkan `subscribers` dan `newsletterDeliveries` menyimpan persetujuan pembaca serta catatan setiap notifikasi jurnal yang siap dikirim.

## Publishing Workflow

1. Buka `/studio` dan masuk menggunakan akun editor/admin.
2. Pilih **New story** untuk membuat draft baru.
3. Isi metadata, cover image, alt text, dan body menggunakan rich editor.
4. Toolbar editor mendukung **bold, italic, heading, quote, daftar, link, gambar, dan caption gambar**. Gunakan **Preview** untuk memeriksa layout baca sebelum publikasi.
5. Pilih **Save draft** untuk menyimpan pekerjaan atau **Publish story** untuk menayangkannya pada public journal.
6. Buka **Subscribers** untuk melihat pembaca yang melakukan opt-in dan log notifikasi publish yang sudah diantrekan.
7. Buka **Inquiries** untuk melihat lead dari footer media inquiry dan perbarui status follow-up.

> Akun owner akan dipetakan sebagai `admin` secara otomatis. Akun tambahan dapat dipromosikan melalui kolom `role` pada tabel `users`.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Homepage dengan featured story, story grid, impact note, dan behind-the-scenes. |
| `/stories` | Arsip semua cerita publik. |
| `/stories/:slug` | Halaman cerita sinematik. |
| `/studio` | Dashboard CMS internal untuk draft dan published stories. |
| `/studio/new` | Editor untuk membuat atau menyunting story. |
| `/studio/subscribers` | Daftar subscriber opt-in dan log notifikasi publish internal. |
| `/studio/inquiries` | Lead inbox internal untuk media inquiry. |
| `/unsubscribe?token=…` | Halaman unsubscribe berbasis token pribadi subscriber. |

## Environment

Platform menyediakan environment variables untuk database, OAuth, dan storage secara otomatis. Jangan commit file `.env` atau credential ke repository.

Integrasi email outbound sengaja **ditunda** untuk saat ini. Ketika sebuah jurnal dipublikasikan, sistem membuat catatan notifikasi `queued` untuk setiap subscriber yang aktif; catatan tersebut dapat dikirim melalui provider pilihan—misalnya Resend atau Brevo—pada tahap berikutnya. Jangan commit file `.env` atau credential ke repository.

## Known Platform Blocker

Route `/studio` pada domain production telah memuat layar sign-in dengan benar. Namun, tombol **Enter studio** saat ini diarahkan ke `manus.im/app-auth` dan menerima respons CloudFront `403` sebelum OAuth callback kembali ke aplikasi. Kode frontend sudah menggunakan `window.location.origin` untuk membentuk callback `/api/oauth/callback`, sehingga kendala ini berada pada layanan autentikasi/edge platform. Gunakan [Manus Help](https://help.manus.im) dan sertakan CloudFront Request ID bila masalah masih terjadi.

## Project Structure

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

## Quality Checks

Sebelum release, jalankan `pnpm test`, `pnpm check`, dan `pnpm build`. Verifikasi juga alur berikut secara manual: menulis rich content, menambahkan image-caption, preview draft, publish story, membuka story berdasarkan slug, subscribe dan unsubscribe, serta mengubah status lead pada inbox internal.

## Next Enhancements

Hubungkan provider email seperti Resend, Brevo, atau Mailchimp untuk mengirim seluruh record `queued` pada `newsletterDeliveries` ke subscriber aktif. Fitur berikutnya yang layak dipertimbangkan adalah multi-author permissions, scheduled publishing, dan analytics newsletter.
