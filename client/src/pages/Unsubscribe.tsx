import { Check, MailX } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Unsubscribe() {
  const token = new URLSearchParams(window.location.search).get("token") ?? "";
  const [complete, setComplete] = useState(false);
  const unsubscribe = trpc.editorial.unsubscribe.useMutation({ onSuccess: () => setComplete(true) });
  return <main className="grid min-h-screen place-items-center bg-[#080808] px-5 text-[#f3f0ea]"><div className="max-w-lg border border-white/10 bg-[#11100f] p-8 sm:p-10">{complete ? <Check className="text-[#b78a58]" /> : <MailX className="text-[#b78a58]" />}<p className="eyebrow mt-7">Catatan jurnal</p><h1 className="mt-4 font-display text-5xl leading-[0.88] tracking-[-0.06em]">{complete ? "Anda sudah berhenti berlangganan." : "Berhenti dari daftar?"}</h1><p className="mt-5 text-sm leading-relaxed text-[#aaa69f]">{complete ? "Anda tidak akan menerima notifikasi rilis jurnal berikutnya. Anda dapat bergabung kembali kapan saja melalui footer." : "Konfirmasikan untuk berhenti menerima catatan terbaru dari Fauzi / Journal."}</p>{!complete ? <button type="button" disabled={!token || unsubscribe.isPending} onClick={() => unsubscribe.mutate({ token })} className="mt-8 border-b border-[#b78a58] pb-2 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[#f3f0ea] disabled:opacity-50">{unsubscribe.isPending ? "Memperbarui…" : "Berhenti berlangganan"}</button> : null}<Link href="/" className="ml-0 mt-8 block font-mono text-[0.58rem] uppercase tracking-[0.13em] text-[#b78a58]">Kembali ke jurnal</Link></div></main>;
}
