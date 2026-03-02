"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

const SLIDES = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80",
    alt: "Pickleball tournament action",
    label: "PICKLEBALL",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
    alt: "Athletes training together",
    label: "ATHLETICS",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    alt: "Fitness sports community",
    label: "FITNESS",
  },
];

export function HeroSection() {
  const t = useTranslations("hero");
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent((index + SLIDES.length) % SLIDES.length);
      setTimeout(() => setIsTransitioning(false), 400);
    },
    [isTransitioning],
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="relative mx-auto flex max-w-container flex-col gap-8 px-6 py-20 lg:flex-row lg:items-center lg:px-20 lg:py-28">
        {/* Left: Hero Content */}
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary backdrop-blur-sm">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span>Vietnam&apos;s #1 Sports Platform</span>
          </div>

          <h1 className="text-5xl font-black uppercase leading-[0.95] tracking-tighter text-foreground md:text-6xl lg:text-7xl">
            {t("title")}
          </h1>

          <p className="max-w-md text-base leading-relaxed text-slate-500 md:text-lg">
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
              className="border-secondary/20 px-8 text-base font-semibold text-secondary hover:bg-secondary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
            >
              {t("promoTitle")}
            </Button>
          </div>

          {/* Stats row */}
          <div className="flex gap-10 pt-4">
            <div>
              <p className="text-2xl font-extrabold text-secondary">10K+</p>
              <p className="text-xs text-slate-400">Athletes</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-secondary">500+</p>
              <p className="text-xs text-slate-400">Tournaments</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-secondary">50+</p>
              <p className="text-xs text-slate-400">Cities</p>
            </div>
          </div>
        </div>

        {/* Right: Image Slider */}
        <div className="w-full max-w-sm shrink-0 lg:w-[420px]">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60">
            {/* Slides */}
            <div className="relative aspect-[4/3]">
              {SLIDES.map((slide, i) => (
                <div
                  key={slide.id}
                  className="absolute inset-0 transition-opacity duration-400"
                  style={{ opacity: i === current ? 1 : 0 }}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    className="object-cover"
                    priority={i === 0}
                    sizes="(max-width: 1024px) 100vw, 420px"
                  />
                  {/* Label */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-5">
                    <span className="text-2xl font-black uppercase tracking-tighter text-white drop-shadow">
                      {slide.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Prev / Next arrows */}
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white/80 p-1.5 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-lg"
            >
              <ChevronLeft className="h-5 w-5 text-secondary" />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white/80 p-1.5 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-lg"
            >
              <ChevronRight className="h-5 w-5 text-secondary" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`cursor-pointer rounded-full transition-all duration-200 ${i === current
                    ? "w-5 bg-accent"
                    : "w-1.5 bg-white/60 hover:bg-white"
                    } h-1.5`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
