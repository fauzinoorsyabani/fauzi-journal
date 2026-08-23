import { editorialMedia } from "@/lib/media";

/**
 * Story fallback untuk jurnal publik. Naskah mengolah gagasan buku secara
 * parafrase, bukan menyalin kutipan dari karya berhak cipta.
 */
export type StoryChapter = {
  type: "copy" | "image" | "quote" | "split";
  eyebrow?: string;
  heading?: string;
  highlight?: string;
  body?: string[];
  quote?: string;
  attribution?: string;
  image?: string;
  alt?: string;
  caption?: string;
  side?: "left" | "right";
  imageSize?: "small" | "medium" | "wide";
};

export type Story = {
  slug: string;
  index: string;
  category: string;
  title: string;
  cardTitle?: string;
  deck: string;
  date: string;
  readTime: string;
  author: string;
  image: string;
  alt: string;
  imagePosition?: string;
  accent: string;
  impact: string;
  chapters: StoryChapter[];
  references?: { title: string; author: string; url: string }[];
  richContentJson?: string | null;
};

const personalMediaBase = "https://gwst4iapywswxoyh.public.blob.vercel-storage.com";

const personalMedia = {
  portraitStudio: `${personalMediaBase}/portrait-studio.png`,
  portraitPerjalanan: `${personalMediaBase}/portrait-perjalanan.png`,
  konferensi: `${personalMediaBase}/proses-belajar-konferensi.webp`,
  kafe: `${personalMediaBase}/jeda-refleksi-kafe.webp`,
  latihan: `${personalMediaBase}/kebiasaan-latihan.webp`,
};

