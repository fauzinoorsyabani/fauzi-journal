import { useMemo } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../../_core/hooks/useAuth";
import { trpc } from "../../lib/trpc";
import { Button } from "../../components/ui/button";
import {
  FilePlus2,
  UsersRound,
  BellRing,
  Inbox,
  PenLine,
} from "lucide-react";
import { statusLabel } from "./useStoryDraft";

export function StudioDesk({
  onEditStory,
}: {
  onEditStory: (story: any) => void;
}) {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();

  const list = trpc.editorial.myStories.useQuery();
  const isAdmin = user?.role === "admin";
  const inquiryQuery = trpc.editorial.adminInquiries.useQuery(undefined, { enabled: isAdmin });
  const subscriberQuery = trpc.editorial.adminSubscribers.useQuery(undefined, { enabled: isAdmin });
  const deliveryQuery = trpc.editorial.adminNewsletterDeliveries.useQuery(undefined, { enabled: isAdmin });
  const updateInquiry = trpc.editorial.adminUpdateInquiryStatus.useMutation({
    onSuccess: () => inquiryQuery.refetch(),
  });

  const isInquiryView = location === "/studio/inquiries" && isAdmin;
  const isSubscriberView = location === "/studio/subscribers" && isAdmin;

  const stats = useMemo(
    () => ({
      published: (list.data ?? []).filter((story) => story.status === "published").length,
      drafts: (list.data ?? []).filter((story) => story.status === "draft").length,
      total: (list.data ?? []).length,
      subscribers: (subscriberQuery.data ?? []).filter((subscriber) => subscriber.status === "subscribed").length,
      queued: (deliveryQuery.data ?? []).filter((delivery) => delivery.status === "queued").length,
      inquiries: (inquiryQuery.data ?? []).filter((inquiry) => inquiry.status === "new").length,
    }),
    [deliveryQuery.data, inquiryQuery.data, list.data, subscriberQuery.data]
  );

  const statCards: [string, number][] = isAdmin
    ? [
        ["Diterbitkan", stats.published],
        ["Draf", stats.drafts],
        ["Pelanggan", stats.subscribers],
        ["Catatan tertunda", stats.queued],
        ["Pertanyaan baru", stats.inquiries],
      ]
    : [
        ["Diterbitkan", stats.published],
        ["Draf", stats.drafts],
        ["Total Jurnal", stats.total],
      ];

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
          <Button
            onClick={() => {
              onEditStory(null);
              setLocation("/studio/new");
            }}
            className="rounded-none bg-[#b78a58] text-[#080808] hover:bg-[#d1a06b]"
          >
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
                      <p className="mt-1 font-mono text-[0.58rem] tracking-[0.08em] text-[#b78a58]">
                        {subscriber.email}
                      </p>
                    </div>
                    <span
                      className={`font-mono text-[0.56rem] uppercase tracking-[0.12em] ${
                        subscriber.status === "subscribed" ? "text-[#b78a58]" : "text-[#88837d]"
                      }`}
                    >
                      {statusLabel(subscriber.status)}
                    </span>
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
            <p className="border-b border-white/10 p-5 text-sm leading-relaxed text-[#aaa69f]">
              Setiap penerbitan langsung mencatat pembaca yang telah memberi persetujuan untuk menerima pembaruan.
              Pengiriman email masih dijeda hingga penyedia eksternal terhubung.
            </p>
            <div className="divide-y divide-white/10">
              {(deliveryQuery.data ?? []).slice(0, 10).map((delivery) => (
                <div key={delivery.id} className="flex items-center justify-between gap-4 p-5">
                  <p className="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#aaa69f]">
                    Cerita #{delivery.storyId} · pelanggan #{delivery.subscriberId}
                  </p>
                  <span className="font-mono text-[0.56rem] uppercase tracking-[0.12em] text-[#b78a58]">
                    {statusLabel(delivery.status)}
                  </span>
                </div>
              ))}
              {(deliveryQuery.data ?? []).length === 0 ? (
                <p className="p-6 text-sm text-[#aaa69f]">
                  Terbitkan jurnal baru setelah pembaca berlangganan untuk mengisi log ini.
                </p>
              ) : null}
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
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="mt-2 block font-mono text-[0.58rem] tracking-[0.08em] text-[#b78a58]"
                    >
                      {inquiry.email}
                    </a>
                    <p className="mt-2 font-mono text-[0.56rem] uppercase tracking-[0.12em] text-[#88837d]">
                      {inquiry.outlet || "Independen"} · {inquiry.inquiryType}
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed text-[#d2cec6]">{inquiry.message}</p>
                  <select
                    value={inquiry.status}
                    onChange={(event) =>
                      updateInquiry.mutate({
                        id: inquiry.id,
                        status: event.target.value as "new" | "reviewed" | "contacted",
                      })
                    }
                    className="h-9 border border-white/15 bg-[#080808] px-2 font-mono text-[0.56rem] uppercase tracking-[0.1em] text-[#f3f0ea] outline-none focus:border-[#b78a58]"
                  >
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
                Mulai menulis jurnal pertama Anda, buat tata letak editorial, tambahkan gambar, lalu terbitkan untuk
                dibaca publik.
              </p>
              <Button
                onClick={() => {
                  onEditStory(null);
                  setLocation("/studio/new");
                }}
                className="mt-6 rounded-none bg-[#b78a58] text-[#080808] hover:bg-[#d1a06b]"
              >
                <FilePlus2 size={16} /> Tulis Jurnal Pertama
              </Button>
            </div>
          ) : (
            list.data?.map((story) => (
              <article
                key={story.id}
                className="grid gap-5 border border-white/10 bg-[#11100f] p-5 sm:grid-cols-[7rem_1fr_auto] sm:items-center"
              >
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
                <button
                  type="button"
                  onClick={() => {
                    onEditStory(story);
                    setLocation("/studio/new");
                  }}
                  className="inline-flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.13em] text-[#f3f0ea] hover:text-[#b78a58]"
                >
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
