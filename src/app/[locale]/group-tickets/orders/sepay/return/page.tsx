"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle2, XCircle, Clock, Loader2, RefreshCw } from "lucide-react";
import { useCampaignOrderSepayControllerFindOnePublic } from "@/lib/services/campaign-orders-sepay/campaign-orders-sepay";
import type { OrderPublicResponseDto, OrderPublicResponseDtoPaymentStatus } from "@/lib/schemas";
import { toast } from "sonner";

function StatusIcon({ status }: { status: OrderPublicResponseDtoPaymentStatus | undefined }) {
  if (!status) return <Clock className="h-16 w-16 text-yellow-500" />;
  if (status === "PAID") return <CheckCircle2 className="h-16 w-16 text-green-500" />;
  if (status === "FAILED" || status === "CANCELED") return <XCircle className="h-16 w-16 text-red-500" />;
  return <Clock className="h-16 w-16 text-yellow-500" />;
}

function statusColor(status: OrderPublicResponseDtoPaymentStatus | undefined): string {
  if (status === "PAID") return "text-green-600";
  if (status === "FAILED" || status === "CANCELED") return "text-red-600";
  return "text-yellow-600";
}

export default function SepayReturnPage() {
  const searchParams = useSearchParams();
  const t = useTranslations("groupTickets");

  const orderCode = searchParams.get("orderCode") ?? "";

  const { data, isLoading, isFetching, refetch } = useCampaignOrderSepayControllerFindOnePublic(orderCode, {
    query: { enabled: !!orderCode },
  });

  async function handleReload() {
    try {
      await refetch({ throwOnError: true });
      toast.success(t("sepayReloadSuccess"));
    } catch {
      toast.error(t("sepayReloadError"));
    }
  }

  // The axios interceptor unwraps the API envelope { status, code, data } → data,
  // so `data` at runtime is already OrderPublicResponseDto, not the orval-typed wrapper.
  const order = data as unknown as OrderPublicResponseDto | undefined;
  const paymentStatus = order?.paymentStatus;

  function formatPaidAt(dateStr: string | undefined): string {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const mo = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${hh}:${mm}:${ss} ${dd}/${mo}/${yyyy}`;
  }

  function statusLabel(s: OrderPublicResponseDtoPaymentStatus | undefined): string {
    if (s === "PAID") return t("sepayStatusSuccess");
    if (s === "CANCELED") return t("sepayStatusCanceled");
    if (s === "FAILED") return t("sepayStatusFailed");
    if (s === "PENDING") return t("sepayStatusPending");
    return t("sepayStatusUnknown");
  }

  return (
    <div className="mx-auto max-w-container px-6 py-12 lg:px-20">
      <Link
        href="/group-tickets"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("backToList")}
      </Link>

      <div className="flex justify-center">
        <Card className="w-full max-w-md border-slate-200">
          <CardHeader className="items-center pb-2 text-center">
            {isLoading ? (
              <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
            ) : (
              <StatusIcon status={paymentStatus} />
            )}
            <CardTitle className="mt-4 text-2xl font-extrabold">
              {t("sepayReturnTitle")}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("sepayOrderCode")}
                </span>
                <span className="font-mono text-sm font-semibold text-foreground">
                  {orderCode || "—"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("sepayStatus")}
                </span>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <span className={`text-sm font-semibold ${statusColor(paymentStatus)}`}>
                    {statusLabel(paymentStatus)}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("sepayBuyerName")}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : (order ? `${order.lastName} ${order.firstName}` : "—")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("sepayPaidAt")}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : formatPaidAt(order?.paidAt)}
                </span>
              </div>

              <Separator />

              <div className="flex flex-col gap-3 pt-2">
                <Button
                  onClick={handleReload}
                  disabled={isFetching}
                  className="w-full cursor-pointer gap-2 rounded-xl bg-primary font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isFetching ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("sepayReloadChecking")}
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      {t("sepayReloadButton")}
                    </>
                  )}
                </Button>

                <Link href="/group-tickets">
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {t("backToList")}
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
