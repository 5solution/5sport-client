"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useCampaignControllerFindBySlug } from "@/lib/services/campaigns/campaigns";
import { useCampaignOrderControllerCreate } from "@/lib/services/campaign-orders/campaign-orders";
import { useProvinceControllerListProvinces } from "@/lib/services/provinces/provinces";
import { AXIOS_INSTANCE } from "@/lib/api/axiosInstance";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  Ticket,
  Plus,
  Trash2,
  Loader2,
  ChevronDown,
  Receipt,
  Users,
  UserCheck,
  Phone,
  MessageCircle,
  FileText,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import type { AthleteInfoDto } from "@/lib/schemas/athleteInfoDto";

const BLOOD_TYPES = ["A", "B", "AB", "O"] as const;

// TODO: replace with campaign.regulations when API is ready
const MOCK_REGULATIONS = ``.trim();

const COUNTRIES = [
  { code: "VN", name: "Việt Nam", flag: "🇻🇳" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
] as const;

interface AthleteForm {
  lastName: string;
  firstName: string;
  phoneNumber: string;
  email: string;
  identityCard: string;
  gender: string;
  location: string;
  national: string;
  provinceCode: string;
  dateOfBirth: string;
  sizeShirt: string;
  club: string;
  nameInBib: string;
  medicalInformationPhoneNumber: string;
  medicalInformationName: string;
  medicalInformation: string;
  typeOfMedicine: string;
  bloodType: string;
  distance: string;
  guardianFullName: string;
  guardianDateOfBirth: string;
  guardianIdentityCard: string;
  guardianEmail: string;
  guardianPhoneNumber: string;
  guardianRelationship: string;
}

const emptyAthlete: AthleteForm = {
  lastName: "",
  firstName: "",
  phoneNumber: "",
  email: "",
  identityCard: "",
  gender: "",
  location: "",
  national: "VN",
  provinceCode: "",
  dateOfBirth: "",
  sizeShirt: "",
  club: "",
  nameInBib: "",
  medicalInformationPhoneNumber: "",
  medicalInformationName: "",
  medicalInformation: "",
  typeOfMedicine: "",
  bloodType: "",
  distance: "",
  guardianFullName: "",
  guardianDateOfBirth: "",
  guardianIdentityCard: "",
  guardianEmail: "",
  guardianPhoneNumber: "",
  guardianRelationship: "",
};

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-colors duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20";

const selectClass =
  "w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 pr-8 text-sm outline-none transition-colors duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20";

const labelClass = "mb-1 block text-xs font-medium text-muted-foreground";

const noteClass = "mt-1 text-xs italic text-muted-foreground/80";

export default function CampaignDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const t = useTranslations("groupTickets");

  // API hooks
  const { data: campaignData, isLoading: campaignLoading } =
    useCampaignControllerFindBySlug(slug);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const campaign: any = (campaignData as any)?.data ?? (campaignData as any);

  console.log(campaign);

  // Distances from campaign response (ticket types)
  const distances: { distance: string; price: number }[] =
    campaign?.distances ?? [];

  const { data: provincesData } = useProvinceControllerListProvinces();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const provinces: any[] =
    (provincesData as any)?.data ?? (provincesData as any) ?? [];

  const createOrder = useCampaignOrderControllerCreate();
  const isUnder18 = (dateOfBirth: string) => {
    if (!dateOfBirth) return false;
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age < 18;
  };

  // Form state
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [athletes, setAthletes] = useState<AthleteForm[]>([
    { ...emptyAthlete },
  ]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRegulations, setShowRegulations] = useState(false);

  const addAthlete = () => {
    setAthletes((prev) => [...prev, { ...emptyAthlete }]);
  };

  const removeAthlete = (index: number) => {
    if (athletes.length > 1) {
      setAthletes((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateAthlete = (
    index: number,
    field: keyof AthleteForm,
    value: string
  ) => {
    setAthletes((prev) =>
      prev.map((a, i) => (i === index ? { ...a, [field]: value } : a))
    );
  };

  // sizeShirtOptions from API
  const sizeShirtOptions: string[] = campaign?.sizeShirtOptions ?? [];

  const isFormValid =
    lastName.trim() &&
    firstName.trim() &&
    phoneNumber.trim() &&
    email.trim() &&
    email.includes("@") &&
    athletes.every((a) => {
      const isAUnder18 = isUnder18(a.dateOfBirth);
      const baseValid =
        a.distance &&
        a.lastName.trim() &&
        a.firstName.trim() &&
        a.phoneNumber.trim() &&
        a.email.trim() &&
        a.email.includes("@") &&
        a.identityCard.trim() &&
        a.dateOfBirth.trim() &&
        a.gender &&
        a.sizeShirt &&
        a.national &&
        a.medicalInformationName.trim() &&
        a.medicalInformationPhoneNumber.trim();

      if (!baseValid) return false;

      if (isAUnder18) {
        return (
          a.guardianFullName.trim() &&
          a.guardianDateOfBirth.trim() &&
          a.guardianIdentityCard.trim() &&
          a.guardianEmail.trim() &&
          a.guardianEmail.includes("@") &&
          a.guardianPhoneNumber.trim() &&
          a.guardianRelationship.trim()
        );
      }

      return true;
    });

  const handleClickSubmit = () => {
    if (!isFormValid) return;
    setShowConfirmModal(true);
  };

  const handleConfirmOrder = async () => {
    if (!isFormValid || !campaign?.id) return;

    // Step 1: Create order → get orderCode
    let orderCode: string;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = (await createOrder.mutateAsync({
        campaignId: campaign.id,
        data: {
          lastName,
          firstName,
          email,
          phoneNumber,
          athletes: athletes.map(
            (a): AthleteInfoDto => ({
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              distance: a.distance as any,
              lastName: a.lastName,
              firstName: a.firstName,
              phoneNumber: a.phoneNumber,
              email: a.email,
              identityCard: a.identityCard,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              gender: a.gender as any,
              location: a.location,
              national: a.national,
              provinceCode: a.provinceCode,
              dateOfBirth: a.dateOfBirth,
              sizeShirt:
                (a.sizeShirt as AthleteInfoDto["sizeShirt"]) || undefined,
              club: a.club || undefined,
              nameInBib: a.nameInBib,
              medicalInformationPhoneNumber:
                a.medicalInformationPhoneNumber || undefined,
              medicalInformationName:
                a.medicalInformationName || undefined,
              medicalInformation: a.medicalInformation || undefined,
              typeOfMedicine: a.typeOfMedicine || undefined,
              bloodType: a.bloodType || undefined,
              guardian: isUnder18(a.dateOfBirth)
                ? {
                  fullName: a.guardianFullName,
                  dateOfBirth: a.guardianDateOfBirth,
                  identityCard: a.guardianIdentityCard,
                  email: a.guardianEmail,
                  phoneNumber: a.guardianPhoneNumber,
                  relationship: a.guardianRelationship,
                }
                : undefined,
            })
          ),
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      })) as any;

      orderCode = res?.orderCode;
      if (!orderCode) throw new Error("Missing orderCode in response");
    } catch {
      setShowConfirmModal(false);
      toast.error(t("orderError"));
      return;
    }

    // Step 2: Init SePay payment → get checkoutUrl + formFields
    try {
      const sepayRes = await AXIOS_INSTANCE.post<{
        checkoutUrl: string;
        formFields?: Record<string, string>;
      }>(
        `/campaigns/${campaign.id}/orders/${orderCode}/sepay/init`,
        { paymentMethod: "BANK_TRANSFER" }
      );

      const { checkoutUrl, formFields } = sepayRes.data;

      // Step 3: Redirect via hidden form POST
      const form = document.createElement("form");
      form.method = "POST";
      form.action = checkoutUrl;
      form.style.display = "none";
      if (formFields) {
        Object.entries(formFields).forEach(([name, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = name;
          input.value = value;
          form.appendChild(input);
        });
      }
      document.body.appendChild(form);
      form.submit();
    } catch {
      toast.error(t("orderError"));
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    if (price === 0) return t("free");
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Loading state
  if (campaignLoading) {
    return (
      <div className="mx-auto max-w-container px-6 py-12 lg:px-20">
        <Skeleton className="mb-4 h-8 w-48" />
        <Skeleton className="mb-8 h-64 w-full rounded-xl" />
        <Skeleton className="mb-4 h-6 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  // Not found
  if (!campaign) {
    return (
      <div className="mx-auto max-w-container px-6 py-12 lg:px-20">
        <div className="flex flex-col items-center justify-center py-20">
          <Ticket className="mb-4 h-16 w-16 text-muted-foreground/40" />
          <h3 className="mb-4 text-lg font-semibold">{t("noCampaigns")}</h3>
          <Link href="/group-tickets">
            <Button variant="outline" className="cursor-pointer gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t("backToList")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-container px-6 py-12 lg:px-20">
      {/* Back Link */}
      <Link
        href="/group-tickets"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("backToList")}
      </Link>

      {/* Campaign Info */}
      <div className="mb-10">
        {campaign.bannerUrl && (
          <div className="mb-6 overflow-hidden rounded-xl">
            <img
              src={campaign.bannerUrl}
              alt={campaign.name}
              className="h-auto w-full object-cover"
            />
          </div>
        )}

        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-foreground">
          {campaign.name}
        </h1>

        {(campaign.startTime || campaign.endTime) && (
          <div className="mb-4 flex flex-wrap items-center gap-4">
            {campaign.startTime && (
              <Badge
                variant="secondary"
                className="gap-1.5 px-3 py-1.5 text-sm"
              >
                <Calendar className="h-3.5 w-3.5" />
                {t("startTime")}: {formatDate(campaign.startTime)}
              </Badge>
            )}
            {campaign.endTime && (
              <Badge
                variant="secondary"
                className="gap-1.5 px-3 py-1.5 text-sm"
              >
                <Calendar className="h-3.5 w-3.5" />
                {t("endTime")}: {formatDate(campaign.endTime)}
              </Badge>
            )}
          </div>
        )}

        {campaign.description && (
          <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground">
            {campaign.description}
          </p>
        )}

        {/* Thể lệ */}
        {campaign.regulations && <Card className="mt-6 border-slate-200">
          <CardHeader className={showRegulations ? "pb-3" : ""}>
            <button
              type="button"
              onClick={() => setShowRegulations((prev) => !prev)}
              className="flex w-full cursor-pointer items-center justify-between"
            >
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                {t("regulations")}
              </CardTitle>
              <ChevronDown
                className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${showRegulations ? "rotate-180" : ""}`}
              />
            </button>
          </CardHeader>
          {showRegulations && (
            <CardContent className="pt-0">
              <div className="prose prose-base max-w-none text-foreground prose-headings:font-bold prose-headings:text-foreground prose-h1:mt-8 prose-h1:mb-4 prose-h1:text-xl prose-h1:border-b prose-h1:border-slate-300 prose-h1:pb-2 prose-h2:mt-6 prose-h2:mb-3 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-2 prose-h2:text-lg prose-h3:text-base prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-table:text-sm prose-th:border prose-th:border-slate-200 prose-th:bg-muted prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-th:text-foreground prose-td:border prose-td:border-slate-200 prose-td:px-3 prose-td:py-2 prose-td:text-muted-foreground prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-1 prose-blockquote:text-muted-foreground prose-a:text-primary">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{campaign.regulations ?? MOCK_REGULATIONS}</ReactMarkdown>
              </div>
            </CardContent>
          )}
        </Card>}

        {/* Campaign Group Info */}
        {(campaign.groupName || campaign.groupLeader || campaign.hotline || campaign.zaloGroupUrl || campaign.regulationsUrl || campaign.fanpageUrl) && (
          <Card className="mt-6 border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" />
                {t("campaignInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {campaign.groupName && (
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t("groupName")}</p>
                      <p className="text-sm font-medium text-foreground">{campaign.groupName}</p>
                    </div>
                  </div>
                )}
                {campaign.groupLeader && (
                  <div className="flex items-center gap-3">
                    <UserCheck className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t("groupLeader")}</p>
                      <p className="text-sm font-medium text-foreground">{campaign.groupLeader}</p>
                    </div>
                  </div>
                )}
                {campaign.hotline && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t("hotline")}</p>
                      <a href={`tel:${campaign.hotline}`} className="text-sm font-medium text-primary hover:underline">
                        {campaign.hotline}
                      </a>
                    </div>
                  </div>
                )}
                {campaign.zaloGroupUrl && (
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t("zaloGroup")}</p>
                      <a href={campaign.zaloGroupUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                        {t("joinZalo")} <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}
                {campaign.regulationsUrl && (
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t("regulations")}</p>
                      <a href={campaign.regulationsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                        {t("viewRegulations")} <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}
                {campaign.fanpageUrl && (
                  <div className="flex items-center gap-3">
                    <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t("fanpage")}</p>
                      <a href={campaign.fanpageUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                        {t("visitFanpage")} <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Order Form */}
      <form
        onSubmit={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
      >
        {/* Contact Info */}
        <Card className="mb-8 border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">{t("contactInfo")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>{t("lastName")} <span className="text-red-500">*</span> </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>{t("firstName")} <span className="text-red-500">*</span> </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>{t("email")} <span className="text-red-500">*</span> </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>{t("phoneNumber")} <span className="text-red-500">*</span> </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Athletes */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
              <Ticket className="h-5 w-5 text-primary" />
              {t("runnerInfo")}
            </h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAthlete}
              className="cursor-pointer gap-1.5"
            >
              <Plus className="h-4 w-4" />
              {t("addRunner")}
            </Button>
          </div>

          <div className="space-y-6">
            {athletes.map((athlete, index) => (
              <Card key={index} className="border-slate-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {t("runner")} {index + 1}
                    </CardTitle>
                    {athletes.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAthlete(index)}
                        className="cursor-pointer gap-1 text-red-500 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        {t("removeRunner")}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Distance selection */}
                    <div className="relative sm:col-span-2 lg:col-span-3">
                      <label className={labelClass}>
                        {t("runnerDistance")} <span className="text-red-500">*</span>
                      </label>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {distances.map((item) => (
                          <button
                            key={item.distance}
                            type="button"
                            onClick={() =>
                              updateAthlete(index, "distance", item.distance)
                            }
                            className={`w-full cursor-pointer rounded-lg border px-3 py-2 text-left text-sm transition-all duration-200 ${athlete.distance === item.distance
                              ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                              : "border-slate-200 hover:border-primary/40 hover:bg-slate-50"
                              }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-foreground">
                                {item.distance}
                              </span>
                              <span className="font-bold text-primary">
                                {formatPrice(item.price)}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Thông tin vận động viên */}
                    <div className="sm:col-span-2 lg:col-span-3">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Thông tin vận động viên
                      </p>
                    </div>

                    {/* Name fields */}
                    <div>
                      <label className={labelClass}>
                        {t("runnerLastName")} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={athlete.lastName}
                        onChange={(e) =>
                          updateAthlete(index, "lastName", e.target.value)
                        }
                        className={inputClass}
                        placeholder="Nguyễn Văn"
                        required
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        {t("runnerFirstName")} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={athlete.firstName}
                        onChange={(e) =>
                          updateAthlete(index, "firstName", e.target.value)
                        }
                        className={inputClass}
                        placeholder="An"
                        required
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className={labelClass}>
                        {t("runnerPhone")} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={athlete.phoneNumber}
                        onChange={(e) =>
                          updateAthlete(index, "phoneNumber", e.target.value)
                        }
                        className={inputClass}
                        placeholder="0901234567"
                        required
                      />
                      <p className={noteClass}>Vui lòng nhập đúng số điện thoại để nhận thông báo từ BTC</p>
                    </div>

                    {/* Email */}
                    <div>
                      <label className={labelClass}>
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={athlete.email}
                        onChange={(e) =>
                          updateAthlete(index, "email", e.target.value)
                        }
                        className={inputClass}
                        placeholder="example@email.com"
                        required
                      />
                      <p className={noteClass}>Vé sẽ được chuyển về tài khoản ứng với email</p>
                    </div>

                    {/* Identity Card */}
                    <div>
                      <label className={labelClass}>
                        CCCD / Hộ chiếu <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={athlete.identityCard}
                        onChange={(e) =>
                          updateAthlete(index, "identityCard", e.target.value)
                        }
                        className={inputClass}
                        placeholder="021234567890"
                        required
                      />
                      <p className={noteClass}>Trường hợp vận động viên chưa có CCCD có thể điền CCCD của người giám hộ hoặc giấy khai sinh</p>
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className={labelClass}>
                        {t("runnerDateOfBirth")} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={athlete.dateOfBirth}
                        onChange={(e) =>
                          updateAthlete(index, "dateOfBirth", e.target.value)
                        }
                        className={inputClass}
                        required
                      />
                    </div>

                    {/* Gender */}
                    <div className="relative">
                      <label className={labelClass}>
                        Giới tính <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={athlete.gender}
                        onChange={(e) =>
                          updateAthlete(index, "gender", e.target.value)
                        }
                        className={selectClass}
                        required
                      >
                        <option value="">-- Chọn giới tính --</option>
                        <option value="MALE">Nam</option>
                        <option value="FEMALE">Nữ</option>
                        <option value="OTHER">Khác</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-[30px] h-4 w-4 text-muted-foreground" />
                    </div>

                    {/* National - dropdown with flags */}
                    <div className="relative">
                      <label className={labelClass}>
                        {t("runnerNational")} <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={athlete.national}
                        onChange={(e) =>
                          updateAthlete(index, "national", e.target.value)
                        }
                        className={selectClass}
                        required
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-[30px] h-4 w-4 text-muted-foreground" />
                    </div>

                    {/* Size Shirt - from campaign sizeShirtOptions */}
                    <div className="relative">
                      <label className={labelClass}>
                        {t("runnerSizeShirt")} <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={athlete.sizeShirt}
                        onChange={(e) =>
                          updateAthlete(index, "sizeShirt", e.target.value)
                        }
                        className={selectClass}
                        required
                      >
                        <option value="">{t("runnerSelectSize")}</option>
                        {sizeShirtOptions.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-[30px] h-4 w-4 text-muted-foreground" />
                    </div>

                    {/* Province */}
                    <div className="relative">
                      <label className={labelClass}>
                        {t("runnerProvince")}
                      </label>
                      <select
                        value={athlete.provinceCode}
                        onChange={(e) =>
                          updateAthlete(index, "provinceCode", e.target.value)
                        }
                        className={selectClass}
                      >
                        <option value="">{t("runnerSelectProvince")}</option>
                        {provinces.map((p) => (
                          <option key={p.code} value={String(p.code)}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-[30px] h-4 w-4 text-muted-foreground" />
                    </div>

                    {/* Location */}
                    <div>
                      <label className={labelClass}>
                        {t("runnerLocation")}
                      </label>
                      <input
                        type="text"
                        value={athlete.location}
                        onChange={(e) =>
                          updateAthlete(index, "location", e.target.value)
                        }
                        className={inputClass}
                        placeholder="123 Nguyễn Huệ, Quận 1, TP.HCM"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>{t("runnerClub")}</label>
                      <input
                        type="text"
                        value={athlete.club}
                        onChange={(e) =>
                          updateAthlete(index, "club", e.target.value)
                        }
                        className={inputClass}
                        placeholder="5Sport Runner"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        {t("runnerNameInBib")}
                      </label>
                      <input
                        type="text"
                        value={athlete.nameInBib}
                        onChange={(e) =>
                          updateAthlete(index, "nameInBib", e.target.value)
                        }
                        className={inputClass}
                        placeholder="Nguyen Van A"
                      />
                    </div>
                    <div className="relative">
                      <label className={labelClass}>
                        {t("runnerBloodType")}
                      </label>
                      <select
                        value={athlete.bloodType}
                        onChange={(e) =>
                          updateAthlete(index, "bloodType", e.target.value)
                        }
                        className={selectClass}
                      >
                        <option value="">
                          {t("runnerSelectBloodType")}
                        </option>
                        {BLOOD_TYPES.map((bt) => (
                          <option key={bt} value={bt}>
                            {bt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-[30px] h-4 w-4 text-muted-foreground" />
                    </div>

                    {/* Guardian Information - only for under 18 */}
                    {isUnder18(athlete.dateOfBirth) && (
                      <div className="sm:col-span-2 lg:col-span-3">
                        <Separator className="mb-4" />
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {t("guardianInfo")}
                        </p>
                        <p className="mb-4 text-xs italic text-red-500">
                          {t("guardianWarning")}
                        </p>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          <div>
                            <label className={labelClass}>
                              {t("guardianFullName")} <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={athlete.guardianFullName}
                              onChange={(e) =>
                                updateAthlete(index, "guardianFullName", e.target.value)
                              }
                              className={inputClass}
                              required
                            />
                          </div>
                          <div>
                            <label className={labelClass}>
                              {t("guardianDateOfBirth")} <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              value={athlete.guardianDateOfBirth}
                              onChange={(e) =>
                                updateAthlete(index, "guardianDateOfBirth", e.target.value)
                              }
                              className={inputClass}
                              required
                            />
                          </div>
                          <div>
                            <label className={labelClass}>
                              {t("guardianIdentityCard")} <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={athlete.guardianIdentityCard}
                              onChange={(e) =>
                                updateAthlete(index, "guardianIdentityCard", e.target.value)
                              }
                              className={inputClass}
                              required
                            />
                          </div>
                          <div>
                            <label className={labelClass}>
                              {t("guardianEmail")} <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              value={athlete.guardianEmail}
                              onChange={(e) =>
                                updateAthlete(index, "guardianEmail", e.target.value)
                              }
                              className={inputClass}
                              required
                            />
                          </div>
                          <div>
                            <label className={labelClass}>
                              {t("guardianPhoneNumber")} <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="tel"
                              value={athlete.guardianPhoneNumber}
                              onChange={(e) =>
                                updateAthlete(index, "guardianPhoneNumber", e.target.value)
                              }
                              className={inputClass}
                              required
                            />
                          </div>
                          <div>
                            <label className={labelClass}>
                              {t("guardianRelationship")} <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={athlete.guardianRelationship}
                              onChange={(e) =>
                                updateAthlete(index, "guardianRelationship", e.target.value)
                              }
                              className={inputClass}
                              placeholder={t("guardianRelationshipPlaceholder")}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Medical section - full width */}
                    <div className="sm:col-span-2 lg:col-span-3">
                      <Separator className="mb-4" />
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {t("runnerMedicalInfo")}
                      </p>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                          <label className={labelClass}>
                            {t("runnerMedicalName")} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={athlete.medicalInformationName}
                            onChange={(e) =>
                              updateAthlete(
                                index,
                                "medicalInformationName",
                                e.target.value
                              )
                            }
                            className={inputClass}
                            required
                          />
                        </div>
                        <div>
                          <label className={labelClass}>
                            {t("runnerMedicalPhone")} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            value={athlete.medicalInformationPhoneNumber}
                            onChange={(e) =>
                              updateAthlete(
                                index,
                                "medicalInformationPhoneNumber",
                                e.target.value
                              )
                            }
                            className={inputClass}
                            required
                          />
                        </div>
                        <div>
                          <label className={labelClass}>
                            {t("runnerTypeOfMedicine")}
                          </label>
                          <input
                            type="text"
                            value={athlete.typeOfMedicine}
                            onChange={(e) =>
                              updateAthlete(
                                index,
                                "typeOfMedicine",
                                e.target.value
                              )
                            }
                            className={inputClass}
                          />
                        </div>
                        <div className="sm:col-span-2 lg:col-span-3">
                          <label className={labelClass}>
                            {t("runnerMedicalInfo")}
                          </label>
                          <textarea
                            value={athlete.medicalInformation}
                            onChange={(e) =>
                              updateAthlete(
                                index,
                                "medicalInformation",
                                e.target.value
                              )
                            }
                            rows={2}
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        {(() => {
          const totalAmount = athletes.reduce((sum, a) => {
            const found = distances.find((d) => d.distance === a.distance);
            return sum + (found?.price ?? 0);
          }, 0);

          return (
            <Card className="mb-8 border-slate-200 bg-slate-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Receipt className="h-5 w-5 text-primary" />
                  {t("orderSummary")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {athletes.map((a, i) => {
                    const found = distances.find(
                      (d) => d.distance === a.distance
                    );
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-muted-foreground">
                          {t("runner")} {i + 1}:{" "}
                          {a.distance || t("notSelected")}
                        </span>
                        <span className="font-medium text-foreground">
                          {found ? formatPrice(found.price) : "—"}
                        </span>
                      </div>
                    );
                  })}
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-foreground">
                      {t("summaryTotal")}
                    </span>
                    <span className="text-xl font-extrabold text-primary">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })()}

        {/* Submit */}
        <div className="flex justify-end">
          <Button
            type="button"
            size="lg"
            disabled={!isFormValid}
            onClick={handleClickSubmit}
            className="min-w-[200px] cursor-pointer bg-primary text-white transition-all duration-200 hover:bg-primary/90 disabled:cursor-not-allowed"
          >
            {t("submitOrder")}
          </Button>
        </div>
      </form>

      {/* Confirm Order Modal */}
      {(() => {
        const totalAmount = athletes.reduce((sum, a) => {
          const found = distances.find((d) => d.distance === a.distance);
          return sum + (found?.price ?? 0);
        }, 0);

        return (
          <Dialog
            open={showConfirmModal}
            onOpenChange={(open) => {
              if (!createOrder.isPending) setShowConfirmModal(open);
            }}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-primary" />
                  {t("confirmTitle")}
                </DialogTitle>
              </DialogHeader>

              <p className="text-sm text-muted-foreground">
                {t("confirmDescription")}
              </p>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="space-y-2.5">
                  {athletes.map((a, i) => {
                    const found = distances.find(
                      (d) => d.distance === a.distance
                    );
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-muted-foreground">
                          {t("runner")} {i + 1}: {a.distance}
                        </span>
                        <span className="font-medium text-foreground">
                          {found ? formatPrice(found.price) : "—"}
                        </span>
                      </div>
                    );
                  })}
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">
                      {t("summaryTotal")}
                    </span>
                    <span className="text-lg font-extrabold text-primary">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={createOrder.isPending}
                  className="cursor-pointer"
                >
                  {t("cancelButton")}
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirmOrder}
                  disabled={createOrder.isPending}
                  className="cursor-pointer bg-primary text-white hover:bg-primary/90"
                >
                  {createOrder.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("submitting")}
                    </>
                  ) : (
                    t("confirmButton")
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      })()}
    </div>
  );
}
