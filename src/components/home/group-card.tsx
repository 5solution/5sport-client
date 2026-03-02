import { useTranslations } from "next-intl";
import { Users } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface GroupCardProps {
  name: string;
  image: string;
  members: number;
}

export function GroupCard({ name, image, members }: GroupCardProps) {
  const t = useTranslations("groups");

  return (
    <div className="min-w-[260px] flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-secondary">{name}</h3>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          <Users className="h-3.5 w-3.5" />
          <span>
            {members} {t("members")}
          </span>
        </div>
        <Button
          size="sm"
          className="mt-3 w-full bg-primary text-xs font-bold text-white shadow-sm shadow-primary/20 transition-all duration-200 hover:bg-primary/90 hover:shadow-md hover:shadow-primary/30"
        >
          {t("join")}
        </Button>
      </div>
    </div>
  );
}
