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
  AlignLeft,
  Minus,
  Plus,
} from "lucide-react";
import { AppSidebar } from "./components/app-sidebar";

export default function App() {
  const [surahs, setSurahs] = useState<any[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<any | null>(null);
  const [ayahs, setAyahs] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [fontSize, setFontSize] = useState([18]);
  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "continuous">("cards");
  const [loadingSurahs, setLoadingSurahs] = useState(false);
  const [loadingAyahs, setLoadingAyahs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);

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

  const CardView = () => (
    <div className="space-y-6">
      {ayahs.map((ayah) => (
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
                  {ayah.text}
                </p>
              </div>
              <Separator />
              <p className="text-muted-foreground leading-relaxed">
                {ayah.translation}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
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
              {ayahs.map((ayah, index) => (
                <span key={ayah.id} className="group relative">
                  <span className="hover:bg-accent/20 transition-colors cursor-pointer">
                    {ayah.text}
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
          {ayahs.map((ayah) => (
            <div key={ayah.id} className="flex gap-3">
              <Badge variant="outline" className="text-xs mt-1 flex-shrink-0">
                {ayah.id}
              </Badge>
              <p className="text-muted-foreground leading-relaxed">
                {ayah.translation}
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
    <div className="min-h-screen bg-background text-foreground">
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
          <div className="border-b bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h2 className="text-xl font-quran font-bold flex items-center gap-2 align-middle">
                    <span className="text-sm text-muted-foreground">
                      (#{selectedSurah.number})
                    </span>
                    {selectedSurah.name}
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "cards" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("cards")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "continuous" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("continuous")}
                >
                  <AlignLeft className="h-4 w-4" />
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
                    <Minus className="text-lg font-bold" />
                  </Button>
                  <span className="text-sm w-8 text-center select-none">
                    {fontSize[0]}px
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Increase font size"
                    onClick={() =>
                      setFontSize((prev) => [Math.min(32, prev[0] + 2)])
                    }
                    disabled={fontSize[0] >= 32}
                  >
                    <Plus className="text-lg font-bold" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
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
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">
                    {selectedSurah.englishName} ({selectedSurah.number})
                  </CardTitle>
                  <p className="text-3xl font-arabic">{selectedSurah.name}</p>
                  <p className="text-muted-foreground">
                    {selectedSurah.englishNameTranslation}
                  </p>
                  <div className="flex justify-center gap-4 text-sm">
                    <Badge variant="outline">
                      {selectedSurah.numberOfAyahs} Ayahs
                    </Badge>
                    <Badge
                      variant={
                        selectedSurah.revelationType === "Meccan"
                          ? "default"
                          : "secondary"
                      }
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
              ) : (
                <ContinuousView />
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center py-8">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
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
                  className="flex items-center gap-2"
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
