/**
 * Style guide: Fauzi / Journal.
 * The inquiry form behaves like a final correspondence card, using quiet fields and editorial labels.
 */
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export function MediaInquiryForm() {
  const [location] = useLocation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [outlet, setOutlet] = useState("");
  const [inquiryType, setInquiryType] = useState("Permintaan media");
  const [message, setMessage] = useState("");
  const submit = trpc.editorial.submitInquiry.useMutation({
    onSuccess: () => {
      setFullName("");
      setEmail("");
      setOutlet("");
      setMessage("");
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit.mutate({ fullName, email, outlet: outlet || undefined, inquiryType, message, sourcePath: location });
  };

  if (submit.isSuccess) {
    return (
      <div className="border border-[#b78a58]/55 bg-[#11100f] p-5">
        <Check size={18} className="text-[#b78a58]" />
        <p className="mt-4 font-display text-2xl leading-none text-[#f3f0ea]">Pesan Anda sudah masuk ke inbox.</p>
        <p className="mt-3 text-sm leading-relaxed text-[#aaa69f]">Terima kasih. Tim jurnal akan merespons sesegera mungkin.</p>
        <button type="button" onClick={() => submit.reset()} className="mt-5 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[#b78a58] hover:text-[#f3f0ea]">Kirim pertanyaan lain</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3" aria-label="Formulir pertanyaan media">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-[#99948c]">Nama</span>
          <input required value={fullName} onChange={(event) => setFullName(event.target.value)} className="h-10 border-b border-white/20 bg-transparent px-0 text-sm text-[#f3f0ea] outline-none transition-colors placeholder:text-[#625f59] focus:border-[#b78a58]" placeholder="Nama Anda" />
        </label>
        <label className="grid gap-1.5">
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-[#99948c]">Email</span>
          <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-10 border-b border-white/20 bg-transparent px-0 text-sm text-[#f3f0ea] outline-none transition-colors placeholder:text-[#625f59] focus:border-[#b78a58]" placeholder="you@publication.com" />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-[#99948c]">Media / organisasi</span>
          <input value={outlet} onChange={(event) => setOutlet(event.target.value)} className="h-10 border-b border-white/20 bg-transparent px-0 text-sm text-[#f3f0ea] outline-none transition-colors placeholder:text-[#625f59] focus:border-[#b78a58]" placeholder="Opsional" />
        </label>
        <label className="grid gap-1.5">
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-[#99948c]">Jenis pertanyaan</span>
          <select value={inquiryType} onChange={(event) => setInquiryType(event.target.value)} className="h-10 border-b border-white/20 bg-[#080808] px-0 text-sm text-[#f3f0ea] outline-none transition-colors focus:border-[#b78a58]">
            <option value="Permintaan media">Permintaan media</option>
            <option value="Wawancara">Wawancara</option>
            <option value="Kemitraan">Kemitraan</option>
            <option value="Korespondensi umum">Korespondensi umum</option>
          </select>
        </label>
      </div>
      <label className="grid gap-1.5">
        <span className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-[#99948c]">Pesan Anda</span>
        <textarea required minLength={16} value={message} onChange={(event) => setMessage(event.target.value)} className="min-h-24 resize-y border-b border-white/20 bg-transparent px-0 py-2 text-sm leading-relaxed text-[#f3f0ea] outline-none transition-colors placeholder:text-[#625f59] focus:border-[#b78a58]" placeholder="Ceritakan kebutuhan Anda kepada kami." />
      </label>
      {submit.error ? <p className="font-mono text-[0.58rem] leading-relaxed text-[#e08a76]">{submit.error.message}</p> : null}
      <button type="submit" disabled={submit.isPending} className="mt-2 inline-flex w-fit items-center gap-3 border-b border-[#b78a58]/80 pb-2 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[#f3f0ea] transition-colors hover:border-[#f3f0ea] disabled:cursor-wait disabled:opacity-60">
        {submit.isPending ? <Loader2 size={14} className="animate-spin text-[#b78a58]" /> : <ArrowUpRight size={14} className="text-[#b78a58]" />}
        {submit.isPending ? "Mengirim pesan" : "Kirim pertanyaan"}
      </button>
    </form>
  );
}
