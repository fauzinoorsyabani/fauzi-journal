/**
 * Style guide: Fauzi / Journal.
 * The internal studio is a quiet editorial desk: low-contrast panels, brass coordinates, and decisive publishing controls.
 */
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichJournalContent } from "@/components/RichJournalContent";
import { RichJournalEditor } from "@/components/RichJournalEditor";
import { trpc } from "@/lib/trpc";
import { BellRing, ChevronLeft, Eye, FilePlus2, ImageUp, Inbox, Loader2, PenLine, Save, Send, UsersRound } from "lucide-react";
import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from "react";
import { convertToWebP, formatBytes } from "@/lib/imageOptimizer";
import { useLocation } from "wouter";

type ChapterDraft = {
  type: "copy" | "image" | "quote" | "split";
  eyebrow: string;
  heading: string;
  body: string;
  quote: string;
  attribution: string;
  image: string;
  alt: string;
  caption: string;
  side: "left" | "right";
};

type StoryDraft = {
  slug: string;
  storyNumber: number;
  category: string;
  title: string;
  cardTitle: string;
  deck: string;
  author: string;
  readTime: string;
  accent: string;
  impact: string;
  heroImageUrl: string;
  heroImageAlt: string;
  heroImagePosition: string;
  status: "draft" | "published";
  chapters: ChapterDraft[];
  richContentJson: string;
};

const blankChapter = (): ChapterDraft => ({
  type: "copy",
  eyebrow: "",
  heading: "",
  body: "",
  quote: "",
  attribution: "",
  image: "",
  alt: "",
  caption: "",
  side: "right",
});

const blankStory = (): StoryDraft => ({
  slug: "",
  storyNumber: 1,
  category: "Catatan Lapangan",
  title: "",
  cardTitle: "",
  deck: "",
  author: "Fauzi",
  readTime: "05 menit baca",
  accent: "Fauzi / Journal",
  impact: "",
  heroImageUrl: "",
  heroImageAlt: "",
  heroImagePosition: "center",
  status: "draft",
  chapters: [blankChapter()],
  richContentJson: "",
});

const statusLabel = (status: string) =>
  ({ draft: "Draf", published: "Diterbitkan", subscribed: "Berlangganan", unsubscribed: "Berhenti berlangganan", queued: "Menunggu kirim", new: "Baru", reviewed: "Ditinjau", contacted: "Dihubungi" })[status] ?? status;

function parseChapters(raw: string): ChapterDraft[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length
      ? parsed.map((chapter) => ({ ...blankChapter(), ...chapter, body: Array.isArray(chapter.body) ? chapter.body.join("\n\n") : chapter.body ?? "" }))
      : [blankChapter()];
  } catch {
    return [blankChapter()];
  }
}

function recordToDraft(record: any): StoryDraft {
  return {
    slug: record.slug,
    storyNumber: record.storyNumber,
    category: record.category,
    title: record.title,
    cardTitle: record.cardTitle ?? "",
    deck: record.deck,
    author: record.author,
    readTime: record.readTime,
    accent: record.accent ?? "",
    impact: record.impact ?? "",
    heroImageUrl: record.heroImageUrl,
    heroImageAlt: record.heroImageAlt,
    heroImagePosition: record.heroImagePosition ?? "center",
    status: record.status,
    chapters: parseChapters(record.chaptersJson),
    richContentJson: record.richContentJson ?? "",
  };
}

