/**
 * Copy produk utama. Naskah jurnal, judul artikel, kutipan, dan slug tetap
 * dikelola editor sehingga tidak diterjemahkan otomatis di modul ini.
 */
export const copy = {
  navigation: {
    stories: "Cerita",
    impact: "Dampak",
    culture: "Budaya",
    mediaInquiries: "Pertanyaan media",
    homeAria: "Beranda Fauzi / Journal",
    primaryAria: "Navigasi utama",
    mobileAria: "Navigasi seluler",
    openMenu: "Buka menu navigasi",
    closeMenu: "Tutup menu navigasi",
  },
  footer: {
    description: "Jurnal visual oleh Fauzi—menghimpun catatan lapangan, cerita berbasis gambar, dan kerja yang berlangsung di balik permukaan.",
    subscribeLabel: "Terima catatan jurnal",
    pressLabel: "Untuk media",
    mediaInquiries: "Pertanyaan media",
    elsewhere: "Jelajahi",
    storyIndex: "Indeks cerita",
    impactNotes: "Catatan dampak",
    behindTheScenes: "Di balik layar",
    editorialStudio: "Studio editorial",
    copyright: "© 2026 Fauzi / Journal. Dibuat untuk kerja di balik permukaan.",
    volume: "Volume 04 · Arsip keseharian",
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
