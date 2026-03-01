"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { usePublicEventControllerFindOne } from "@/lib/services/public/public";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Share2,
  CreditCard,
  FileText,
  CheckCircle2,
} from "lucide-react";
import type { EventResponseDto } from "@/lib/schemas/eventResponseDto";

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusStyle(status: string) {
  switch (status) {
    case "LIVE":
      return "bg-emerald-500/10 text-emerald-700 border-emerald-200";
    case "PUBLISHED":
      return "bg-primary/10 text-primary border-primary/20";
    case "CLOSED":
      return "bg-slate-100 text-slate-600 border-slate-200";
    case "CANCELLED":
      return "bg-red-50 text-red-600 border-red-200";
    default:
      return "bg-slate-100 text-slate-500 border-slate-200";
  }
}

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const t = useTranslations("events");

  const { data, isLoading } = usePublicEventControllerFindOne(id);

  const event = data as EventResponseDto | undefined;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-container px-6 py-10 lg:px-20">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-6 aspect-[3/1] w-full rounded-2xl" />
        <div className="mt-8 space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mx-auto flex max-w-container flex-col items-center px-6 py-20 text-center lg:px-20">
        <h2 className="text-xl font-bold text-secondary">Event not found</h2>
        <Link href="/events">
          <Button variant="outline" className="mt-4">
            {t("backToEvents")}
          </Button>
        </Link>
      </div>
    );
  }

  const statusKey = `status${event.status.charAt(0)}${event.status.slice(1).toLowerCase()}` as
    | "statusDraft"
    | "statusPublished"
    | "statusLive"
    | "statusClosed"
    | "statusCancelled";

  return (
    <div className="mx-auto max-w-container px-6 py-8 lg:px-20">
      {/* Back */}
      <Link
        href="/events"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("backToEvents")}
      </Link>

      {/* === Social-style Banner === */}
      <div className="relative mt-6 overflow-hidden rounded-2xl">
        {/* Cover Banner */}
        <div className="relative aspect-[3/1] w-full bg-gradient-to-br from-secondary via-secondary/90 to-primary/80">
          {event.bannerImageUrl ? (
            <Image
              src={event.bannerImageUrl}
              alt={event.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-black uppercase tracking-tighter text-white/10 md:text-8xl">
                {event.sportType}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Profile-like overlay at bottom of banner */}
        <div className="relative -mt-20 px-6 pb-6 md:-mt-24 md:px-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-end">
            {/* Logo/Avatar */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-white shadow-lg md:h-32 md:w-32">
              {event.bannerImageUrl ? (
                <Image
                  src={event.bannerImageUrl}
                  alt={event.name}
                  width={120}
                  height={120}
                  className="rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80">
                  <span className="text-2xl font-black text-white md:text-3xl">
                    {event.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Event title + meta */}
            <div className="min-w-0 flex-1 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-0 bg-secondary/80 text-xs font-semibold text-white backdrop-blur-sm">
                  {event.sportType}
                </Badge>
                <Badge
                  variant="outline"
                  className={`text-xs font-semibold ${getStatusStyle(event.status)}`}
                >
                  {t(statusKey)}
                </Badge>
              </div>
              <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                {event.name}
              </h1>
              {event.brand && (
                <p className="mt-1 text-sm font-medium text-white/70">
                  {event.brand}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex shrink-0 gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
              >
                <Share2 className="mr-2 h-4 w-4" />
                {t("share")}
              </Button>
              <Button
                size="sm"
                className="bg-accent font-bold text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600"
              >
                {t("register")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* === Detail Content === */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Info Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-secondary">{t("eventInfo")}</h2>
            <Separator className="my-4" />
            <div className="space-y-4">
              <InfoRow icon={MapPin} label={t("address")} value={`${event.address}${event.wardName ? `, ${event.wardName}` : ""}${event.provinceName ? `, ${event.provinceName}` : ""}`} />
              <InfoRow icon={Phone} label={t("hotline")} value={event.hotline} />
              <InfoRow icon={Calendar} label={t("eventStart")} value={formatDateTime(event.eventStartTime)} />
              <InfoRow icon={Calendar} label={t("eventEnd")} value={formatDateTime(event.eventEndTime)} />
            </div>
          </div>

          {/* Schedule Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-secondary">{t("schedule")}</h2>
            <Separator className="my-4" />
            <div className="space-y-3">
              <ScheduleItem
                icon={Clock}
                label={t("checkin")}
                start={formatDateTime(event.checkinOpenTime)}
                end={formatDateTime(event.checkinCloseTime)}
              />
              <ScheduleItem
                icon={FileText}
                label={t("editInfo")}
                start={formatDateTime(event.editInfoOpenTime)}
                end={formatDateTime(event.editInfoCloseTime)}
              />
              {event.transferOpenTime && event.transferCloseTime && (
                <ScheduleItem
                  icon={Share2}
                  label={t("transfer")}
                  start={formatDateTime(event.transferOpenTime)}
                  end={formatDateTime(event.transferCloseTime)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Methods */}
          {event.paymentMethods.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-sm font-bold text-secondary">
                <CreditCard className="h-4 w-4 text-primary" />
                {t("paymentMethods")}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {event.paymentMethods.map((method) => (
                  <Badge
                    key={method}
                    variant="outline"
                    className="border-slate-200 text-xs font-medium text-slate-600"
                  >
                    {method.replace(/_/g, " ")}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {(event.termsFileUrl || event.conditionsFileUrl) && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-sm font-bold text-secondary">
                <FileText className="h-4 w-4 text-primary" />
                {t("terms")} & {t("conditions")}
              </h3>
              <div className="mt-4 space-y-2">
                {event.termsFileUrl && (
                  <a
                    href={event.termsFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-slate-100"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {t("terms")}
                  </a>
                )}
                {event.conditionsFileUrl && (
                  <a
                    href={event.conditionsFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-slate-100"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {t("conditions")}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Register CTA (sticky on mobile) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <Button className="w-full bg-accent py-6 text-base font-bold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/30">
              {t("register")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className="text-sm font-medium text-secondary">{value}</p>
      </div>
    </div>
  );
}

function ScheduleItem({
  icon: Icon,
  label,
  start,
  end,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  start: string;
  end: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
      <Icon className="h-4 w-4 shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-secondary">{label}</p>
        <p className="text-xs text-slate-500">
          {start} — {end}
        </p>
      </div>
    </div>
  );
}
