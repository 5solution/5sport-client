"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, MapPin, Calendar, Trophy, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SPORT_TABS = [
  { value: "all", label: "Tất cả" },
  { value: "pickleball", label: "Pickleball" },
  { value: "table-tennis", label: "Bóng bàn" },
  { value: "basketball", label: "Bóng rổ" },
];

export function ProfileHero() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");

  const displayName = user?.displayName ?? user?.email ?? "Vận động viên";
  const avatar = user?.avatarUrl;
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative">
      {/* Cover Banner */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-blue-800 md:h-64">
        {/* Geometric accent */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 left-1/3 h-48 w-48 rounded-full bg-accent/10" />
        <div className="absolute right-1/4 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-white/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(236,248,110,0.15)_0%,transparent_60%)]" />

        {/* Edit cover button */}
        <button className="absolute right-4 top-4 flex cursor-pointer items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:text-white">
          <Pencil className="h-3 w-3" />
          Đổi ảnh bìa
        </button>
      </div>

      {/* Profile Info Container */}
      <div className="bg-white">
        <div className="mx-auto max-w-container px-6 lg:px-20">
          {/* Avatar row — fully below cover */}
          <div className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: Avatar + Info */}
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative shrink-0">
                <Avatar className="h-20 w-20 border-4 border-white shadow-lg md:h-24 md:w-24">
                  <AvatarImage src={avatar} alt={displayName} />
                  <AvatarFallback className="bg-primary text-2xl font-extrabold text-white md:text-3xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {/* Online indicator */}
                <span className="absolute bottom-1.5 right-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
              </div>

              {/* Name + Meta */}
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold tracking-tight text-secondary md:text-2xl">
                    {displayName}
                  </h1>
                  <Badge className="border-0 bg-accent px-2 py-0.5 text-xs font-bold text-secondary">
                    Pro
                  </Badge>
                </div>
                <p className="mt-0.5 text-sm text-slate-500">
                  Đam mê thể thao · Pickleball lover ❤️
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    TP. Hồ Chí Minh
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Tham gia từ 2023
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    128 followers
                  </span>
                  <span className="flex items-center gap-1">
                    <Trophy className="h-3.5 w-3.5 text-amber-400" />
                    Top 10 Pickleball HCM
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer gap-1.5 border-slate-200 text-slate-600 hover:border-primary hover:text-primary"
              >
                <Users className="h-3.5 w-3.5" />
                Follow
              </Button>
              <Button
                size="sm"
                className="cursor-pointer gap-1.5 bg-primary text-sm font-semibold text-white hover:bg-primary/90"
              >
                <Pencil className="h-3.5 w-3.5" />
                Chỉnh sửa hồ sơ
              </Button>
            </div>
          </div>

          {/* Sport Tabs (play what) */}
          <div className="mt-5 border-b border-slate-200">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="h-auto gap-0 bg-transparent p-0">
                {SPORT_TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="cursor-pointer rounded-none border-b-2 border-transparent px-5 py-3 text-sm font-medium text-slate-500 transition-all duration-200 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
