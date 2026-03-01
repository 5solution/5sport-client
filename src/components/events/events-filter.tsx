"use client";

import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EventsFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  sportType: string;
  onSportTypeChange: (value: string) => void;
}

export function EventsFilter({
  search,
  onSearchChange,
  sportType,
  onSportTypeChange,
}: EventsFilterProps) {
  const t = useTranslations("events");

  const sportTabs = [
    { value: "all", label: t("all") },
    { value: "PICKLEBALL", label: t("pickleball") },
    { value: "BADMINTON", label: t("badminton") },
  ];

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="flex h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-secondary shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Sport Filter */}
      <Tabs value={sportType} onValueChange={onSportTypeChange}>
        <TabsList className="h-auto gap-2 bg-transparent p-0">
          {sportTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="cursor-pointer rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-500 transition-all duration-200 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:shadow-primary/20"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
