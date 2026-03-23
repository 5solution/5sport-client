"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle2,
  MessageSquare,
  Star,
  Send,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AXIOS_INSTANCE as axiosInstance } from "@/lib/api/axiosInstance";

const CATEGORIES = [
  { value: "GENERAL", label: "Gop y chung" },
  { value: "EVENT", label: "Su kien" },
  { value: "PAYMENT", label: "Thanh toan" },
  { value: "UI_UX", label: "Giao dien" },
  { value: "BUG", label: "Loi / Bug" },
  { value: "SUGGESTION", label: "De xuat tinh nang" },
];

export default function FeedbackPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async () => {
    if (!name || !email || !content) {
      toast.error("Vui long nhap day du ho ten, email va noi dung");
      return;
    }

    setIsSubmitting(true);
    try {
      await axiosInstance.post("/feedback", {
        name,
        email,
        phone: phone || undefined,
        category,
        content,
        rating: rating || undefined,
      });
      setSubmitted(true);
      toast.success("Cam on ban da gui gop y!");
    } catch (err: any) {
      toast.error(err?.message || "Da xay ra loi. Vui long thu lai.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-container px-6 py-16 lg:px-20">
        <div className="mx-auto max-w-lg text-center">
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
          </div>
          <h2 className="mt-6 text-2xl font-extrabold text-secondary">
            Cam on ban!
          </h2>
          <p className="mt-2 text-slate-500">
            Gop y cua ban da duoc ghi nhan. Chung toi se xem xet va cai thien
            dich vu dua tren phan hoi cua ban.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/">
              <Button variant="outline" className="border-slate-200 font-semibold">
                Ve trang chu
              </Button>
            </Link>
            <Button
              className="bg-primary font-semibold text-white hover:bg-primary/90"
              onClick={() => {
                setSubmitted(false);
                setName("");
                setEmail("");
                setPhone("");
                setCategory("GENERAL");
                setContent("");
                setRating(0);
              }}
            >
              Gui gop y khac
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-secondary placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

  return (
    <div className="mx-auto max-w-container px-6 py-8 lg:px-20">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Trang chu
      </Link>

      <div className="mx-auto mt-8 max-w-2xl">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-secondary">Gop y & Phan hoi</h1>
            <p className="text-sm text-slate-500">
              Giup chung toi cai thien trai nghiem cua ban
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-5">
          {/* Contact info */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-secondary">Thong tin cua ban</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Ho va ten <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nguyen Van A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  So dien thoai
                </label>
                <input
                  type="tel"
                  placeholder="0901 234 567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Feedback content */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-secondary">Noi dung gop y</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Danh muc
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={inputClass}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Noi dung <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Mo ta chi tiet gop y cua ban..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  className={cn(inputClass, "resize-none")}
                />
              </div>

              {/* Star rating */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Danh gia trai nghiem
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="cursor-pointer p-0.5 transition-transform hover:scale-110"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                    >
                      <Star
                        className={cn(
                          "h-7 w-7 transition-colors",
                          (hoverRating || rating) >= star
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-slate-300"
                        )}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 self-center text-sm text-slate-500">
                      {rating}/5
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Button
            className="w-full bg-primary py-6 text-base font-bold text-white hover:bg-primary/90 disabled:opacity-50"
            disabled={isSubmitting || !name || !email || !content}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Dang gui...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Gui gop y
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
