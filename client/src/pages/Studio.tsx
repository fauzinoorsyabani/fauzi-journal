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
import { BellRing, Check, ChevronLeft, Eye, FilePlus2, ImageUp, Inbox, Loader2, PenLine, Save, Send, UsersRound } from "lucide-react";
import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";

type ChapterDraft = { type: "copy" | "image" | "quote" | "split"; eyebrow: string; heading: string; body: string; quote: string; attribution: string; image: string; alt: string; caption: string; side: "left" | "right" };
type StoryDraft = { slug: string; storyNumber: number; category: string; title: string; cardTitle: string; deck: string; author: string; readTime: string; accent: string; impact: string; heroImageUrl: string; heroImageAlt: string; heroImagePosition: string; status: "draft" | "published"; chapters: ChapterDraft[]; richContentJson: string };

const blankChapter = (): ChapterDraft => ({ type: "copy", eyebrow: "", heading: "", body: "", quote: "", attribution: "", image: "", alt: "", caption: "", side: "right" });
const blankStory = (): StoryDraft => ({ slug: "", storyNumber: 1, category: "Field Notes", title: "", cardTitle: "", deck: "", author: "Fauzi", readTime: "05 min read", accent: "Fauzi / Journal", impact: "", heroImageUrl: "", heroImageAlt: "", heroImagePosition: "center", status: "draft", chapters: [blankChapter()], richContentJson: "" });

function parseChapters(raw: string): ChapterDraft[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed.map((chapter) => ({ ...blankChapter(), ...chapter, body: Array.isArray(chapter.body) ? chapter.body.join("\n\n") : chapter.body ?? "" })) : [blankChapter()];
  } catch { return [blankChapter()]; }
}

function recordToDraft(record: any): StoryDraft {
  return { slug: record.slug, storyNumber: record.storyNumber, category: record.category, title: record.title, cardTitle: record.cardTitle ?? "", deck: record.deck, author: record.author, readTime: record.readTime, accent: record.accent ?? "", impact: record.impact ?? "", heroImageUrl: record.heroImageUrl, heroImageAlt: record.heroImageAlt, heroImagePosition: record.heroImagePosition ?? "center", status: record.status, chapters: parseChapters(record.chaptersJson), richContentJson: record.richContentJson ?? "" };
}

