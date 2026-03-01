"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePublicEventControllerFindAll } from "@/lib/services/public/public";
import { EventCard } from "@/components/events/event-card";
import { EventsFilter } from "@/components/events/events-filter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CalendarX } from "lucide-react";
import type { PublicEventControllerFindAllSportType } from "@/lib/schemas/publicEventControllerFindAllSportType";
import type { EventResponseDto } from "@/lib/schemas/eventResponseDto";

export default function EventsPage() {
  const t = useTranslations("events");
  const [search, setSearch] = useState("");
  const [sportType, setSportType] = useState("all");
  const [page, setPage] = useState(1);

  const params = {
    page,
    limit: 12,
    ...(search ? { search } : {}),
    ...(sportType !== "all"
      ? { sportType: sportType as PublicEventControllerFindAllSportType }
      : {}),
  };

  const { data, isLoading } = usePublicEventControllerFindAll(params);

  const events = (data as { data?: EventResponseDto[] } | undefined)?.data ?? [];
  const meta = (data as { meta?: { totalPages?: number } } | undefined)?.meta;
  const hasMore = meta?.totalPages ? page < meta.totalPages : false;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSportTypeChange = (value: string) => {
    setSportType(value);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-container px-6 py-10 lg:px-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-secondary">
          {t("title")}
        </h1>
        <p className="mt-2 text-base text-slate-500">{t("subtitle")}</p>
      </div>

      {/* Filters */}
      <EventsFilter
        search={search}
        onSearchChange={handleSearchChange}
        sportType={sportType}
        onSportTypeChange={handleSportTypeChange}
      />

      {/* Results */}
      {isLoading ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-slate-200">
              <Skeleton className="aspect-[21/9] w-full" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="mt-20 flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <CalendarX className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-secondary">
            {t("noEvents")}
          </h3>
          <p className="mt-1 text-sm text-slate-500">{t("noEventsDesc")}</p>
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-10 flex justify-center">
              <Button
                variant="outline"
                className="px-8"
                onClick={() => setPage((p) => p + 1)}
              >
                {t("loadMore")}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
