import { cn } from "@/lib/utils";
export function LinkButton({ href, children, variant = "ghost", download, external }: {
  href: string; children: React.ReactNode; variant?: "solid" | "ghost"; download?: boolean; external?: boolean;
}) {
  return (
    <a href={href} download={download || undefined} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn("inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition hover:-translate-y-0.5",
        variant === "solid" ? "bg-gradient-to-r from-violet to-cyan text-void" : "border border-violet/40 bg-white/5 text-slate-100 hover:border-cyan/60")}>
      {children}
    </a>
  );
}