function StoryEditor({ editingRecord, onClose }: { editingRecord: any | null; onClose: () => void }) {
  const { user } = useAuth();
  const [draft, setDraft] = useState<StoryDraft>(() => (editingRecord ? recordToDraft(editingRecord) : { ...blankStory(), author: user?.name || "Penulis" }));
  const [showPreview, setShowPreview] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);
  const [isOptimizingCover, setIsOptimizingCover] = useState(false);
  const utils = trpc.useUtils();
  const [, setLocation] = useLocation();
  const upload = trpc.editorial.uploadImage.useMutation({ onSuccess: (asset) => setDraft((current) => ({ ...current, heroImageUrl: asset.url })) });
  const create = trpc.editorial.createStory.useMutation({ onSuccess: () => { utils.editorial.myStories.invalidate(); utils.editorial.adminList.invalidate(); utils.editorial.publicList.invalidate(); setLocation("/studio"); onClose(); } });
  const update = trpc.editorial.updateStory.useMutation({ onSuccess: () => { utils.editorial.myStories.invalidate(); utils.editorial.adminList.invalidate(); utils.editorial.publicList.invalidate(); setLocation("/studio"); onClose(); } });

  useEffect(() => setDraft(editingRecord ? recordToDraft(editingRecord) : { ...blankStory(), author: user?.name || "Penulis" }), [editingRecord, user]);

  const saveStory = (status: "draft" | "published") => {
    const chapters = draft.chapters.map((chapter) => ({
      type: chapter.type,
      eyebrow: chapter.eyebrow || undefined,
      heading: chapter.heading || undefined,
      body: chapter.body ? chapter.body.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean) : undefined,
      quote: chapter.quote || undefined,
      attribution: chapter.attribution || undefined,
      image: chapter.image || undefined,
      alt: chapter.alt || undefined,
      caption: chapter.caption || undefined,
      side: chapter.side,
    }));
    const input = { ...draft, cardTitle: draft.cardTitle || undefined, accent: draft.accent || undefined, impact: draft.impact || undefined, richContentJson: draft.richContentJson || undefined, status, chapters };
    if (editingRecord) update.mutate({ ...input, id: editingRecord.id });
    else create.mutate(input);
  };

  const uploadCover = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsOptimizingCover(true);
      setCompressionInfo("Mengubah ke format WebP ringan...");
      const optimized = await convertToWebP(file, { maxWidth: 1920, maxHeight: 1200, quality: 0.82 });
      setCompressionInfo(
        `WebP: ${formatBytes(optimized.originalSizeBytes)} → ${formatBytes(optimized.compressedSizeBytes)} (-${optimized.compressionRatio}%)`
      );
      const res = await upload.mutateAsync({
        filename: optimized.filename,
        contentType: "image/webp",
        dataBase64: optimized.dataBase64,
      });
      if (res?.url) {
        setDraft((current) => ({ ...current, heroImageUrl: res.url }));
      }
    } catch (err) {
      console.error("Gagal optimasi gambar cover:", err);
      setCompressionInfo("Gagal mengoptimalkan gambar.");
    } finally {
      setIsOptimizingCover(false);
      event.target.value = "";
    }
  };

  const isSaving = create.isPending || update.isPending;
  const isUploading = isOptimizingCover || upload.isPending;
  const error = create.error ?? update.error ?? upload.error;

  return (
    <section className="mx-auto max-w-5xl pb-16 text-[#f3f0ea]">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-5 border-b border-white/10 pb-6">
        <div>
          <p className="eyebrow mb-3">{editingRecord ? "Sunting cerita" : "Cerita baru"}</p>
          <h1 className="font-display text-5xl tracking-[-0.06em] sm:text-6xl">{editingRecord ? "Rapikan bingkai." : "Mulailah dengan catatan."}</h1>
        </div>
        <button type="button" onClick={() => { setLocation("/studio"); onClose(); }} className="inline-flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[#aaa69f] hover:text-[#f3f0ea]"><ChevronLeft size={15} /> Kembali ke meja kerja</button>
      </div>

      <form onSubmit={(event: FormEvent) => { event.preventDefault(); saveStory("draft"); }} className="grid gap-8">
        <div className="grid gap-5 border border-white/10 bg-[#11100f] p-5 sm:p-7">
          <p className="eyebrow">Koordinat cerita</p>
          <div className="grid gap-4 sm:grid-cols-[0.35fr_0.65fr]">
            <label className="grid gap-2 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#aaa69f]">Nomor cerita<Input type="number" min="1" value={draft.storyNumber} onChange={(event) => setDraft({ ...draft, storyNumber: Number(event.target.value) })} className="border-white/15 bg-[#080808] text-[#f3f0ea]" /></label>
            <label className="grid gap-2 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#aaa69f]">Kategori<Input value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} className="border-white/15 bg-[#080808] text-[#f3f0ea]" placeholder="Catatan Lapangan" /></label>
          </div>
          <label className="grid gap-2 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#aaa69f]">Judul<Input required value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} className="border-white/15 bg-[#080808] font-display text-xl text-[#f3f0ea]" placeholder="Judul tenang yang memberi ruang bernapas" /></label>
          <label className="grid gap-2 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#aaa69f]">Slug<Input required value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-") })} className="border-white/15 bg-[#080808] text-[#f3f0ea]" placeholder="slug-cerita" /></label>
          <label className="grid gap-2 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#aaa69f]">Pembuka singkat<Textarea required value={draft.deck} onChange={(event) => setDraft({ ...draft, deck: event.target.value })} className="min-h-24 border-white/15 bg-[#080808] leading-relaxed text-[#f3f0ea]" placeholder="Pengantar editorial singkat untuk cerita ini." /></label>
        </div>

        <div className="grid gap-5 border border-white/10 bg-[#11100f] p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="eyebrow">Gambar hero</p>
            {compressionInfo ? (
              <span className="font-mono text-[0.56rem] tracking-[0.08em] text-[#b78a58]">
                ✓ {compressionInfo}
              </span>
            ) : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <label className="grid gap-2 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#aaa69f]">URL gambar<Input required value={draft.heroImageUrl} onChange={(event) => setDraft({ ...draft, heroImageUrl: event.target.value })} className="border-white/15 bg-[#080808] text-[#f3f0ea]" placeholder="https://… atau unggah file di samping" /></label>
            <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 border border-[#b78a58]/60 px-4 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#f3f0ea] hover:border-[#f3f0ea]">
              {isUploading ? <Loader2 size={14} className="animate-spin text-[#b78a58]" /> : <ImageUp size={14} className="text-[#b78a58]" />} 
              {isOptimizingCover ? "Mengubah ke WebP..." : "Unggah sampul (WebP)"}
              <input type="file" accept="image/*" onChange={uploadCover} className="sr-only" disabled={isUploading} />
            </label>
          </div>
          <label className="grid gap-2 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#aaa69f]">Teks alternatif<Input required value={draft.heroImageAlt} onChange={(event) => setDraft({ ...draft, heroImageAlt: event.target.value })} className="border-white/15 bg-[#080808] text-[#f3f0ea]" placeholder="Deskripsikan gambar untuk pembaca yang menggunakan teknologi bantu." /></label>
          {draft.heroImageUrl ? (
            <div className="relative mt-2 overflow-hidden border border-white/15 bg-black/40">
              <img src={draft.heroImageUrl} alt="Pratinjau sampul" className="aspect-[16/8] w-full object-cover brightness-[0.85]" />
              <span className="absolute bottom-2 right-2 border border-white/10 bg-black/80 px-2.5 py-1 font-mono text-[0.55rem] uppercase tracking-widest text-[#b78a58]">
                Pratinjau Sampul Aktif
              </span>
            </div>
          ) : (
            <div className="flex aspect-[16/5] w-full flex-col items-center justify-center border border-dashed border-white/15 bg-white/[0.02] p-6 text-center">
              <ImageUp size={24} className="mb-2 text-[#aaa69f]/50" />
              <p className="font-mono text-[0.62rem] text-[#aaa69f]">Pratinjau gambar sampul akan tampil di sini setelah Anda mengunggah gambar atau menempel URL.</p>
            </div>
          )}
        </div>

        <div className="grid gap-5 border border-white/10 bg-[#11100f] p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div><p className="eyebrow">Isi jurnal</p><p className="mt-2 text-sm text-[#aaa69f]">Gunakan toolbar untuk format teks dan unggah gambar (otomatis diubah ke WebP ringan).</p></div>
            <button type="button" onClick={() => setShowPreview((current) => !current)} className="inline-flex items-center gap-2 border border-[#b78a58]/60 px-3 py-2 font-mono text-[0.58rem] uppercase tracking-[0.13em] text-[#f3f0ea] hover:border-[#f3f0ea]"><Eye size={14} className="text-[#b78a58]" /> {showPreview ? "Kembali menulis" : "Pratinjau"}</button>
          </div>
          {showPreview ? (
            <div className="border border-white/10 bg-[#080808] px-5 py-8 sm:px-10">
              <p className="mb-8 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[#b78a58]">Pratinjau baca publik</p>
              {draft.richContentJson ? <RichJournalContent content={draft.richContentJson} /> : <p className="text-sm text-[#aaa69f]">Tulis beberapa baris terlebih dahulu, lalu lihat pratinjau tata baca publik di sini.</p>}
            </div>
          ) : (
            <RichJournalEditor
              value={draft.richContentJson}
              onChange={(richContentJson) => setDraft((current) => ({ ...current, richContentJson }))}
              onUploadImage={async (file) => {
                const optimized = await convertToWebP(file, { maxWidth: 1400, maxHeight: 1400, quality: 0.82 });
                const uploaded = await upload.mutateAsync({
                  filename: optimized.filename,
                  contentType: "image/webp",
                  dataBase64: optimized.dataBase64,
                });
                return uploaded.url;
              }}
            />
          )}
        </div>
        {error ? <p className="font-mono text-[0.6rem] text-[#e08a76]">{error.message}</p> : null}
        <div className="flex flex-wrap gap-3"><Button type="submit" disabled={isSaving || isUploading} className="rounded-none bg-[#f3f0ea] px-5 text-[#080808] hover:bg-[#d8d3ca]"><Save size={15} /> Simpan draf</Button><Button type="button" disabled={isSaving || isUploading} onClick={() => saveStory("published")} className="rounded-none bg-[#b78a58] px-5 text-[#080808] hover:bg-[#d1a06b]"><Send size={15} /> Terbitkan cerita</Button></div>
      </form>
    </section>
  );
}

function StudioDesk() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const list = trpc.editorial.myStories.useQuery();
  const isAdmin = user?.role === "admin";
  const inquiryQuery = trpc.editorial.adminInquiries.useQuery(undefined, { enabled: isAdmin });
  const subscriberQuery = trpc.editorial.adminSubscribers.useQuery(undefined, { enabled: isAdmin });
  const deliveryQuery = trpc.editorial.adminNewsletterDeliveries.useQuery(undefined, { enabled: isAdmin });
  const updateInquiry = trpc.editorial.adminUpdateInquiryStatus.useMutation({ onSuccess: () => inquiryQuery.refetch() });
  const [location] = useLocation();
  const isInquiryView = location === "/studio/inquiries" && isAdmin;
  const isSubscriberView = location === "/studio/subscribers" && isAdmin;
  const isWriting = location === "/studio/new";
  const stats = useMemo(() => ({
    published: (list.data ?? []).filter((story) => story.status === "published").length,
    drafts: (list.data ?? []).filter((story) => story.status === "draft").length,
    total: (list.data ?? []).length,
    subscribers: (subscriberQuery.data ?? []).filter((subscriber) => subscriber.status === "subscribed").length,
    queued: (deliveryQuery.data ?? []).filter((delivery) => delivery.status === "queued").length,
    inquiries: (inquiryQuery.data ?? []).filter((inquiry) => inquiry.status === "new").length,
  }), [deliveryQuery.data, inquiryQuery.data, list.data, subscriberQuery.data]);

  if (isWriting) return <StoryEditor editingRecord={editingRecord} onClose={() => setEditingRecord(null)} />;

  const statCards: [string, number][] = isAdmin
    ? [["Diterbitkan", stats.published], ["Draf", stats.drafts], ["Pelanggan", stats.subscribers], ["Catatan tertunda", stats.queued], ["Pertanyaan baru", stats.inquiries]]
    : [["Diterbitkan", stats.published], ["Draf", stats.drafts], ["Total Jurnal", stats.total]];

  return (
    <section className="mx-auto max-w-6xl pb-16 text-[#f3f0ea]">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-5 border-b border-white/10 pb-6">
        <div>
          <p className="eyebrow mb-3">Ruang kerja editorial</p>
          <h1 className="font-display text-5xl tracking-[-0.06em] sm:text-6xl">
            {isAdmin ? "Arsip yang sedang dikerjakan." : `Jurnal karya ${user?.name || "Anda"}.`}
          </h1>
        </div>
        {!isInquiryView ? (
          <Button onClick={() => { setEditingRecord(null); setLocation("/studio/new"); }} className="rounded-none bg-[#b78a58] text-[#080808] hover:bg-[#d1a06b]">
            <FilePlus2 size={16} /> Tulis jurnal baru
          </Button>
        ) : null}
      </div>

      <div className={`mb-10 grid gap-3 ${isAdmin ? "sm:grid-cols-5" : "sm:grid-cols-3"}`}>
        {statCards.map(([label, value]) => (
          <div key={String(label)} className="border border-white/10 bg-[#11100f] p-5">
            <p className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[#aaa69f]">{label}</p>
            <p className="mt-3 font-display text-4xl text-[#f3f0ea]">{value}</p>
          </div>
        ))}
      </div>

      {isSubscriberView ? (
        <div className="grid gap-5">
          <div className="border border-white/10 bg-[#11100f]">
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div>
                <p className="eyebrow">Daftar pelanggan</p>
                <h2 className="mt-3 font-display text-3xl">Pembaca yang ingin mendengar lebih banyak.</h2>
              </div>
              <UsersRound className="text-[#b78a58]" />
            </div>
            <div className="divide-y divide-white/10">
              {subscriberQuery.isLoading ? (
                <p className="p-6 text-sm text-[#aaa69f]">Memuat pelanggan…</p>
              ) : (subscriberQuery.data ?? []).length === 0 ? (
                <p className="p-6 text-sm text-[#aaa69f]">Belum ada pelanggan. Form opt-in tersedia di footer publik.</p>
              ) : (
                subscriberQuery.data?.map((subscriber) => (
                  <div key={subscriber.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                    <div>
                      <p className="font-display text-2xl">{subscriber.displayName || "Pembaca"}</p>
                      <p className="mt-1 font-mono text-[0.58rem] tracking-[0.08em] text-[#b78a58]">{subscriber.email}</p>
                    </div>
                    <span className={`font-mono text-[0.56rem] uppercase tracking-[0.12em] ${subscriber.status === "subscribed" ? "text-[#b78a58]" : "text-[#88837d]"}`}>{statusLabel(subscriber.status)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="border border-white/10 bg-[#11100f]">
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div>
                <p className="eyebrow">Log notifikasi terbit</p>
                <h2 className="mt-3 font-display text-3xl">Siap untuk dikirim.</h2>
              </div>
              <BellRing className="text-[#b78a58]" />
            </div>
            <p className="border-b border-white/10 p-5 text-sm leading-relaxed text-[#aaa69f]">Setiap penerbitan langsung mencatat pembaca yang telah memberi persetujuan untuk menerima pembaruan. Pengiriman email masih dijeda hingga penyedia eksternal terhubung.</p>
            <div className="divide-y divide-white/10">
              {(deliveryQuery.data ?? []).slice(0, 10).map((delivery) => (
                <div key={delivery.id} className="flex items-center justify-between gap-4 p-5">
                  <p className="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#aaa69f]">Cerita #{delivery.storyId} · pelanggan #{delivery.subscriberId}</p>
                  <span className="font-mono text-[0.56rem] uppercase tracking-[0.12em] text-[#b78a58]">{statusLabel(delivery.status)}</span>
                </div>
              ))}
              {(deliveryQuery.data ?? []).length === 0 ? <p className="p-6 text-sm text-[#aaa69f]">Terbitkan jurnal baru setelah pembaca berlangganan untuk mengisi log ini.</p> : null}
            </div>
          </div>
        </div>
      ) : isInquiryView ? (
        <div className="border border-white/10 bg-[#11100f]">
          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <div>
              <p className="eyebrow">Inbox prospek</p>
              <h2 className="mt-3 font-display text-3xl">Korespondensi dalam pandangan.</h2>
            </div>
            <Inbox className="text-[#b78a58]" />
          </div>
          <div className="divide-y divide-white/10">
            {inquiryQuery.isLoading ? (
              <p className="p-6 text-sm text-[#aaa69f]">Memuat pertanyaan…</p>
            ) : (inquiryQuery.data ?? []).length === 0 ? (
              <p className="p-6 text-sm text-[#aaa69f]">Belum ada pertanyaan. Form footer akan mengirim pesan baru ke sini.</p>
            ) : (
              inquiryQuery.data?.map((inquiry) => (
                <article key={inquiry.id} className="grid gap-4 p-5 lg:grid-cols-[0.7fr_1.4fr_auto]">
                  <div>
                    <p className="font-display text-2xl">{inquiry.fullName}</p>
                    <a href={`mailto:${inquiry.email}`} className="mt-2 block font-mono text-[0.58rem] tracking-[0.08em] text-[#b78a58]">{inquiry.email}</a>
                    <p className="mt-2 font-mono text-[0.56rem] uppercase tracking-[0.12em] text-[#88837d]">{inquiry.outlet || "Independen"} · {inquiry.inquiryType}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-[#d2cec6]">{inquiry.message}</p>
                  <select value={inquiry.status} onChange={(event) => updateInquiry.mutate({ id: inquiry.id, status: event.target.value as "new" | "reviewed" | "contacted" })} className="h-9 border border-white/15 bg-[#080808] px-2 font-mono text-[0.56rem] uppercase tracking-[0.1em] text-[#f3f0ea] outline-none focus:border-[#b78a58]">
                    <option value="new">Baru</option>
                    <option value="reviewed">Ditinjau</option>
                    <option value="contacted">Dihubungi</option>
                  </select>
                </article>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {list.isLoading ? (
            <p className="text-sm text-[#aaa69f]">Memuat meja cerita…</p>
          ) : (list.data ?? []).length === 0 ? (
            <div className="border border-dashed border-white/20 p-8">
              <PenLine className="text-[#b78a58]" />
              <p className="mt-5 font-display text-3xl">Halaman pertama sedang menunggu.</p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-[#aaa69f]">
                Mulai menulis jurnal pertama Anda, buat tata letak editorial, tambahkan gambar, lalu terbitkan untuk dibaca publik.
              </p>
              <Button onClick={() => { setEditingRecord(null); setLocation("/studio/new"); }} className="mt-6 rounded-none bg-[#b78a58] text-[#080808] hover:bg-[#d1a06b]">
                <FilePlus2 size={16} /> Tulis Jurnal Pertama
              </Button>
            </div>
          ) : (
            list.data?.map((story) => (
              <article key={story.id} className="grid gap-5 border border-white/10 bg-[#11100f] p-5 sm:grid-cols-[7rem_1fr_auto] sm:items-center">
                <img src={story.heroImageUrl} alt="" className="aspect-square w-full object-cover brightness-[0.78]" />
                <div>
                  <div className="flex flex-wrap gap-2 font-mono text-[0.56rem] uppercase tracking-[0.13em] text-[#b78a58]">
                    <span>{String(story.storyNumber).padStart(2, "0")}</span>
                    <span>·</span>
                    <span>{statusLabel(story.status)}</span>
                    <span>·</span>
                    <span>{story.category}</span>
                  </div>
                  <h2 className="mt-2 font-display text-3xl leading-none">{story.title}</h2>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#aaa69f]">{story.deck}</p>
                </div>
                <button type="button" onClick={() => { setEditingRecord(story); setLocation("/studio/new"); }} className="inline-flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.13em] text-[#f3f0ea] hover:text-[#b78a58]">
                  <PenLine size={14} /> Sunting
                </button>
              </article>
            ))
          )}
        </div>
      )}
    </section>
  );
}

export default function Studio() {
  const { user } = useAuth();
  return (
    <DashboardLayout>
      {user ? <StudioDesk /> : null}
    </DashboardLayout>
  );
}

