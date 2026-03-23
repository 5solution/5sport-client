"use client";

import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Home,
  CalendarDays,
  CreditCard,
  User,
  FileText,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePublicEventOrderControllerFindPublicByOrderCode } from "@/lib/services/event-orders-public/event-orders-public";

const STATUS_CONFIG = {
  PAID: {
    icon: CheckCircle2,
    label: "Thanh toán thành công",
    color: "text-green-600",
    bg: "bg-green-50",
    badgeBg: "bg-green-100 text-green-700",
    iconColor: "text-green-500",
  },
  FAILED: {
    icon: XCircle,
    label: "Thanh toán thất bại",
    color: "text-red-600",
    bg: "bg-red-50",
    badgeBg: "bg-red-100 text-red-700",
    iconColor: "text-red-500",
  },
  CANCELLED: {
    icon: XCircle,
    label: "Đã hủy",
    color: "text-red-600",
    bg: "bg-red-50",
    badgeBg: "bg-red-100 text-red-700",
    iconColor: "text-red-500",
  },
  PENDING: {
    icon: Clock,
    label: "Đang chờ thanh toán",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    badgeBg: "bg-yellow-100 text-yellow-700",
    iconColor: "text-yellow-500",
  },
  REFUNDED: {
    icon: RefreshCw,
    label: "Đã hoàn tiền",
    color: "text-blue-600",
    bg: "bg-blue-50",
    badgeBg: "bg-blue-100 text-blue-700",
    iconColor: "text-blue-500",
  },
};

export default function EventPaymentReturnPage() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("orderCode") ?? "";

  const { data: rawData, isLoading: loading, refetch, isRefetching: refreshing } =
    usePublicEventOrderControllerFindPublicByOrderCode(orderCode, {
      query: { enabled: !!orderCode },
    });

  const order = (rawData as any)?.data ?? rawData;

  const handleRefresh = () => {
    refetch();
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16">
        <div className="space-y-4 text-center">
          <Skeleton className="mx-auto h-16 w-16 rounded-full" />
          <Skeleton className="mx-auto h-8 w-48" />
          <Skeleton className="mx-auto h-4 w-64" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!orderCode || !order) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <XCircle className="mx-auto h-16 w-16 text-red-400" />
        <h2 className="mt-4 text-xl font-extrabold text-secondary">
          Không tìm thấy đơn hàng
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Mã đơn hàng không hợp lệ hoặc đã hết hạn.
        </p>
        <Link href="/events">
          <Button className="mt-6 bg-primary text-white hover:bg-primary/90">
            <Home className="mr-2 h-4 w-4" />
            Về danh sách sự kiện
          </Button>
        </Link>
      </div>
    );
  }

  const status = STATUS_CONFIG[order.paymentStatus] ?? STATUS_CONFIG.PENDING;
  const StatusIcon = status.icon;

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      {/* Status header */}
      <div className="flex flex-col items-center text-center">
        <div
          className={cn(
            "flex h-20 w-20 items-center justify-center rounded-full",
            status.bg
          )}
        >
          <StatusIcon className={cn("h-10 w-10", status.iconColor)} />
        </div>
        <h2
          className={cn("mt-4 text-xl font-extrabold", status.color)}
        >
          {status.label}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Mã đơn hàng: <span className="font-mono font-bold">{order.orderCode}</span>
        </p>
      </div>

      {/* Order details */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-bold text-secondary">
          Thông tin đơn hàng
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
            <FileText className="h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-xs text-slate-400">Mã đơn hàng</p>
              <p className="font-mono text-sm font-semibold text-secondary">
                {order.orderCode}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
            <User className="h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-xs text-slate-400">Người đăng ký</p>
              <p className="text-sm font-semibold text-secondary">
                {order.contactName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
            <CreditCard className="h-4 w-4 shrink-0 text-primary" />
            <div className="flex flex-1 items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Số tiền</p>
                <p className="text-sm font-semibold text-secondary">
                  {Number(order.finalAmount).toLocaleString("vi-VN")} ₫
                </p>
              </div>
              <Badge className={cn("border-0 text-xs font-bold", status.badgeBg)}>
                {status.label}
              </Badge>
            </div>
          </div>

          {order.paidAt && (
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
              <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="text-xs text-slate-400">Thời gian thanh toán</p>
                <p className="text-sm font-semibold text-secondary">
                  {new Date(order.paidAt).toLocaleString("vi-VN")}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        {order.paymentStatus === "PENDING" && (
          <Button
            variant="outline"
            className="flex-1 border-slate-200 py-6 font-semibold"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Kiểm tra lại
          </Button>
        )}
        <Link href="/events" className="flex-1">
          <Button className="w-full bg-primary py-6 font-bold text-white hover:bg-primary/90">
            <Home className="mr-2 h-4 w-4" />
            Về danh sách sự kiện
          </Button>
        </Link>
      </div>
    </div>
  );
}