function StoryEditor({ editingRecord, onClose }: { editingRecord: any | null; onClose: () => void }) {
  const [draft, setDraft] = useState<StoryDraft>(() => editingRecord ? recordToDraft(editingRecord) : blankStory());
  const [showPreview, setShowPreview] = useState(false);
  const utils = trpc.useUtils();
  const [, setLocation] = useLocation();
  const upload = trpc.editorial.adminUploadImage.useMutation({ onSuccess: (asset) => setDraft((current) => ({ ...current, heroImageUrl: asset.url })) });
  const create = trpc.editorial.adminCreate.useMutation({ onSuccess: () => { utils.editorial.adminList.invalidate(); utils.editorial.publicList.invalidate(); setLocation("/studio"); onClose(); } });
  const update = trpc.editorial.adminUpdate.useMutation({ onSuccess: () => { utils.editorial.adminList.invalidate(); utils.editorial.publicList.invalidate(); setLocation("/studio"); onClose(); } });

  useEffect(() => setDraft(editingRecord ? recordToDraft(editingRecord) : blankStory()), [editingRecord]);

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
    if (editingRecord) update.mutate({ ...input, id: editingRecord.id }); else create.mutate(input);
  };

  const changeChapter = (index: number, field: keyof ChapterDraft, value: string) => setDraft((current) => ({ ...current, chapters: current.chapters.map((chapter, chapterIndex) => chapterIndex === index ? { ...chapter, [field]: value } : chapter) }));
  const uploadCover = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) return;
    const reader = new FileReader();
    reader.onload = () => upload.mutate({ filename: file.name, contentType: file.type as "image/jpeg" | "image/png" | "image/webp", dataBase64: String(reader.result).split(",")[1] ?? "" });
    reader.readAsDataURL(file);
  };

  const isSaving = create.isPending || update.isPending;
  const error = create.error ?? update.error ?? upload.error;

  return (
    <section className="mx-auto max-w-5xl pb-16 text-[#f3f0ea]">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-5 border-b border-white/10 pb-6">
        <div><p className="eyebrow mb-3">{editingRecord ? "Edit story" : "New story"}</p><h1 className="font-display text-5xl tracking-[-0.06em] sm:text-6xl">{editingRecord ? "Refine the frame." : "Start with a note."}</h1></div>
        <button type="button" onClick={() => { setLocation("/studio"); onClose(); }} className="inline-flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[#aaa69f] hover:text-[#f3f0ea]"><ChevronLeft size={15} /> Back to desk</button>
      </div>

      <form onSubmit={(event: FormEvent) => { event.preventDefault(); saveStory("draft"); }} className="grid gap-8">
        <div className="grid gap-5 border border-white/10 bg-[#11100f] p-5 sm:p-7">
          <p className="eyebrow">Story coordinates</p>
          <div className="grid gap-4 sm:grid-cols-[0.35fr_0.65fr]">
            <label className="grid gap-2 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#aaa69f]">Story no.<Input type="number" min="1" value={draft.storyNumber} onChange={(event) => setDraft({ ...draft, storyNumber: Number(event.target.value) })} className="border-white/15 bg-[#080808] text-[#f3f0ea]" /></label>
            <label className="grid gap-2 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#aaa69f]">Category<Input value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} className="border-white/15 bg-[#080808] text-[#f3f0ea]" placeholder="Field Notes" /></label>
          </div>
          <label className="grid gap-2 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#aaa69f]">Title<Input required value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} className="border-white/15 bg-[#080808] font-display text-xl text-[#f3f0ea]" placeholder="A quiet title with room to breathe" /></label>
          <label className="grid gap-2 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#aaa69f]">Slug<Input required value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-") })} className="border-white/15 bg-[#080808] text-[#f3f0ea]" placeholder="the-story-slug" /></label>
          <label className="grid gap-2 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#aaa69f]">Deck<Textarea required value={draft.deck} onChange={(event) => setDraft({ ...draft, deck: event.target.value })} className="min-h-24 border-white/15 bg-[#080808] leading-relaxed text-[#f3f0ea]" placeholder="A short, editorial introduction to the story." /></label>
        </div>

        <div className="grid gap-5 border border-white/10 bg-[#11100f] p-5 sm:p-7">
          <p className="eyebrow">Hero image</p>
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <label className="grid gap-2 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#aaa69f]">Image URL<Input required value={draft.heroImageUrl} onChange={(event) => setDraft({ ...draft, heroImageUrl: event.target.value })} className="border-white/15 bg-[#080808] text-[#f3f0ea]" placeholder="https://… or /manus-storage/…" /></label>
            <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 border border-[#b78a58]/60 px-4 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#f3f0ea] hover:border-[#f3f0ea]">{upload.isPending ? <Loader2 size={14} className="animate-spin" /> : <ImageUp size={14} className="text-[#b78a58]" />} Upload cover<input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadCover} className="sr-only" /></label>
          </div>
          <label className="grid gap-2 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#aaa69f]">Alt text<Input required value={draft.heroImageAlt} onChange={(event) => setDraft({ ...draft, heroImageAlt: event.target.value })} className="border-white/15 bg-[#080808] text-[#f3f0ea]" placeholder="Describe the image for readers using assistive technology." /></label>
          {draft.heroImageUrl ? <img src={draft.heroImageUrl} alt="Cover preview" className="aspect-[16/8] w-full object-cover brightness-[0.8]" /> : null}
        </div>

        <div className="grid gap-5 border border-white/10 bg-[#11100f] p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="eyebrow">Journal body</p><p className="mt-2 text-sm text-[#aaa69f]">Use the toolbar for italic, headings, quotes, lists, links, and images.</p></div><button type="button" onClick={() => setShowPreview((current) => !current)} className="inline-flex items-center gap-2 border border-[#b78a58]/60 px-3 py-2 font-mono text-[0.58rem] uppercase tracking-[0.13em] text-[#f3f0ea] hover:border-[#f3f0ea]"><Eye size={14} className="text-[#b78a58]" /> {showPreview ? "Back to write" : "Preview"}</button></div>
          {showPreview ? <div className="border border-white/10 bg-[#080808] px-5 py-8 sm:px-10"><p className="mb-8 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[#b78a58]">Public reading preview</p>{draft.richContentJson ? <RichJournalContent content={draft.richContentJson} /> : <p className="text-sm text-[#aaa69f]">Write a few lines first, then preview the public reading layout here.</p>}</div> : <RichJournalEditor value={draft.richContentJson} onChange={(richContentJson) => setDraft((current) => ({ ...current, richContentJson }))} />}
        </div>
        {error ? <p className="font-mono text-[0.6rem] text-[#e08a76]">{error.message}</p> : null}
        <div className="flex flex-wrap gap-3"><Button type="submit" disabled={isSaving} className="rounded-none bg-[#f3f0ea] px-5 text-[#080808] hover:bg-[#d8d3ca]"><Save size={15} /> Save draft</Button><Button type="button" disabled={isSaving} onClick={() => saveStory("published")} className="rounded-none bg-[#b78a58] px-5 text-[#080808] hover:bg-[#d1a06b]"><Send size={15} /> Publish story</Button></div>
      </form>
    </section>
  );
}

function StudioDesk() {
  const [, setLocation] = useLocation();
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const list = trpc.editorial.adminList.useQuery();
  const inquiryQuery = trpc.editorial.adminInquiries.useQuery();
  const subscriberQuery = trpc.editorial.adminSubscribers.useQuery();
  const deliveryQuery = trpc.editorial.adminNewsletterDeliveries.useQuery();
  const updateInquiry = trpc.editorial.adminUpdateInquiryStatus.useMutation({ onSuccess: () => inquiryQuery.refetch() });
  const [location] = useLocation();
  const isInquiryView = location === "/studio/inquiries";
  const isSubscriberView = location === "/studio/subscribers";
  const isWriting = location === "/studio/new";
  const stats = useMemo(() => ({ published: (list.data ?? []).filter((story) => story.status === "published").length, drafts: (list.data ?? []).filter((story) => story.status === "draft").length, subscribers: (subscriberQuery.data ?? []).filter((subscriber) => subscriber.status === "subscribed").length, queued: (deliveryQuery.data ?? []).filter((delivery) => delivery.status === "queued").length, inquiries: (inquiryQuery.data ?? []).filter((inquiry) => inquiry.status === "new").length }), [deliveryQuery.data, inquiryQuery.data, list.data, subscriberQuery.data]);

  if (isWriting) return <StoryEditor editingRecord={editingRecord} onClose={() => setEditingRecord(null)} />;

  return (
    <section className="mx-auto max-w-6xl pb-16 text-[#f3f0ea]">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-5 border-b border-white/10 pb-6"><div><p className="eyebrow mb-3">Editorial workspace</p><h1 className="font-display text-5xl tracking-[-0.06em] sm:text-6xl">The working archive.</h1></div>{!isInquiryView ? <Button onClick={() => { setEditingRecord(null); setLocation("/studio/new"); }} className="rounded-none bg-[#b78a58] text-[#080808] hover:bg-[#d1a06b]"><FilePlus2 size={16} /> New story</Button> : null}</div>
      <div className="mb-10 grid gap-3 sm:grid-cols-5">{[["Published", stats.published], ["Drafts", stats.drafts], ["Subscribers", stats.subscribers], ["Queued notes", stats.queued], ["New inquiries", stats.inquiries]].map(([label, value]) => <div key={String(label)} className="border border-white/10 bg-[#11100f] p-5"><p className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[#aaa69f]">{label}</p><p className="mt-3 font-display text-4xl text-[#f3f0ea]">{value}</p></div>)}</div>
      {isSubscriberView ? <div className="grid gap-5"><div className="border border-white/10 bg-[#11100f]"><div className="flex items-center justify-between border-b border-white/10 p-5"><div><p className="eyebrow">Subscriber list</p><h2 className="mt-3 font-display text-3xl">Readers who asked to hear more.</h2></div><UsersRound className="text-[#b78a58]" /></div><div className="divide-y divide-white/10">{subscriberQuery.isLoading ? <p className="p-6 text-sm text-[#aaa69f]">Loading subscribers…</p> : (subscriberQuery.data ?? []).length === 0 ? <p className="p-6 text-sm text-[#aaa69f]">No subscribers yet. The opt-in form lives in the public footer.</p> : subscriberQuery.data?.map((subscriber) => <div key={subscriber.id} className="flex flex-wrap items-center justify-between gap-4 p-5"><div><p className="font-display text-2xl">{subscriber.displayName || "Reader"}</p><p className="mt-1 font-mono text-[0.58rem] tracking-[0.08em] text-[#b78a58]">{subscriber.email}</p></div><span className={`font-mono text-[0.56rem] uppercase tracking-[0.12em] ${subscriber.status === "subscribed" ? "text-[#b78a58]" : "text-[#88837d]"}`}>{subscriber.status}</span></div>)}</div></div><div className="border border-white/10 bg-[#11100f]"><div className="flex items-center justify-between border-b border-white/10 p-5"><div><p className="eyebrow">Publish notification log</p><h2 className="mt-3 font-display text-3xl">Ready for delivery.</h2></div><BellRing className="text-[#b78a58]" /></div><p className="border-b border-white/10 p-5 text-sm leading-relaxed text-[#aaa69f]">Each direct publish records the opted-in readers who are eligible for an update. Email delivery is intentionally paused until an external provider is connected.</p><div className="divide-y divide-white/10">{(deliveryQuery.data ?? []).slice(0, 10).map((delivery) => <div key={delivery.id} className="flex items-center justify-between gap-4 p-5"><p className="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#aaa69f]">Story #{delivery.storyId} · subscriber #{delivery.subscriberId}</p><span className="font-mono text-[0.56rem] uppercase tracking-[0.12em] text-[#b78a58]">{delivery.status}</span></div>)}{(deliveryQuery.data ?? []).length === 0 ? <p className="p-6 text-sm text-[#aaa69f]">Publish a new journal after readers subscribe to populate this log.</p> : null}</div></div></div> : isInquiryView ? <div className="border border-white/10 bg-[#11100f]"><div className="flex items-center justify-between border-b border-white/10 p-5"><div><p className="eyebrow">Lead inbox</p><h2 className="mt-3 font-display text-3xl">Correspondence in view.</h2></div><Inbox className="text-[#b78a58]" /></div><div className="divide-y divide-white/10">{inquiryQuery.isLoading ? <p className="p-6 text-sm text-[#aaa69f]">Loading inquiries…</p> : (inquiryQuery.data ?? []).length === 0 ? <p className="p-6 text-sm text-[#aaa69f]">No inquiry has arrived yet. The footer form will send new notes here.</p> : inquiryQuery.data?.map((inquiry) => <article key={inquiry.id} className="grid gap-4 p-5 lg:grid-cols-[0.7fr_1.4fr_auto]"><div><p className="font-display text-2xl">{inquiry.fullName}</p><a href={`mailto:${inquiry.email}`} className="mt-2 block font-mono text-[0.58rem] tracking-[0.08em] text-[#b78a58]">{inquiry.email}</a><p className="mt-2 font-mono text-[0.56rem] uppercase tracking-[0.12em] text-[#88837d]">{inquiry.outlet || "Independent"} · {inquiry.inquiryType}</p></div><p className="text-sm leading-relaxed text-[#d2cec6]">{inquiry.message}</p><select value={inquiry.status} onChange={(event) => updateInquiry.mutate({ id: inquiry.id, status: event.target.value as "new" | "reviewed" | "contacted" })} className="h-9 border border-white/15 bg-[#080808] px-2 font-mono text-[0.56rem] uppercase tracking-[0.1em] text-[#f3f0ea] outline-none focus:border-[#b78a58]"><option value="new">New</option><option value="reviewed">Reviewed</option><option value="contacted">Contacted</option></select></article>)}</div></div> : <div className="grid gap-4">{list.isLoading ? <p className="text-sm text-[#aaa69f]">Loading story desk…</p> : (list.data ?? []).length === 0 ? <div className="border border-dashed border-white/20 p-8"><PenLine className="text-[#b78a58]" /><p className="mt-5 font-display text-3xl">The first page is waiting.</p><p className="mt-3 max-w-md text-sm leading-relaxed text-[#aaa69f]">Create a draft, write in the journal editor, preview the reading layout, then publish when the story is ready.</p></div> : list.data?.map((story) => <article key={story.id} className="grid gap-5 border border-white/10 bg-[#11100f] p-5 sm:grid-cols-[7rem_1fr_auto] sm:items-center"><img src={story.heroImageUrl} alt="" className="aspect-square w-full object-cover brightness-[0.78]" /><div><div className="flex flex-wrap gap-2 font-mono text-[0.56rem] uppercase tracking-[0.13em] text-[#b78a58]"><span>{String(story.storyNumber).padStart(2, "0")}</span><span>·</span><span>{story.status}</span><span>·</span><span>{story.category}</span></div><h2 className="mt-2 font-display text-3xl leading-none">{story.title}</h2><p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#aaa69f]">{story.deck}</p></div><button type="button" onClick={() => { setEditingRecord(story); setLocation("/studio/new"); }} className="inline-flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.13em] text-[#f3f0ea] hover:text-[#b78a58]"><PenLine size={14} /> Edit</button></article>)}</div>}
    </section>
  );
}

export default function Studio() {
  const { user, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center bg-[#080808] text-[#b78a58]"><Loader2 className="animate-spin" /></div>;
  if (user && user.role !== "admin") return <main className="grid min-h-screen place-items-center bg-[#080808] px-5 text-center text-[#f3f0ea]"><div><p className="eyebrow">Studio access</p><h1 className="mt-5 font-display text-5xl">This desk is private.</h1><p className="mt-5 max-w-md text-sm leading-relaxed text-[#aaa69f]">Your account is signed in, but has not been given editor access yet.</p></div></main>;
  return <DashboardLayout><StudioDesk /></DashboardLayout>;
}
