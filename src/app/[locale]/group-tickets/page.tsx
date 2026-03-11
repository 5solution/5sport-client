"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useCampaignControllerFindPublic } from "@/lib/services/campaigns/campaigns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ArrowRight, Ticket } from "lucide-react";

export default function GroupTicketsPage() {
  const t = useTranslations("groupTickets");
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading } = useCampaignControllerFindPublic({
    page,
    limit,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const campaigns: any[] = (data as any)?.data ?? (data as any) ?? [];
  const hasMore = campaigns.length >= limit;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="mx-auto max-w-container px-6 py-12 lg:px-20">
      {/* Page Header */}
      <div className="mb-10">
        <div className="mb-2 flex items-center gap-2">
          <Ticket className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            {t("title")}
          </h1>
        </div>
        <p className="text-base text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="mb-2 h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && campaigns.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <Ticket className="mb-4 h-16 w-16 text-muted-foreground/40" />
          <h3 className="mb-2 text-lg font-semibold text-foreground">
            {t("noCampaigns")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("noCampaignsDesc")}
          </p>
        </div>
      )}

      {/* Campaign Grid */}
      {!isLoading && campaigns.length > 0 && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <Link
                key={campaign.id}
                href={`/group-tickets/${campaign.slug}`}
              >
                <Card className="group cursor-pointer overflow-hidden border-slate-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                  {campaign.bannerUrl ? (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={campaign.bannerUrl}
                        alt={campaign.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                      <Ticket className="h-12 w-12 text-primary/40" />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-2 text-lg font-bold text-foreground transition-colors duration-200 group-hover:text-primary">
                      {campaign.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    {campaign.description && (
                      <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                        {campaign.description}
                      </p>
                    )}
                    {(campaign.startTime || campaign.endTime) && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {campaign.startTime && formatDate(campaign.startTime)}
                          {campaign.startTime && campaign.endTime && " - "}
                          {campaign.endTime && formatDate(campaign.endTime)}
                        </span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <span className="flex items-center gap-1 text-sm font-semibold text-primary transition-colors duration-200 group-hover:text-primary/80">
                      {t("viewDetail")}
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="mt-10 flex justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setPage((p) => p + 1)}
                className="cursor-pointer"
              >
                {t("loadMore")}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
