import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sun,
  Moon,
  LayoutGrid,
  AlignJustify,
  AlignRight,
  AArrowDown,
  AArrowUp,
} from "lucide-react";

interface AppHeaderProps {
  selectedSurah: any;
  ayahSearch: string;
  setAyahSearch: (v: string) => void;
  viewMode: "cards" | "continuous" | "lines";
  setViewMode: (v: "cards" | "continuous" | "lines") => void;
  fontSize: number[];
  setFontSize: (fn: (prev: number[]) => number[]) => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}

export function AppHeader({
  selectedSurah,
  ayahSearch,
  setAyahSearch,
  viewMode,
  setViewMode,
  fontSize,
  setFontSize,
  darkMode,
  setDarkMode,
}: AppHeaderProps) {
  if (!selectedSurah) return null;
  return (
    <div className="border-b bg-gradient-to-r from-[#e0e7ef] to-[#f5f7fa] dark:from-blue-900 dark:to-[#1e293b] p-4 shadow-md relative z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h2 className="text-2xl md:text-3xl font-quran font-extrabold flex items-center gap-2 align-middle text-blue-500 drop-shadow-sm tracking-wide">
              <span className="text-base md:text-lg text-blue-500 font-serif font-normal">
                (#{selectedSurah.number})
              </span>
              <span className="font-quranic border-b-4 border-blue-500 pb-1">
                {selectedSurah.name}
              </span>
            </h2>
            <p className="text-xs md:text-sm text-blue-500 font-serif mt-1">
              {selectedSurah.englishName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Ayah search input */}
          <Input
            placeholder="Search ayahs..."
            value={ayahSearch}
            onChange={(e) => setAyahSearch(e.target.value)}
            className="w-40 md:w-56 bg-white/80 border-blue-500 focus:border-[#1e293b] rounded shadow"
          />
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("cards")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "continuous" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("continuous")}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "lines" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("lines")}
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
          {/* Font size controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              aria-label="Decrease font size"
              onClick={() => setFontSize((prev) => [Math.max(12, prev[0] - 2)])}
              disabled={fontSize[0] <= 12}
            >
              <AArrowDown className="text-lg font-bold" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Increase font size"
              onClick={() => setFontSize((prev) => [Math.min(32, prev[0] + 2)])}
              disabled={fontSize[0] >= 32}
            >
              <AArrowUp className="text-lg font-bold" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
