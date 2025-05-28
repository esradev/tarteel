"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface QuranSidebarProps {
  surahs: Surah[];
  selectedSurah: Surah | null;
  onSurahSelect: (surah: Surah) => void;
}

export function QuranSidebar({
  surahs,
  selectedSurah,
  onSurahSelect,
}: QuranSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  function normalizeArabic(text: string) {
    return text
      .replace(/[\u064B-\u065F\u0670]/g, "")
      .replace(/[إأآا]/g, "ا")
      .replace(/ى/g, "ي")
      .replace(/ة/g, "ه")
      .replace(/ؤ/g, "و")
      .replace(/ئ/g, "ي")
      .replace(/-/g, "")
      .replace(/\s/g, "")
      .toLowerCase();
  }

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
    <Card className="h-full flex flex-col w-68">
      <div className="p-4 border-b">
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
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {filteredSurahs.map((surah) => (
            <Card
              key={surah.number}
              onClick={() => onSurahSelect(surah)}
              className={
                `cursor-pointer border-0 shadow-none hover:bg-muted hover:text-foreground` +
                (selectedSurah?.number === surah.number
                  ? " cursor-default bg-blue-100 text-blue-900 hover:bg-blue-100 dark:bg-blue-900/80 dark:text-blue-100"
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
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
