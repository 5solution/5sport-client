"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="relative w-full overflow-hidden bg-secondary">
      {/* Geometric accent shapes */}
      <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="absolute right-1/4 top-1/3 h-2 w-2 rounded-full bg-emerald-400" />
      <div className="absolute left-1/3 top-1/4 h-1.5 w-1.5 rounded-full bg-primary/60" />

      <div className="relative mx-auto flex max-w-container flex-col gap-8 px-6 py-20 lg:flex-row lg:items-center lg:px-20 lg:py-28">
        {/* Main Hero Content */}
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70 backdrop-blur-sm">
            <Zap className="h-3.5 w-3.5 text-emerald-400" />
            <span>Vietnam&apos;s #1 Sports Platform</span>
          </div>

          <h1 className="text-5xl font-black uppercase leading-[0.95] tracking-tighter text-white md:text-6xl lg:text-7xl">
            {t("title")}
          </h1>

          <p className="max-w-md text-base leading-relaxed text-slate-400 md:text-lg">
            {t("subtitle")}
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-primary px-8 text-base font-bold text-white shadow-lg shadow-primary/30 transition-all duration-200 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {t("cta")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 bg-transparent px-8 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
            >
              {t("promoTitle")}
            </Button>
          </div>

          {/* Stats row */}
          <div className="flex gap-10 pt-4">
            <div>
              <p className="text-2xl font-extrabold text-white">10K+</p>
              <p className="text-xs text-slate-500">Athletes</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white">500+</p>
              <p className="text-xs text-slate-500">Tournaments</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white">50+</p>
              <p className="text-xs text-slate-500">Cities</p>
            </div>
          </div>
        </div>

        {/* Promo Card */}
        <div className="w-full max-w-sm lg:w-[380px]">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-1 backdrop-blur-md">
            <div className="overflow-hidden rounded-xl">
              <div className="aspect-[4/3] bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 p-6">
                <div className="flex h-full flex-col items-start justify-between">
                  <span className="rounded-full bg-black/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                    Featured
                  </span>
                  <div>
                    <p className="text-4xl font-black uppercase tracking-tighter text-white drop-shadow-lg">
                      PICKLEBALL
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white/90">
                      {t("promoSubtitle")}
                    </p>
                    <button className="mt-4 cursor-pointer rounded-full bg-white px-5 py-2 text-xs font-bold uppercase tracking-wide text-orange-600 shadow-lg transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-500">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
