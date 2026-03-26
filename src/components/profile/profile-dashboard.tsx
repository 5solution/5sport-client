"use client";

import { Calendar, MapPin, Trophy, Target, ChevronRight, Zap, Loader2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import { AXIOS_INSTANCE } from "@/lib/api/axiosInstance";
import { useEffect, useState } from "react";

interface EventParticipation {
  participantId: string;
  status: string;
  ticketCode: string;
  registrationDate: string;
  bibNumber: string | null;
  partnerId: string | null;
  partner: { id: string; name: string } | null;
  session: {
    id: string;
    name: string;
    competitionFormat: string;
    requirePartner: boolean;
  } | null;
  event: {
    id: string;
    name: string;
    brand: string;
    sportType: string;
    slug: string;
    status: string;
    bannerImageUrl: string | null;
    eventStartTime: string;
    eventEndTime: string;
    address: string;
  } | null;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PAIRED: { label: "Xác nhận", color: "text-emerald-600" },
  REGISTERED: { label: "Đã đăng ký", color: "text-amber-500" },
  FINDING_PARTNER: { label: "Chờ ghép cặp", color: "text-blue-500" },
  WAITING_PARTNER: { label: "Chờ đối tác", color: "text-blue-500" },
  CHECKED_IN: { label: "Đã check-in", color: "text-emerald-600" },
  READY: { label: "Sẵn sàng", color: "text-emerald-600" },
  PLAYING: { label: "Đang thi đấu", color: "text-primary" },
  ELIMINATED: { label: "Đã loại", color: "text-slate-400" },
  WINNER: { label: "Vô địch", color: "text-amber-500" },
  WITHDRAWN: { label: "Đã rút", color: "text-red-500" },
};

export function ProfileDashboard() {
  const [events, setEvents] = useState<EventParticipation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AXIOS_INSTANCE
      .get("/users/me/events")
      .then((res) => setEvents(res.data as EventParticipation[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalEvents = events.length;
  const wins = events.filter((e) => e.status === "WINNER").length;

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Left: My Events */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-secondary">
              Giải đấu đã tham gia
            </h2>
            <p className="text-xs text-slate-400">
              {totalEvents} giải đấu{wins > 0 ? ` \u2022 ${wins} lần vô địch` : ""}
            </p>
          </div>
          <Link
            href="/events"
            className="flex cursor-pointer items-center gap-1 text-xs font-medium text-primary transition-colors duration-200 hover:text-primary/80"
          >
            Xem tất cả
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-50 px-5">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            </div>
          ) : events.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-400">
              Bạn chưa tham gia giải đấu nào
            </div>
          ) : (
            events.slice(0, 5).map((p) => {
              const statusInfo = STATUS_LABELS[p.status] || {
                label: p.status,
                color: "text-slate-400",
              };
              return (
                <Link
                  key={p.participantId}
                  href={`/events/${p.event?.id}`}
                  className="group flex items-center gap-3 py-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/5">
                    {p.status === "WINNER" ? (
                      <Trophy className="h-5 w-5 text-amber-500" />
                    ) : p.status === "FINDING_PARTNER" ? (
                      <Users className="h-5 w-5 text-blue-500" />
                    ) : (
                      <Calendar className="h-5 w-5 text-primary" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-secondary transition-colors duration-200 group-hover:text-primary">
                      {p.event?.name}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-400">
                      {p.event?.eventStartTime && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(p.event.eventStartTime).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      )}
                      {p.event?.address && (
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {p.event.address}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    {p.session && (
                      <Badge className="border-0 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {p.session.name}
                      </Badge>
                    )}
                    <span className={`text-xs font-medium ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        <div className="border-t border-slate-100 px-5 py-3">
          <Link
            href="/events"
            className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-200 py-2.5 text-xs font-medium text-slate-400 transition-all duration-200 hover:border-primary/30 hover:text-primary"
          >
            <Calendar className="h-3.5 w-3.5" />
            Tìm sự kiện mới
          </Link>
        </div>
      </div>

      {/* Right: Stats Summary */}
      <div className="flex flex-col gap-5">
        {/* Quick Stats */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-secondary">
            Thống kê nhanh
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={<Calendar className="h-5 w-5 text-primary" />}
              label="Giải đấu"
              value={totalEvents}
            />
            <StatCard
              icon={<Trophy className="h-5 w-5 text-amber-500" />}
              label="Vô địch"
              value={wins}
            />
            <StatCard
              icon={<Target className="h-5 w-5 text-emerald-500" />}
              label="Đang chờ"
              value={
                events.filter(
                  (e) =>
                    e.status === "REGISTERED" ||
                    e.status === "FINDING_PARTNER" ||
                    e.status === "PAIRED"
                ).length
              }
            />
            <StatCard
              icon={<Zap className="h-5 w-5 text-blue-500" />}
              label="Đã thi đấu"
              value={
                events.filter(
                  (e) =>
                    e.status === "ELIMINATED" ||
                    e.status === "WINNER" ||
                    e.status === "PLAYING"
                ).length
              }
            />
          </div>
        </div>

        {/* Milestone */}
        <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 via-white to-accent/5 p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-secondary">
                Mục tiêu tiếp theo
              </h3>
              <p className="text-xs text-slate-400">
                {totalEvents < 10 ? "10 sự kiện" : totalEvents < 30 ? "30 sự kiện" : "50 sự kiện"}
              </p>
            </div>
            <div className="ml-auto text-right">
              <span className="text-lg font-extrabold text-primary">
                {totalEvents}
              </span>
              <span className="text-sm text-slate-400">
                /{totalEvents < 10 ? 10 : totalEvents < 30 ? 30 : 50}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-blue-400 transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round((totalEvents / (totalEvents < 10 ? 10 : totalEvents < 30 ? 30 : 50)) * 100))}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-accent/20 px-3 py-2">
            <Zap className="h-3.5 w-3.5 text-secondary" />
            <p className="text-xs font-medium text-secondary">
              Đạt mục tiêu sẽ mở khóa huy hiệu đặc biệt
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-lg font-extrabold text-secondary">{value}</p>
        <p className="text-xs text-slate-400">{label}</p>
      </div>
    </div>
  );
}
