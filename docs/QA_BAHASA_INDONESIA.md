# QA Bahasa Indonesia — Fauzi / Journal

## Pemeriksaan visual

Pemeriksaan pada environment pengembangan dilakukan setelah penataan copy Bahasa Indonesia. Beranda menampilkan hero, arsip, section dampak, di balik layar, marquee, formulir subscriber, dan formulir pertanyaan media dalam Bahasa Indonesia. Judul serta kartu artikel yang berasal dari data editorial tetap mempertahankan bahasa asli.

Halaman indeks cerita menampilkan **Indeks cerita**, koordinat arsip, dan CTA pembaca dalam Bahasa Indonesia. Studio menampilkan navigasi **Cerita**, **Tulis cerita**, **Pelanggan**, dan **Pertanyaan**, bersama status dashboard serta empty state yang telah dilokalkan. Halaman unsubscribe juga menampilkan konfirmasi berhenti berlangganan dalam Bahasa Indonesia.

Pemeriksaan pada viewport mobile `375×812` menunjukkan hero beranda, section cerita, formulir footer, dan kartu Studio tetap mempertahankan hierarki visual serta teks yang terbaca tanpa perubahan layout fungsional.

## Pemeriksaan seri self-development

Pemeriksaan desktop terhadap beranda serta dua jurnal awal menunjukkan seri baru dapat dirender tanpa error. Foto studio, konferensi, latihan, kafe, dan perjalanan digunakan sebagai visual pendukung di dalam cerita; seluruhnya berada dalam frame portrait dengan lebar terbatas, bukan sebagai hero layar penuh. Highlight refleksi memakai aksen Signal Brass dan daftar **Bacaan yang dirujuk** menautkan pembaca ke sumber buku resmi.

Pemeriksaan mobile `375×812` pada beranda, jurnal kebiasaan, dan jurnal waktu menunjukkan frame foto personal tetap proporsional, teks highlight memiliki kontras yang baik, dan tautan referensi muncul setelah isi jurnal tanpa mengganggu alur baca.

Kelima foto personal telah dipindahkan ke Vercel Blob **public** pada `gwst4iapywswxoyh.public.blob.vercel-storage.com`. Pemeriksaan HTTP terhadap setiap URL menghasilkan status `200`, sehingga aset tidak lagi bergantung pada path `/manus-storage/` privat dan dapat digunakan oleh deployment Vercel Production.

## Batas verifikasi

Visual editor yang sudah masuk menampilkan workspace admin pada environment pengembangan. Publikasi cerita end-to-end tetap membutuhkan sesi editor sah pada lingkungan target. Naskah artikel, judul, deck, kutipan, slug, dan rich text milik editor tidak diterjemahkan otomatis oleh penataan bahasa ini.
