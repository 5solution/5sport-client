import type { Metadata } from "next";
import CampaignDetailPage from "./campaign-detail";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const SITE_URL = "https://5sport.vn";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  try {
    const res = await fetch(`${BASE_URL}/campaigns/public/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return {};

    const json = await res.json();
    const campaign = json?.data ?? json;

    const title = `${campaign.name} - Đăng ký tham gia ngay trên 5Sport`;
    const startDate = campaign.startTime
      ? new Date(campaign.startTime).toLocaleDateString("vi-VN")
      : "";
    const endDate = campaign.endTime
      ? new Date(campaign.endTime).toLocaleDateString("vi-VN")
      : "";
    const description = `Thời gian: ${startDate} - ${endDate}${campaign.description ? ` | ${campaign.description}` : ""} | Đăng ký trực tuyến, cập nhật kết quả realtime tại 5Sport.`;

    const ogImage = campaign.bannerUrl || "/og-image.png";
    const url = `${SITE_URL}/${locale}/group-tickets/${slug}`;

    return {
      title,
      description,
      openGraph: {
        type: "website",
        url,
        title,
        description,
        siteName: "5Sport",
        locale: locale === "vi" ? "vi_VN" : "en_US",
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: campaign.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
      },
      alternates: {
        canonical: url,
        languages: {
          vi: `${SITE_URL}/vi/group-tickets/${slug}`,
          en: `${SITE_URL}/en/group-tickets/${slug}`,
        },
      },
    };
  } catch {
    return {};
  }
}

export default function Page() {
  return <CampaignDetailPage />;
}
