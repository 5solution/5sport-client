"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Loader2,
  Home,
  Copy,
  Check,
  CheckCircle2,
  Building2,
  CreditCard,
  FileText,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AXIOS_INSTANCE as axiosInstance } from "@/lib/api/axiosInstance";

interface PaymentInfo {
  qrCodeData: string;
  accountInfo: {
    accountNumber: string;
    accountName: string;
    bankShortName: string;
    bankFullName: string;
    transferDescription: string;
  };
  amount: number;
  orderId: string;
  orderCode: string;
  expireDate: string;
  paymentId: string;
}

export default function PaymentCheckoutPage() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("orderCode") ?? "";
  const qrCodeData = searchParams.get("qr") ?? "";
  const accountNumber = searchParams.get("accNo") ?? "";
  const accountName = searchParams.get("accName") ?? "";
  const bankShortName = searchParams.get("bank") ?? "";
  const bankFullName = searchParams.get("bankFull") ?? "";
  const transferDescription = searchParams.get("desc") ?? "";
  const amount = Number(searchParams.get("amount") ?? "0");
  const expireDate = searchParams.get("expire") ?? "";

  const [qrImage, setQrImage] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<string>("pending");
  const [copied, setCopied] = useState<string>("");

  // Generate QR image
  useEffect(() => {
    if (qrCodeData) {
      QRCode.toDataURL(qrCodeData, {
        width: 280,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
      })
        .then(setQrImage)
        .catch(console.error);
    }
  }, [qrCodeData]);

  // Countdown timer
  useEffect(() => {
    if (!expireDate) return;

    const calculateTimeLeft = () => {
      const now = Date.now();
      const expire = new Date(expireDate).getTime();
      return Math.max(0, Math.floor((expire - now) / 1000));
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      const left = calculateTimeLeft();
      setTimeLeft(left);
      if (left <= 0) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [expireDate]);

  // Poll payment status
  useEffect(() => {
    if (!orderCode || paymentStatus === "success") return;

    const poll = setInterval(async () => {
      try {
        const res = await axiosInstance.get(`/payments/status/${orderCode}`);
        const data = res.data as Record<string, unknown>;
        if (data.status === "success") {
          setPaymentStatus("success");
          clearInterval(poll);
        }
      } catch {
        // ignore
      }
    }, 5000);

    return () => clearInterval(poll);
  }, [orderCode, paymentStatus]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const copyToClipboard = useCallback((text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(""), 2000);
  }, []);

  if (paymentStatus === "success") {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </div>
        <h2 className="mt-4 text-xl font-extrabold text-green-600">
          Thanh toán thành công!
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Đơn hàng <span className="font-mono font-bold">{orderCode}</span> đã
          được thanh toán.
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

  if (!orderCode || !qrCodeData) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <h2 className="text-xl font-extrabold text-secondary">
          Thông tin thanh toán không hợp lệ
        </h2>
        <Link href="/events">
          <Button className="mt-6 bg-primary text-white hover:bg-primary/90">
            <Home className="mr-2 h-4 w-4" />
            Về danh sách sự kiện
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-extrabold text-secondary">
          Chuyển khoản ngân hàng
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Quét mã QR hoặc chuyển khoản theo thông tin bên dưới
        </p>
      </div>

      {/* QR Code */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex justify-center">
          {qrImage ? (
            <img
              src={qrImage}
              alt="QR thanh toán"
              className="rounded-xl"
              width={280}
              height={280}
            />
          ) : (
            <div className="flex h-[280px] w-[280px] items-center justify-center rounded-xl bg-slate-100">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          )}
        </div>

        {/* Amount */}
        <div className="mt-4 text-center">
          <p className="text-sm text-slate-400">Số tiền</p>
          <p className="text-2xl font-extrabold text-primary">
            {amount.toLocaleString("vi-VN")} ₫
          </p>
        </div>
      </div>

      {/* Bank Info */}
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-secondary mb-3">
          Thông tin chuyển khoản
        </h3>

        <InfoRow
          icon={Building2}
          label="Ngân hàng"
          value={bankFullName || bankShortName}
        />
        <InfoRow
          icon={CreditCard}
          label="Số tài khoản"
          value={accountNumber}
          mono
          onCopy={() => copyToClipboard(accountNumber, "accNo")}
          copied={copied === "accNo"}
        />
        <InfoRow icon={User} label="Chủ tài khoản" value={accountName} />
        <InfoRow
          icon={FileText}
          label="Nội dung CK"
          value={transferDescription}
          mono
          small
          onCopy={() => copyToClipboard(transferDescription, "desc")}
          copied={copied === "desc"}
        />
      </div>

      {/* Timer */}
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-slate-500">
            <Clock className="h-4 w-4" />
            Thời gian còn lại
          </span>
          <span
            className={cn(
              "font-mono text-lg font-bold",
              timeLeft < 300 ? "text-red-500" : "text-green-600"
            )}
          >
            {formatTime(timeLeft)}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Loader2 className="h-3 w-3 animate-spin" />
          Đang chờ xác nhận thanh toán...
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm">
        <p className="font-semibold text-blue-900 mb-2">Hướng dẫn:</p>
        <ol className="list-decimal list-inside space-y-1 text-blue-800 text-xs">
          <li>Mở app ngân hàng của bạn</li>
          <li>Chọn &quot;Chuyển khoản&quot; hoặc &quot;Quét QR&quot;</li>
          <li>Quét mã QR hoặc nhập thông tin chuyển khoản</li>
          <li>
            Nhập <strong>đúng nội dung chuyển khoản</strong> để hệ thống xác
            nhận tự động
          </li>
          <li>Xác nhận và hoàn tất giao dịch</li>
        </ol>
      </div>

      {/* Back */}
      <div className="mt-6 text-center">
        <Link href="/events">
          <Button variant="outline" className="border-slate-200">
            <Home className="mr-2 h-4 w-4" />
            Về danh sách sự kiện
          </Button>
        </Link>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  mono,
  small,
  onCopy,
  copied,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
  mono?: boolean;
  small?: boolean;
  onCopy?: () => void;
  copied?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
      <Icon className="h-4 w-4 shrink-0 text-primary" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p
          className={cn(
            "font-semibold text-secondary truncate",
            mono && "font-mono",
            small ? "text-xs" : "text-sm"
          )}
        >
          {value}
        </p>
      </div>
      {onCopy && (
        <button
          onClick={onCopy}
          className="shrink-0 rounded-lg p-1.5 hover:bg-slate-200 transition-colors"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 text-slate-400" />
          )}
        </button>
      )}
    </div>
  );
}
