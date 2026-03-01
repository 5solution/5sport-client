import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface AthleteRowProps {
  rank: number;
  name: string;
  avatar: string;
  sport: string;
  rating: number;
}

export function AthleteRow({
  rank,
  name,
  avatar,
  sport,
  rating,
}: AthleteRowProps) {
  const isTop3 = rank <= 3;

  return (
    <div className="flex cursor-pointer items-center gap-4 rounded-xl px-4 py-3 transition-colors duration-200 hover:bg-slate-50">
      {/* Rank */}
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${isTop3
          ? "bg-primary text-white"
          : "bg-slate-100 text-slate-500"
          }`}
      >
        {rank}
      </span>

      {/* Avatar */}
      <Avatar className="h-10 w-10 ring-2 ring-slate-100">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-sm font-bold text-primary">
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </AvatarFallback>
      </Avatar>

  /* Info */
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-secondary">
          {name}
        </p>
        <p className="text-xs text-slate-500">{sport}</p>
      </div>

      /* Rating */
      <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1">
        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
        <span className="text-sm font-bold text-amber-700">{rating}</span>
      </div>
    </div>
  );
}
