"use client";

import { useTranslations } from "next-intl";
import { Calendar, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import type { EventResponseDto } from "@/lib/schemas/eventResponseDto";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getStatusColor(status: string) {
  switch (status) {
    case "LIVE":
      return "bg-emerald-500 text-white";
    case "PUBLISHED":
      return "bg-primary text-white";
    case "CLOSED":
      return "bg-slate-400 text-white";
    case "CANCELLED":
      return "bg-red-500 text-white";
    default:
      return "bg-slate-200 text-slate-600";
  }
}

export function EventCard({ event }: { event: EventResponseDto }) {
  const t = useTranslations("events");

  const statusKey = `status${event.status.charAt(0)}${event.status.slice(1).toLowerCase()}` as
    | "statusDraft"
    | "statusPublished"
    | "statusLive"
    | "statusClosed"
    | "statusCancelled";

  return (
    <Link href={`/events/${event.id}`}>
      <div className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50">
        {/* Banner */}
        <div className="relative aspect-[21/9] overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
          {event.bannerImageUrl ? (
            <Image
              src={event.bannerImageUrl}
              alt={event.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-4xl font-black uppercase tracking-tighter text-primary/20">
                {event.sportType}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute left-3 top-3 flex gap-2">
            <Badge className="border-0 bg-secondary/80 text-xs font-semibold text-white backdrop-blur-sm">
              {event.sportType}
            </Badge>
            <Badge className={`border-0 text-xs font-semibold backdrop-blur-sm ${getStatusColor(event.status)}`}>
              {t(statusKey)}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="line-clamp-2 text-base font-bold text-secondary">
            {event.name}
          </h3>
          {event.brand && (
            <p className="mt-1 text-xs font-medium text-primary">{event.brand}</p>
          )}

          <div className="mt-4 space-y-2.5">
            <div className="flex items-center gap-2.5 text-sm text-slate-500">
              <Calendar className="h-4 w-4 shrink-0 text-primary" />
              <span>
                {formatDate(event.eventStartTime)} — {formatDate(event.eventEndTime)}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-slate-500">
              <MapPin className="h-4 w-4 shrink-0 text-primary" />
              <span className="line-clamp-1">
                {event.address}
                {event.provinceName && `, ${event.provinceName}`}
              </span>
            </div>
            {event.hotline && (
              <div className="flex items-center gap-2.5 text-sm text-slate-500">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <span>{event.hotline}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
