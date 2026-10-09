// Next
import Link from "next/link";
// Models
import { TRANSLATIONS } from "@/core/models";

// A server render, so Portuguese: there is no language toggle to read here.
export default function NotFound() {
  const t = TRANSLATIONS.pt;

  return (
    <div className="h-full px-[2rem] flex flex-col items-center justify-center gap-[1.2rem] text-center">
      <span className="font-mono text-[1.2rem] uppercase tracking-[0.1em] text-lavender">404</span>
      <h1 className="text-[2.8rem] font-bold tracking-[-0.02em]">{t.notFound.title}</h1>
      <p className="text-[1.4rem] text-copy">{t.notFound.body}</p>
      <Link href="/" className="mt-[0.6rem] h-[4.4rem] px-[1.8rem] inline-flex items-center rounded-full bg-action text-[1.4rem] font-semibold text-on-action transition-colors hover:bg-action-hover">
        {t.notFound.action}
      </Link>
    </div>
  );
}
