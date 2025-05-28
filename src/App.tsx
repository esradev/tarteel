import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  LayoutGrid,
  AlignJustify,
  AlignRight,
  AArrowDown,
  AArrowUp,
} from "lucide-react";
import { AppSidebar } from "./components/app-sidebar";
import { Input } from "@/components/ui/input";

export default function App() {
  const [surahs, setSurahs] = useState<any[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<any | null>(null);
  const [ayahs, setAyahs] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [fontSize, setFontSize] = useState([18]);
  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "continuous" | "lines">(
    "lines"
  );
  const [loadingSurahs, setLoadingSurahs] = useState(false);
  const [loadingAyahs, setLoadingAyahs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const [ayahSearch, setAyahSearch] = useState(""); // <-- new state

  // Fetch surah list on mount
  useEffect(() => {
    setLoadingSurahs(true);
    const cachedSurahs = localStorage.getItem("surahs");
    if (cachedSurahs) {
      try {
        const parsed = JSON.parse(cachedSurahs);
        setSurahs(parsed);
        setSelectedSurah(parsed[0]);
        setOffline(true);
        setLoadingSurahs(false);
        // Try to update in background
        fetch("https://api.alquran.cloud/v1/surah")
          .then((res) => res.json())
          .then((data) => {
            setSurahs(data.data);
            setSelectedSurah(data.data[0]);
            localStorage.setItem("surahs", JSON.stringify(data.data));
            setOffline(false);
          })
          .catch(() => {});
        return;
      } catch {}
    }
    fetch("https://api.alquran.cloud/v1/surah")
      .then((res) => res.json())
      .then((data) => {
        setSurahs(data.data);
        setSelectedSurah(data.data[0]);
        localStorage.setItem("surahs", JSON.stringify(data.data));
        setOffline(false);
      })
      .catch(() => {
        setError("Failed to load surah list");
        setOffline(true);
      })
      .finally(() => setLoadingSurahs(false));
  }, []);

  // Fetch ayahs when selectedSurah changes
  useEffect(() => {
    if (!selectedSurah) return;
    setLoadingAyahs(true);
    setAyahs([]); // Clear ayahs immediately to avoid showing old content
    const ayahCacheKey = `ayahs-${selectedSurah.number}`;
    const cachedAyahs = localStorage.getItem(ayahCacheKey);
    if (cachedAyahs) {
      try {
        setAyahs(JSON.parse(cachedAyahs));
        setOffline(true);
        setLoadingAyahs(false);
        // Try to update in background
        fetch(
          `https://api.alquran.cloud/v1/surah/${selectedSurah.number}/ar.alafasy`
        )
          .then((res) => res.json())
          .then((data) => {
            fetch(
              `https://api.alquran.cloud/v1/surah/${selectedSurah.number}/en.asad`
            )
              .then((res2) => res2.json())
              .then((tr) => {
                const ayahsWithTranslation = data.data.ayahs.map(
                  (a: any, i: number) => ({
                    id: a.numberInSurah,
                    text: a.text,
                    translation: tr.data.ayahs[i]?.text || "",
                  })
                );
                setAyahs(ayahsWithTranslation);
                localStorage.setItem(
                  ayahCacheKey,
                  JSON.stringify(ayahsWithTranslation)
                );
                setOffline(false);
              });
          })
          .catch(() => {});
        return;
      } catch {}
    }
    fetch(
      `https://api.alquran.cloud/v1/surah/${selectedSurah.number}/ar.alafasy`
    )
      .then((res) => res.json())
      .then((data) => {
        // Fetch translation as well
        fetch(
          `https://api.alquran.cloud/v1/surah/${selectedSurah.number}/en.asad`
        )
          .then((res2) => res2.json())
          .then((tr) => {
            // Merge Arabic and translation
            const ayahsWithTranslation = data.data.ayahs.map(
              (a: any, i: number) => ({
                id: a.numberInSurah,
                text: a.text,
                translation: tr.data.ayahs[i]?.text || "",
              })
            );
            setAyahs(ayahsWithTranslation);
            localStorage.setItem(
              ayahCacheKey,
              JSON.stringify(ayahsWithTranslation)
            );
            setOffline(false);
          });
      })
      .catch(() => {
        setError("Failed to load surah");
        setOffline(true);
      })
      .finally(() => setLoadingAyahs(false));
  }, [selectedSurah]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleBookmark = (surahId: number, ayahId: number) => {
    const bookmarkKey = `${surahId}-${ayahId}`;
    setBookmarks((prev) =>
      prev.includes(bookmarkKey)
        ? prev.filter((b) => b !== bookmarkKey)
        : [...prev, bookmarkKey]
    );
  };

  const isBookmarked = (surahId: number, ayahId: number) => {
    return bookmarks.includes(`${surahId}-${ayahId}`);
  };

  // Utility to normalize Arabic text for search (improved for Persian Yeh and Alef Maksura)
  function normalizeArabic(text: string) {
    return text
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "") // Remove Arabic diacritics and Quranic marks
      .replace(/[إأآا]/g, "ا") // Normalize alef variants to bare alef
      .replace(/ى/g, "ي") // Normalize alef maqsura to ya
      .replace(/ة/g, "ه") // Normalize ta marbuta to ha
      .replace(/ؤ/g, "و") // Normalize waw-hamza to waw
      .replace(/ئ/g, "ي") // Normalize ya-hamza to ya
      .replace(/\u0649/g, "ي") // Arabic Alef Maksura to Ya
      .replace(/\u06CC/g, "ي") // Persian Yeh to Arabic Ya
      .replace(/\u064A/g, "ي") // Arabic Yeh to Arabic Ya (for consistency)
      .replace(/-/g, "") // Remove dashes
      .replace(/\s/g, "") // Remove spaces
      .toLowerCase();
  }

  // Filter ayahs by search
  const normalizedAyahSearch = normalizeArabic(ayahSearch);
  const filteredAyahs =
    ayahSearch.trim() === ""
      ? ayahs
      : ayahs.filter(
          (ayah) =>
            normalizeArabic(ayah.text).includes(normalizedAyahSearch) ||
            normalizeArabic(ayah.translation).includes(normalizedAyahSearch) ||
            ayah.translation.toLowerCase().includes(ayahSearch.toLowerCase())
        );

  // Utility to highlight matched text in Arabic or translation
  function highlightMatch(text: string, query: string, isArabic = false) {
    if (!query.trim()) return text;
    // Normalize both text and query for matching
    const norm = (s: string) =>
      s
        .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
        .replace(/[إأآا]/g, "ا")
        .replace(/ى/g, "ي")
        .replace(/ة/g, "ه")
        .replace(/ؤ/g, "و")
        .replace(/ئ/g, "ي")
        .replace(/\u0649/g, "ي")
        .replace(/\u06CC/g, "ي")
        .replace(/\u064A/g, "ي")
        .replace(/-/g, "")
        .replace(/\s/g, "")
        .toLowerCase();

    // Map each character in raw text to its normalized index
    const raw = text;
    const normText = norm(text);
    const normQuery = norm(query);

    // Build a mapping from normalized index to raw index
    let normIdx = 0;
    const normToRaw: number[] = [];
    for (let i = 0; i < raw.length; ++i) {
      const c = norm(raw[i]);
      if (c.length > 0) {
        for (let j = 0; j < c.length; ++j) {
          normToRaw[normIdx++] = i;
        }
      }
    }

    let result: (string | JSX.Element)[] = [];
    let i = 0;
    let lastRawEnd = 0;
    while (i <= normText.length - normQuery.length) {
      if (normText.substr(i, normQuery.length) === normQuery) {
        // Map normalized indices to raw indices
        const rawStart = normToRaw[i];
        const rawEnd =
          i + normQuery.length < normToRaw.length
            ? normToRaw[i + normQuery.length]
            : raw.length;
        if (lastRawEnd < rawStart) result.push(raw.slice(lastRawEnd, rawStart));
        result.push(
          <span
            key={rawStart}
            style={{
              background: "#dbeafe",
              color: isArabic ? "#2563eb" : undefined,
              borderRadius: 4,
              padding: "0 2px",
            }}
          >
            {raw.slice(rawStart, rawEnd)}
          </span>
        );
        lastRawEnd = rawEnd;
        i += normQuery.length;
      } else {
        i++;
      }
    }
    if (lastRawEnd < raw.length) result.push(raw.slice(lastRawEnd));
    return result.length > 1 ? result : raw;
  }

  const CardView = () => (
    <div className="space-y-6">
      {filteredAyahs.map((ayah) => (
        <Card key={ayah.id} className="group">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <Badge variant="outline" className="text-xs">
                  {ayah.id}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => toggleBookmark(selectedSurah.number, ayah.id)}
                >
                  <Bookmark
                    className={`h-4 w-4 ${
                      isBookmarked(selectedSurah.number, ayah.id)
                        ? "fill-current text-yellow-500"
                        : ""
                    }`}
                  />
                </Button>
              </div>
              <div className="text-right">
                <p
                  className="font-arabic leading-loose mb-4"
                  style={{ fontSize: `${fontSize[0]}px` }}
                >
                  {highlightMatch(ayah.text, ayahSearch, true)}
                </p>
              </div>
              <Separator />
              <p className="text-muted-foreground leading-relaxed">
                {highlightMatch(ayah.translation, ayahSearch)}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const LinesView = () => (
    <div className="space-y-8">
      {/* Arabic Text Section */}
      <Card>
        <CardContent className="p-8">
          <div className="text-right space-y-1">
            <div
              className="font-arabic leading-loose"
              style={{ fontSize: `${fontSize[0]}px` }}
            >
              {/* Each ayah on its own line */}
              <div className="flex flex-col gap-4">
                {filteredAyahs.map((ayah) => (
                  <div
                    key={ayah.id}
                    className="group relative flex items-end justify-end"
                  >
                    <span className="hover:bg-accent/20 transition-colors cursor-pointer">
                      {highlightMatch(ayah.text, ayahSearch, true)}
                    </span>
                    <span className="inline-flex items-center justify-center w-6 h-6 text-xs bg-primary text-primary-foreground rounded-full mx-2 font-sans">
                      {ayah.id}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -top-1 -right-1 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() =>
                        toggleBookmark(selectedSurah.number, ayah.id)
                      }
                    >
                      <Bookmark
                        className={`h-3 w-3 ${
                          isBookmarked(selectedSurah.number, ayah.id)
                            ? "fill-current text-yellow-500"
                            : ""
                        }`}
                      />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Translation Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Translation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredAyahs.map((ayah) => (
            <div key={ayah.id} className="flex gap-3">
              <Badge variant="outline" className="text-xs mt-1 flex-shrink-0">
                {ayah.id}
              </Badge>
              <p className="text-muted-foreground leading-relaxed">
                {highlightMatch(ayah.translation, ayahSearch)}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const ContinuousView = () => (
    <div className="space-y-8">
      {/* Arabic Text Section */}
      <Card>
        <CardContent className="p-8">
          <div className="text-right space-y-1">
            <div
              className="font-arabic leading-loose"
              style={{ fontSize: `${fontSize[0]}px` }}
            >
              {filteredAyahs.map((ayah, index) => (
                <span key={ayah.id} className="group relative">
                  <span className="hover:bg-accent/20 transition-colors cursor-pointer">
                    {highlightMatch(ayah.text, ayahSearch, true)}
                  </span>
                  <span className="inline-flex items-center justify-center w-6 h-6 text-xs bg-primary text-primary-foreground rounded-full mx-2 font-sans">
                    {ayah.id}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-1 -right-1 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() =>
                      toggleBookmark(selectedSurah.number, ayah.id)
                    }
                  >
                    <Bookmark
                      className={`h-3 w-3 ${
                        isBookmarked(selectedSurah.number, ayah.id)
                          ? "fill-current text-yellow-500"
                          : ""
                      }`}
                    />
                  </Button>
                  {index < ayahs.length - 1 && " "}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Translation Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Translation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredAyahs.map((ayah) => (
            <div key={ayah.id} className="flex gap-3">
              <Badge variant="outline" className="text-xs mt-1 flex-shrink-0">
                {ayah.id}
              </Badge>
              <p className="text-muted-foreground leading-relaxed">
                {highlightMatch(ayah.translation, ayahSearch)}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  // Nice loading spinner component
  const NiceLoading = ({
    message = "Loading...",
    fullscreen = false,
  }: {
    message?: string;
    fullscreen?: boolean;
  }) => (
    <div
      className={`flex flex-col items-center justify-center ${
        fullscreen ? "h-screen" : "py-16"
      }`}
    >
      <div className="relative mb-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400 border-opacity-30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="h-8 w-8 text-blue-500 animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v1m0 14v1m8-8h1M4 12H3m15.364-7.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707"
            />
          </svg>
        </div>
      </div>
      <p className="text-lg text-muted-foreground">{message}</p>
    </div>
  );

  if (loadingSurahs) {
    return <NiceLoading message="Loading Surah List..." fullscreen />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }
  if (!selectedSurah) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3d8e8] dark:from-[#1e293b] dark:to-[#334155] text-foreground relative overflow-x-hidden">
      {/* Offline mode indicator */}
      {offline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-200 text-yellow-900 text-center py-1 text-xs">
          Offline mode: showing cached Quran data
        </div>
      )}
      <SidebarProvider>
        <AppSidebar
          surahs={surahs}
          selectedSurah={selectedSurah}
          onSurahSelect={setSelectedSurah}
        />
        <SidebarInset>
          {/* Header */}
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
                    onClick={() =>
                      setFontSize((prev) => [Math.max(12, prev[0] - 2)])
                    }
                    disabled={fontSize[0] <= 12}
                  >
                    <AArrowDown className="text-lg font-bold" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Increase font size"
                    onClick={() =>
                      setFontSize((prev) => [Math.min(32, prev[0] + 2)])
                    }
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

          {/* Reading Area */}
          <ScrollArea className="flex-1">
            <div className="max-w-4xl mx-auto p-6 space-y-8">
              {/* Surah Header */}
              <Card className="bg-white/90 dark:bg-blue-900/80 shadow-lg border-2 border-blue-500">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl md:text-3xl font-quranic text-blue-500 tracking-wide">
                    {selectedSurah.englishName} ({selectedSurah.number})
                  </CardTitle>
                  <p className="text-4xl font-quranic text-blue-500 drop-shadow-sm mb-2 mt-2">
                    {selectedSurah.name}
                  </p>
                  <p className="text-base text-blue-500 font-serif mb-2">
                    {selectedSurah.englishNameTranslation}
                  </p>
                  <div className="flex justify-center gap-4 text-sm">
                    <Badge
                      variant="outline"
                      className="border-blue-500 text-blue-500 bg-white/80"
                    >
                      {selectedSurah.numberOfAyahs} Ayahs
                    </Badge>
                    <Badge
                      variant={
                        selectedSurah.revelationType === "Meccan"
                          ? "default"
                          : "secondary"
                      }
                      className="border-blue-500 text-blue-500 bg-white/80"
                    >
                      {selectedSurah.revelationType}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              {/* Content based on view mode */}
              {loadingAyahs || ayahs.length === 0 ? (
                <NiceLoading message="Loading Surah..." />
              ) : viewMode === "cards" ? (
                <CardView />
              ) : viewMode === "continuous" ? (
                <ContinuousView />
              ) : (
                <LinesView />
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center py-8">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-blue-500 text-blue-500 bg-white/80"
                  disabled={selectedSurah.number === 1}
                  onClick={() => {
                    const prevSurah = surahs.find(
                      (s) => s.number === selectedSurah.number - 1
                    );
                    if (prevSurah) setSelectedSurah(prevSurah);
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous Surah
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-blue-500 text-blue-500 bg-white/80"
                  disabled={selectedSurah.number === surahs.length}
                  onClick={() => {
                    const nextSurah = surahs.find(
                      (s) => s.number === selectedSurah.number + 1
                    );
                    if (nextSurah) setSelectedSurah(nextSurah);
                  }}
                >
                  Next Surah
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </ScrollArea>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
