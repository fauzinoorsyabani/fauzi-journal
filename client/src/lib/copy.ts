/**
 * Copy produk utama. Naskah jurnal, judul artikel, kutipan, dan slug tetap
 * dikelola editor sehingga tidak diterjemahkan otomatis di modul ini.
 */
export const copy = {
  navigation: {
    stories: "Jurnal",
    impact: "Ritme",
    culture: "Refleksi",
    mediaInquiries: "Pertanyaan media",
    homeAria: "Beranda Fauzi / Journal",
    primaryAria: "Navigasi utama",
    mobileAria: "Navigasi seluler",
    openMenu: "Buka menu navigasi",
    closeMenu: "Tutup menu navigasi",
  },
  footer: {
    description: "Jurnal personal oleh Fauzi—tentang kebiasaan kecil, cara berpikir, dan ruang untuk tumbuh tanpa terburu-buru.",
    subscribeLabel: "Terima catatan jurnal",
    pressLabel: "Untuk media",
    mediaInquiries: "Pertanyaan media",
    elsewhere: "Jelajahi",
    storyIndex: "Indeks jurnal",
    impactNotes: "Ritme realistis",
    behindTheScenes: "Ruang refleksi",
    editorialStudio: "Studio editorial",
    copyright: "© 2026 Fauzi / Journal. Dibuat untuk bertumbuh dengan sadar.",
    volume: "Volume 01 · Tumbuh pelan",
  },
  forms: {
    optional: "opsional",
    name: "Nama",
    yourName: "Nama Anda",
    email: "Email",
    subscribeAria: "Berlangganan catatan jurnal",
    subscribeConsent: "Saya setuju menerima catatan jurnal terbaru. Saya dapat berhenti berlangganan kapan saja.",
    subscribedTitle: "Anda sudah terdaftar.",
    subscribedDescription: "Catatan jurnal berikutnya akan kami kirim langsung kepada Anda.",
    subscribeAnother: "Daftarkan alamat lain",
    saving: "Menyimpan",
    subscribe: "Berlangganan catatan",
  },
} as const;