export const stories: Story[] = [
  {
    slug: "mulai-dari-yang-kecil",
    index: "01",
    category: "Kebiasaan",
    title: "Mulai dari yang kecil, lalu pulang sebagai orang yang berbeda.",
    cardTitle: "Mulai dari yang kecil",
    deck: "Catatan tentang kebiasaan sederhana, belajar tanpa banyak drama, dan alasan mengapa langkah kecil tetap layak dirayakan.",
    date: "23 Agu 2026",
    readTime: "07 menit baca",
    author: "Fauzi",
    image: editorialMedia.hero,
    alt: "Lanskap pegunungan pada pagi hari yang tenang.",
    imagePosition: "center",
    accent: "Seri tumbuh pelan / 01",
    impact: "Perubahan yang terasa besar sering dimulai dari hal yang hampir tidak terlihat hari ini.",
    references: [{ title: "Atomic Habits", author: "James Clear", url: "https://jamesclear.com/atomic-habits" }],
    chapters: [
      {
        type: "copy",
        eyebrow: "Tidak harus langsung hebat",
        heading: "Kita sering gagal bukan karena malas, tetapi karena ingin berubah terlalu jauh dalam satu hari.",
        highlight: "Kebiasaan kecil bukan remeh. Ia adalah cara kita memberi bukti bahwa diri ini bisa dipercaya.",
        body: [
          "Ada masa ketika saya mengira perubahan harus dimulai dengan jadwal yang rapi, target yang tinggi, dan energi yang selalu penuh. Kenyataannya, hari biasa tidak bekerja seperti itu. Ada lelah, ada pekerjaan yang menumpuk, dan ada rasa ingin menunda semuanya sampai Senin depan.",
          "Sekarang saya lebih suka memulai dengan versi yang ringan: membaca beberapa halaman, berjalan sebentar, menulis satu kalimat, atau membuka materi belajar selama lima belas menit. Ukurannya kecil, tetapi cukup untuk membuat hari itu punya arah.",
          "Dalam Atomic Habits, James Clear membahas perubahan kecil dan sistem yang memudahkan kebiasaan baik untuk terus diulang. Yang saya ambil bukan janji hasil instan, melainkan pengingat sederhana: jangan hanya sibuk mengejar target; buat jalan pulang ke target itu lebih mudah dilalui.",
        ],
      },
      {
        type: "image",
        image: personalMedia.portraitStudio,
        alt: "Potret Fauzi dengan jas hitam di studio berlatar terang.",
        caption: "Mengingat kembali arah pribadi: bukan untuk terlihat selalu siap, tetapi untuk tetap datang dan mencoba.",
        imageSize: "small",
      },
      {
        type: "split",
        eyebrow: "Belajar sebagai kebiasaan",
        heading: "Datang ke ruang belajar membuat saya ingat bahwa keahlian dibangun dari kehadiran.",
        highlight: "Kemajuan tidak selalu terdengar keras. Kadang ia hanya tampak sebagai keputusan untuk kembali belajar.",
        body: [
          "Mengikuti konferensi, mendengar pengalaman orang lain, atau duduk di materi yang belum sepenuhnya kita pahami bisa terasa canggung. Namun, dari situlah rasa ingin tahu mendapat tempat untuk tumbuh.",
          "Tidak semua pertemuan harus langsung menghasilkan jawaban. Ada yang cukup meninggalkan satu pertanyaan baik untuk dibawa pulang dan dicoba pelan-pelan.",
        ],
        image: personalMedia.konferensi,
        alt: "Fauzi berdiri di area Dicoding Developer Conference.",
        caption: "Belajar tidak selalu berarti tahu lebih banyak hari ini. Kadang cukup berani masuk ke ruang yang menantang kita.",
        side: "right",
      },
      {
        type: "image",
        image: personalMedia.latihan,
        alt: "Fauzi berfoto di depan cermin area latihan dengan peralatan kebugaran di belakangnya.",
        caption: "Rutinitas fisik tidak perlu sempurna untuk tetap berarti. Yang penting, ada ruang untuk kembali bergerak.",
        imageSize: "medium",
      },
      {
        type: "quote",
        quote: "Hari yang baik bukan hari ketika semua selesai. Hari yang baik adalah hari ketika kita tidak meninggalkan diri sendiri.",
        attribution: "— Catatan pribadi Fauzi",
      },
      {
        type: "copy",
        eyebrow: "Buku yang menemani tulisan ini",
        heading: "Bukan resep hidup, melainkan teman untuk menyusun langkah.",
        body: [
          "Atomic Habits karya James Clear menjadi rujukan untuk bagian tentang perubahan kecil dan sistem kebiasaan. Buku ini tidak saya jadikan aturan kaku. Ia lebih berguna sebagai pertanyaan: kebiasaan apa yang bisa dibuat sedikit lebih mudah hari ini?",
          "Jika ada satu hal yang ingin saya simpan, jawabannya sederhana: mulai secukupnya, ulangi dengan ramah, lalu beri waktu pada diri sendiri untuk bertumbuh.",
        ],
      },
    ],
  },
  {
    slug: "belajar-tanpa-menunggu-hebat",
    index: "02",
    category: "Cara Berpikir",
    title: "Belajar tanpa menunggu hebat.",
    cardTitle: "Belajar tanpa menunggu hebat",
    deck: "Saat rasa takut salah terlalu besar, proses belajar justru butuh bahasa yang lebih ramah dan langkah yang lebih jujur.",
    date: "21 Agu 2026",
    readTime: "06 menit baca",
    author: "Fauzi",
    image: editorialMedia.people,
    alt: "Sekelompok orang duduk bersama dalam suasana kolaboratif.",
    imagePosition: "center",
    accent: "Seri tumbuh pelan / 02",
    impact: "Kemampuan bukan pintu yang sudah tertutup; ia adalah ruang yang bisa kita masuki berkali-kali.",
    references: [{ title: "Mindset: The New Psychology of Success", author: "Carol S. Dweck", url: "https://ccsre.stanford.edu/publications/mindset-updated-edition-changing-way-you-think-fulfill-your-potential" }],
    chapters: [
      {
        type: "copy",
        eyebrow: "Boleh belum bisa",
        heading: "Kita tidak harus merasa siap untuk mulai belajar.",
        highlight: "Kalimat “belum bisa” membuka ruang yang tidak dimiliki oleh kalimat “aku memang tidak bisa”.",
        body: [
          "Pernah ada masa ketika saya menilai kemampuan dari seberapa cepat seseorang terlihat paham. Kalau saya lambat, saya merasa tertinggal. Kalau hasil pertama tidak bagus, saya ingin menyimpulkan bahwa bidang itu bukan untuk saya.",
          "Cara pandang seperti itu melelahkan karena setiap kesalahan terasa seperti bukti tentang siapa kita. Padahal, kesalahan lebih sering adalah informasi: bagian mana yang perlu dilihat lagi, ditanya lagi, atau dilatih lagi.",
          "Carol S. Dweck dalam Mindset membedakan cara pandang fixed mindset dan growth mindset. Bagi saya, bagian paling membantu dari gagasan itu adalah pilihan bahasa. Mengganti “aku gagal” menjadi “aku masih belajar” tidak menghapus masalah, tetapi membuat kita tidak berhenti di tengah jalan.",
        ],
      },
      {
        type: "image",
        image: personalMedia.kafe,
        alt: "Fauzi memegang minuman di kafe dengan latar interior berwarna abu-abu.",
        caption: "Jeda kecil bukan pelarian. Kadang ia adalah tempat kita menyusun ulang pikiran sebelum melanjutkan.",
        imageSize: "medium",
      },
      {
        type: "split",
        eyebrow: "Tumbuh dengan jujur",
        heading: "Tidak semua perkembangan terlihat dari luar, tetapi tetap terasa di cara kita merespons diri sendiri.",
        highlight: "Bertumbuh bukan soal selalu percaya diri. Bertumbuh adalah tetap penasaran ketika percaya diri belum datang.",
        body: [
          "Saya mencoba berhenti menjadikan hasil orang lain sebagai ukuran tunggal untuk perjalanan saya. Perbandingan mungkin memberi arah sesaat, tetapi latihan yang konsisten lebih sering datang dari memahami ritme diri sendiri.",
          "Saat sebuah pekerjaan belum berhasil, saya ingin bertanya: apa satu hal yang bisa dicoba dengan cara berbeda? Pertanyaan itu terasa lebih berguna daripada menyalahkan diri sepanjang hari.",
        ],
        image: personalMedia.portraitPerjalanan,
        alt: "Potret Fauzi di tepi laut dengan cahaya sore dan pulau-pulau kecil di latar belakang.",
        caption: "Melihat sedikit lebih jauh mengingatkan saya: arah tetap ada, meski langkah hari ini belum panjang.",
        side: "left",
      },
      {
        type: "quote",
        quote: "Kita boleh menjadi pemula lebih dari sekali. Tidak ada yang memalukan dari kembali belajar.",
        attribution: "— Catatan pribadi Fauzi",
      },
      {
        type: "copy",
        eyebrow: "Buku yang menemani tulisan ini",
        heading: "Membiarkan kemampuan menjadi proses, bukan vonis.",
        body: [
          "Mindset: The New Psychology of Success karya Carol S. Dweck menjadi rujukan untuk refleksi ini. Buku tersebut membahas bagaimana keyakinan tentang kemampuan dapat memengaruhi cara seseorang menghadapi tantangan dan proses belajar.",
          "Saya memilih membawa gagasan itu dalam bentuk yang paling sederhana: jangan buru-buru menutup pintu hanya karena kita belum mahir mengetuknya.",
        ],
      },
    ],
  },
  {
    slug: "cukup-penting-untuk-hari-ini",
    index: "03",
    category: "Waktu & Perhatian",
    title: "Cukup penting untuk hari ini.",
    cardTitle: "Cukup penting untuk hari ini",
    deck: "Tentang berhenti mengejar semua hal sekaligus dan memilih apa yang benar-benar layak mendapat perhatian kita sekarang.",
    date: "18 Agu 2026",
    readTime: "05 menit baca",
    author: "Fauzi",
    image: editorialMedia.bts,
    alt: "Meja kerja dengan pencahayaan hangat dan suasana tenang.",
    imagePosition: "center",
    accent: "Seri tumbuh pelan / 03",
    impact: "Kita tidak perlu melakukan semuanya untuk menjalani hari yang berarti.",
    references: [{ title: "Four Thousand Weeks", author: "Oliver Burkeman", url: "https://www.oliverburkeman.com/fourthousandweeks" }],
    chapters: [
      {
        type: "copy",
        eyebrow: "Bukan tentang menjadi mesin",
        heading: "Ada hal-hal yang harus sengaja tidak kita lakukan agar hidup terasa lebih lapang.",
        highlight: "Memilih satu hal penting bukan berarti menyerah pada yang lain. Itu berarti memberi perhatian tempat untuk tinggal.",
        body: [
          "Daftar tugas bisa bertambah lebih cepat daripada waktu yang kita punya. Saya pernah mencoba menaklukkannya dengan menambah aplikasi, menambah alarm, dan menambah tekanan. Hasilnya bukan lebih tenang, tetapi lebih mudah merasa tertinggal.",
          "Sekarang saya mencoba memulai hari dengan satu pertanyaan kecil: kalau hanya satu hal yang selesai hari ini, apa yang paling membuat saya lega? Bukan yang paling mengesankan, tetapi yang paling jujur diperlukan.",
          "Four Thousand Weeks karya Oliver Burkeman mengingatkan bahwa waktu kita memang terbatas. Bukan untuk membuat kita panik, tetapi supaya kita berhenti menunggu keadaan sempurna sebelum memberi ruang pada hal yang bermakna.",
        ],
      },
      {
        type: "quote",
        quote: "Ruang kosong di kalender bukan tanda kurang ambisi. Ia bisa menjadi tempat napas, perhatian, dan keputusan yang lebih baik.",
        attribution: "— Catatan pribadi Fauzi",
      },
      {
        type: "copy",
        eyebrow: "Buku yang menemani tulisan ini",
        heading: "Produktif tidak selalu berarti dekat dengan yang penting.",
        body: [
          "Four Thousand Weeks: Time Management for Mortals karya Oliver Burkeman menjadi rujukan untuk tulisan ini. Gagasannya tentang menerima keterbatasan waktu membantu saya melihat bahwa manajemen waktu bukan hanya soal menambah efisiensi, tetapi juga soal memilih apa yang rela tidak kita kejar.",
          "Mungkin hari ini tidak butuh daftar baru. Mungkin kita hanya butuh keberanian untuk menyelesaikan satu hal dengan perhatian utuh.",
        ],
      },
    ],
  },
];

export function getStory(slug: string) {
  return stories.find((story) => story.slug === slug);
}
