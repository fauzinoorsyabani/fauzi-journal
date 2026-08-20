# Verifikasi Form Publik Tanpa Menulis Data

## Tujuan

Fauzi / Journal menyediakan mode **dry-run** untuk memverifikasi alur submit inquiry, subscribe, dan unsubscribe tanpa menulis ke database. Mode ini hanya aktif apabila environment server `FORM_DRY_RUN` bernilai tepat `true`.

| Environment | `FORM_DRY_RUN` | Dampak mutation publik |
|---|---:|---|
| Production / default | Tidak disetel atau selain `true` | Perilaku normal: data diproses oleh service persistence. |
| Pengembangan atau QA aman | `true` | Input tetap divalidasi, tetapi router mengembalikan respons sukses `dryRun: true` tanpa memanggil service persistence. |

## Cara menjalankan pemeriksaan aman

Jalankan instance pengembangan terpisah dengan `FORM_DRY_RUN=true` dan port yang tidak dipakai, misalnya `FORM_DRY_RUN=true PORT=3101 pnpm dev`. Setelah server aktif, jalankan `SITE_URL=http://localhost:3101 pnpm test:forms:e2e`. Harness Chromium akan mengisi serta submit Subscribe, Media Inquiry, dan Unsubscribe dengan data sintetis, lalu memastikan setiap respons memiliki `dryRun: true`. Service database tidak dipanggil.

> Jangan mengaktifkan `FORM_DRY_RUN` pada Production. Mode ini dibuat khusus untuk QA dan akan membuat form tampak berhasil tanpa menyimpan inquiry atau perubahan subscriber.
