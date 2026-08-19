# Eksplorasi Desain — LensStories

## Tiga Arah Visual

### 1. Editorial Noir / Premium Web3 Gallery
**Very Brief Intro:** Sebuah galeri naratif dengan obsidian black, white space yang terukur, dan warm brass sebagai sinyal visual. Rasanya seperti membaca jurnal fotografi independen yang dipublikasikan oleh brand masa depan.

**Probability:** 0.043

### 2. Tactile Atelier Journal
**Very Brief Intro:** Dunia material yang lebih hangat dengan paper grain, charcoal ink, dan potongan fotografi sebagai contact sheet. Arah ini terasa artisanal dan dekat dengan ruang studio.

**Probability:** 0.071

### 3. Monochrome Broadcast
**Very Brief Intro:** Sistem visual berbasis siaran editorial: layout seperti transmission log, timestamp, dan framing tegas. Lebih tajam, sangat minimal, dan sedikit industrial.

**Probability:** 0.018

---

# Arah Terpilih — Editorial Noir / Premium Web3 Gallery

## Design Movement

**Contemporary editorial minimalism** bertemu dengan **digital gallery design**. Website mengambil kedisiplinan grid majalah seni, ketenangan galeri fotografi, serta detail interface high-end yang terasa modern tanpa jatuh menjadi cyberpunk atau crypto-template.

## Core Principles

1. **Photography leads, interface follows.** Gambar adalah tokoh utama; layout, caption, dan navigasi mendukung ritme cerita.
2. **Contrast with restraint.** Obsidian, off-white, dan warm brass menciptakan kontras elegan tanpa warna neon atau gradien dekoratif berlebihan.
3. **Asymmetry creates editorial tension.** Story index berkomposisi tidak simetris dan memberi ruang bernapas, bukan memakai deretan card yang seragam.
4. **Information behaves as a gallery label.** Kategori, tanggal, nomor cerita, dan caption ditampilkan kecil, presisi, dan tidak mengalahkan narasi.

## Color Philosophy

Latar **obsidian black** memberikan fokus sinematik serta menyatukan foto dengan antarmuka. **Warm white** menjaga copy nyaman dibaca dan memberi rasa material seperti kertas museum. **Muted brass** adalah signature color yang muncul sebagai penanda indeks, garis kecil, fokus keyboard, dan momentum interaksi—bukan sebagai permukaan dominan. Abu-abu batu dipakai untuk metadata agar hierarchy lembut dan tetap premium.

## Layout Paradigm

Struktur situs mengikuti prinsip **film strip editorial**: halaman dimulai dengan frame besar setinggi viewport, lalu bergeser ke urutan blok dengan lebar, ritme, dan rasio yang berubah. Grid cerita bersifat modular namun asimetris: satu visual utama bertemu kolom pendamping dan cue index vertikal. Halaman detail menggunakan chapter sequence—teks tidak terus-menerus berada di tengah, melainkan menyelingi foto edge-to-edge, split frame, pull quote, dan contact sheet.

## Signature Elements

1. **Story index coordinates:** Nomor dua digit, kategori, dan tanggal dalam monospace kecil sebagai identitas tiap cerita.
2. **Brass sightline:** Garis brass tipis dan marker bulat yang muncul pada hero, progress, divider, dan hover state.
3. **Frame captions:** Caption dibuat seperti label karya galeri—bersih, kecil, dan ditempatkan dalam rail atau tepi frame, bukan di atas visual utama.

## Interaction Philosophy

Interaksi harus terasa seperti mengungkap lembar editorial, bukan memakai efek spektakuler. Hover pada story menyalakan metadata, memindahkan underline brass, dan memperbesar foto secara pelan. Header transparan hanya hadir saat hero masih terlihat lalu berubah menjadi panel obsidian yang fokus saat pembaca turun ke konten. Tombol menggunakan affordance berbasis garis, bukan capsule button generik.

## Animation

Elemen masuk memakai reveal singkat berbasis `opacity` dan `transform` dengan easing lembut namun tegas. Pada load, hero copy datang berurutan; saat scroll, gambar bergerak sangat sedikit untuk memberi kedalaman. Hover pada gambar memakai scale maksimal 1.04, duration 700–900ms agar terasa cinematic. UI berfrekuensi tinggi harus cepat (120–200ms), sedangkan reveal editorial boleh 500–700ms. Semua motion non-esensial dimatikan saat `prefers-reduced-motion` aktif.

## Typography System

**Bodoni Moda** digunakan untuk headline display: high-contrast, sculptural, dan tenang. **Manrope** digunakan untuk body, navigasi, dan descriptive copy karena clean di ukuran kecil. **IBM Plex Mono** dipakai khusus untuk metadata, story index, date, dan caption. Headline memakai ukuran besar dengan leading rapat; body dibatasi pada measure editorial yang nyaman; metadata letter-spaced dan uppercase.

## Brand Essence

**LensStories adalah jurnal visual untuk brand yang ingin memperlihatkan dampak dan kultur mereka sebagai cerita manusia, bukan klaim pemasaran.**

Personality: **observant, cinematic, intentional**.

## Brand Voice

Headlines bersifat observasional dan berbobot; CTA bersuara seperti undangan editorial, bukan instruksi sales. Microcopy pendek, presisi, dan tanpa filler generik.

Contoh:

> “The work lives in the details nobody sees.”

> “Open the field notes.”

## Wordmark & Logo

Wordmark menempatkan “Lens” dalam serif display dan “Stories” dalam sans uppercase yang lebih rapat sehingga terasa seperti editorial masthead. Logo mark berupa **aperture monogram abstrak**: empat bidang sudut membentuk lensa yang terbuka, dengan potongan diagonal brass sebagai sightline. Simbol harus kuat tanpa teks dan dapat bekerja sebagai favicon.

## Signature Brand Color

**Signal Brass — `#B78A58`**. Warna ini harus tetap jarang, hadir sebagai sebuah “signal” yang memberi arah visual bagi pembaca.

## Style Decisions

- **Photography rule:** Setiap visual cerita harus terasa observasional, sinematik, dan berskala manusia; hindari dokumentasi kantor yang terang, citra bisnis generik, atau stok meeting yang terlalu literal.
- **Navigation/brand rule:** Wordmark LensStories selalu tampil sebagai masthead editorial: “Lens” dengan display serif, “Stories” dengan uppercase sans yang rapat, dan aperture mark dengan sightline brass sebagai signature yang berulang.
- **Brass rule:** Signal Brass `#B78A58` hanya dipakai sebagai bukti arah: sightline, koordinat, arrow, divider, numeral, dan anchor caption—bukan sebagai bidang dekorasi yang luas.
