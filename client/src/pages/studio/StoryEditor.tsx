import { type ChangeEvent, type FormEvent, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../../_core/hooks/useAuth";
import { trpc } from "../../lib/trpc";
import { convertToWebP, formatBytes } from "../../lib/imageOptimizer";
import { RichJournalEditor } from "../../components/RichJournalEditor";
import { RichJournalContent } from "../../components/RichJournalContent";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { ChevronLeft, Eye, ImageUp, Loader2, Save, Send, CheckCircle2, RotateCcw } from "lucide-react";
import { useStoryDraft } from "./useStoryDraft";

export function StoryEditor({
  editingRecord,
  onClose,
}: {
  editingRecord: any | null;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();

  const {
    draft,
    setDraft,
    resetDraft,
    clearStorageDraft,
    hasRestoredDraft,
    setHasRestoredDraft,
    lastSavedAt,
  } = useStoryDraft({
    editingRecord,
    authorFallback: user?.name || "Penulis",
  });

  const [showPreview, setShowPreview] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);
  const [isOptimizingCover, setIsOptimizingCover] = useState(false);

  const upload = trpc.editorial.uploadImage.useMutation();

  const handleMutationSuccess = () => {
    clearStorageDraft();
    utils.editorial.myStories.invalidate();
    utils.editorial.adminList.invalidate();
    utils.editorial.publicList.invalidate();
    setLocation("/studio");
    onClose();
  };

  const create = trpc.editorial.createStory.useMutation({ onSuccess: handleMutationSuccess });
  const update = trpc.editorial.updateStory.useMutation({ onSuccess: handleMutationSuccess });

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

    const input = {
      ...draft,
      cardTitle: draft.cardTitle || undefined,
      accent: draft.accent || undefined,
      impact: draft.impact || undefined,
      richContentJson: draft.richContentJson || undefined,
      status,
      chapters,
    };

    if (editingRecord) {
      update.mutate({ ...input, id: editingRecord.id });
    } else {
      create.mutate(input);
    }
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
      {/* Header bar */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <p className="eyebrow">{editingRecord ? "Sunting cerita" : "Cerita baru"}</p>
            {lastSavedAt && !editingRecord ? (
              <span className="flex items-center gap-1 font-mono text-[0.55rem] text-[#b78a58] tracking-widest uppercase bg-[#b78a58]/10 px-2 py-0.5 border border-[#b78a58]/20">
                <CheckCircle2 size={10} /> Auto-save ({lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })})
              </span>
            ) : null}
          </div>
          <h1 className="font-display text-5xl tracking-[-0.06em] sm:text-6xl">
            {editingRecord ? "Rapikan bingkai." : "Mulailah dengan catatan."}
          </h1>
        </div>
        <button
          type="button"
          onClick={() => {
            setLocation("/studio");
            onClose();
          }}
          className="inline-flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[#aaa69f] hover:text-[#f3f0ea]"
        >
          <ChevronLeft size={15} /> Kembali ke meja kerja
        </button>
      </div>

      {/* Draft Restored Banner */}
      {hasRestoredDraft && !editingRecord ? (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border border-[#b78a58]/30 bg-[#b78a58]/10 p-3.5 text-xs text-[#f3f0ea]">
          <p className="font-mono text-[0.65rem]">
            ✦ Naskah sebelumnya yang belum selesai telah dipulihkan otomatis dari peramban Anda.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => resetDraft()}
              className="inline-flex items-center gap-1.5 font-mono text-[0.58rem] uppercase tracking-wider text-rose-300 hover:text-white"
            >
              <RotateCcw size={12} /> Hapus & mulai baru
            </button>
            <span className="text-white/20">|</span>
            <button
              type="button"
              onClick={() => setHasRestoredDraft(false)}
              className="font-mono text-[0.58rem] uppercase tracking-wider text-[#aaa69f] hover:text-white"
            >
              Lanjutkan
            </button>
          </div>
        </div>
      ) : null}

      <form
        onSubmit={(event: FormEvent) => {
          event.preventDefault();
          saveStory("draft");
        }}
        className="grid gap-8"
      >
        {/* Section 1: Coordinates */}
        <div className="grid gap-5 border border-white/10 bg-[#11100f] p-5 sm:p-7">
          <p className="eyebrow">Koordinat cerita</p>
          <div className="grid gap-4 sm:grid-cols-[0.35fr_0.65fr]">
            <label className="grid gap-2 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#aaa69f]">
              Nomor cerita
              <Input
                type="number"
                min="1"
                value={draft.storyNumber}
                onChange={(event) => setDraft({ ...draft, storyNumber: Number(event.target.value) })}
                className="border-white/15 bg-[#080808] text-[#f3f0ea]"
              />
            </label>
            <label className="grid gap-2 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#aaa69f]">
              Kategori
              <Input
                value={draft.category}
                onChange={(event) => setDraft({ ...draft, category: event.target.value })}
                className="border-white/15 bg-[#080808] text-[#f3f0ea]"
                placeholder="Catatan Lapangan"
              />
            </label>
          </div>
          <label className="grid gap-2 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#aaa69f]">
            Judul
            <Input
              required
              value={draft.title}
              onChange={(event) => setDraft({ ...draft, title: event.target.value })}
              className="border-white/15 bg-[#080808] font-display text-xl text-[#f3f0ea]"
              placeholder="Judul tenang yang memberi ruang bernapas"
            />
          </label>
          <label className="grid gap-2 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#aaa69f]">
            Slug
            <Input
              required
              value={draft.slug}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  slug: event.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
                })
              }
              className="border-white/15 bg-[#080808] text-[#f3f0ea]"
              placeholder="slug-cerita"
            />
          </label>
          <label className="grid gap-2 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#aaa69f]">
            Pembuka singkat
            <Textarea
              required
              value={draft.deck}
              onChange={(event) => setDraft({ ...draft, deck: event.target.value })}
              className="min-h-24 border-white/15 bg-[#080808] leading-relaxed text-[#f3f0ea]"
              placeholder="Pengantar editorial singkat untuk cerita ini."
            />
          </label>
        </div>

        {/* Section 2: Hero Image */}
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
            <label className="grid gap-2 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#aaa69f]">
              URL gambar
              <Input
                required
                value={draft.heroImageUrl}
                onChange={(event) => setDraft({ ...draft, heroImageUrl: event.target.value })}
                className="border-white/15 bg-[#080808] text-[#f3f0ea]"
                placeholder="https://… atau unggah file di samping"
              />
            </label>
            <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 border border-[#b78a58]/60 px-4 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#f3f0ea] hover:border-[#f3f0ea]">
              {isUploading ? (
                <Loader2 size={14} className="animate-spin text-[#b78a58]" />
              ) : (
                <ImageUp size={14} className="text-[#b78a58]" />
              )}
              {isOptimizingCover ? "Mengubah ke WebP..." : "Unggah sampul (WebP)"}
              <input
                type="file"
                accept="image/*"
                onChange={uploadCover}
                className="sr-only"
                disabled={isUploading}
              />
            </label>
          </div>
          <label className="grid gap-2 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#aaa69f]">
            Teks alternatif
            <Input
              required
              value={draft.heroImageAlt}
              onChange={(event) => setDraft({ ...draft, heroImageAlt: event.target.value })}
              className="border-white/15 bg-[#080808] text-[#f3f0ea]"
              placeholder="Deskripsikan gambar untuk pembaca yang menggunakan teknologi bantu."
            />
          </label>
          {draft.heroImageUrl ? (
            <div className="relative mt-2 overflow-hidden border border-white/15 bg-black/40">
              <img
                src={draft.heroImageUrl}
                alt="Pratinjau sampul"
                className="aspect-[16/8] w-full object-cover brightness-[0.85]"
              />
              <span className="absolute bottom-2 right-2 border border-white/10 bg-black/80 px-2.5 py-1 font-mono text-[0.55rem] uppercase tracking-widest text-[#b78a58]">
                Pratinjau Sampul Aktif
              </span>
            </div>
          ) : (
            <div className="flex aspect-[16/5] w-full flex-col items-center justify-center border border-dashed border-white/15 bg-white/[0.02] p-6 text-center">
              <ImageUp size={24} className="mb-2 text-[#aaa69f]/50" />
              <p className="font-mono text-[0.62rem] text-[#aaa69f]">
                Pratinjau gambar sampul akan tampil di sini setelah Anda mengunggah gambar atau menempel URL.
              </p>
            </div>
          )}
        </div>

        {/* Section 3: Rich Journal Content */}
        <div className="grid gap-5 border border-white/10 bg-[#11100f] p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Isi jurnal</p>
              <p className="mt-2 text-sm text-[#aaa69f]">
                Gunakan toolbar untuk format teks dan unggah gambar (otomatis diubah ke WebP ringan).
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowPreview((current) => !current)}
              className="inline-flex items-center gap-2 border border-[#b78a58]/60 px-3 py-2 font-mono text-[0.58rem] uppercase tracking-[0.13em] text-[#f3f0ea] hover:border-[#f3f0ea]"
            >
              <Eye size={14} className="text-[#b78a58]" /> {showPreview ? "Kembali menulis" : "Pratinjau"}
            </button>
          </div>
          {showPreview ? (
            <div className="border border-white/10 bg-[#080808] px-5 py-8 sm:px-10">
              <p className="mb-8 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[#b78a58]">
                Pratinjau baca publik
              </p>
              {draft.richContentJson ? (
                <RichJournalContent content={draft.richContentJson} />
              ) : (
                <p className="text-sm text-[#aaa69f]">
                  Tulis beberapa baris terlebih dahulu, lalu lihat pratinjau tata baca publik di sini.
                </p>
              )}
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

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            type="submit"
            disabled={isSaving || isUploading}
            className="rounded-none bg-[#f3f0ea] px-5 text-[#080808] hover:bg-[#d8d3ca]"
          >
            <Save size={15} /> Simpan draf
          </Button>
          <Button
            type="button"
            disabled={isSaving || isUploading}
            onClick={() => saveStory("published")}
            className="rounded-none bg-[#b78a58] px-5 text-[#080808] hover:bg-[#d1a06b]"
          >
            <Send size={15} /> Terbitkan cerita
          </Button>
        </div>
      </form>
    </section>
  );
}
