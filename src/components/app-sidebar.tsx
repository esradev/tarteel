"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Search } from "lucide-react";

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface AppSidebarProps {
  surahs: Surah[];
  selectedSurah: Surah | null;
  onSurahSelect: (surah: Surah) => void;
}

export function AppSidebar({
  surahs,
  selectedSurah,
  onSurahSelect,
}: AppSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Utility to normalize Arabic text for search (remove diacritics, normalize alef, etc.)
  function normalizeArabic(text: string) {
    return text
      .replace(/[\u064B-\u065F\u0670]/g, "") // Remove Arabic diacritics
      .replace(/[إأآا]/g, "ا") // Normalize alef variants to bare alef
      .replace(/ى/g, "ي") // Normalize alef maqsura to ya
      .replace(/ة/g, "ه") // Normalize ta marbuta to ha
      .replace(/ؤ/g, "و") // Normalize waw-hamza to waw
      .replace(/ئ/g, "ي") // Normalize ya-hamza to ya
      .replace(/-/g, "") // Remove dashes
      .replace(/\s/g, "") // Remove spaces
      .toLowerCase();
  }

  // Filter surahs by search
  const normalizedQuery = normalizeArabic(searchQuery);
  const filteredSurahs = surahs.filter(
    (surah) =>
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      normalizeArabic(surah.name).includes(normalizedQuery) ||
      surah.englishNameTranslation
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-2">
          <h1 className="text-xl font-bold mb-4">Quran Reader</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search surahs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="flex-1">
          <SidebarMenu className="space-y-2 px-2">
            {filteredSurahs.map((surah) => (
              <SidebarMenuItem key={surah.number}>
                <SidebarMenuButton
                  onClick={() => onSurahSelect(surah)}
                  isActive={selectedSurah?.number === surah.number}
                  className="h-auto p-0"
                >
                  <Card
                    className={
                      `w-full border-0 shadow-none hover:bg-muted hover:text-foreground cursor-pointer` +
                      (selectedSurah?.number === surah.number
                        ? " bg-blue-100 text-blue-900 hover:bg-blue-100 hover:text-blue-900"
                        : "")
                    }
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {surah.number}
                            </Badge>
                            <h3 className="font-semibold text-sm">
                              {surah.englishName}
                            </h3>
                          </div>
                          <p className="text-lg font-arabic text-right">
                            {surah.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {surah.englishNameTranslation}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-xs text-muted-foreground">
                            {surah.numberOfAyahs} ayahs
                          </p>
                          <Badge
                            variant={
                              surah.revelationType === "Meccan"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {surah.revelationType}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}
