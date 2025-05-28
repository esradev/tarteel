import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Bookmark,
  Settings,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  LayoutGrid,
  AlignLeft,
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);

  // Fetch surah list on mount
  useEffect(() => {
    setLoading(true);
    const cachedSurahs = localStorage.getItem("surahs");
    if (cachedSurahs) {
      try {
        const parsed = JSON.parse(cachedSurahs);
        setSurahs(parsed);
        setSelectedSurah(parsed[0]);
        setOffline(true);
        setLoading(false);
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
      .finally(() => setLoading(false));
  }, []);

  // Fetch ayahs when selectedSurah changes
  useEffect(() => {
    if (!selectedSurah) return;
    setLoading(true);
    const ayahCacheKey = `ayahs-${selectedSurah.number}`;
    const cachedAyahs = localStorage.getItem(ayahCacheKey);
    if (cachedAyahs) {
      try {
        setAyahs(JSON.parse(cachedAyahs));
        setOffline(true);
        setLoading(false);
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
    setLoading(true);
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
      .finally(() => setLoading(false));
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

  const SettingsDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background border">
        <DialogHeader>
          <DialogTitle>Reading Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Font Size</label>
            <Slider
              value={fontSize}
              onValueChange={setFontSize}
              max={32}
              min={12}
              step={2}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Current: {fontSize[0]}px
            </p>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Dark Mode</label>
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
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">View Mode</label>
            <div className="flex gap-1">
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
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500"></div>
        <p className="text-lg text-muted-foreground ml-4">Loading...</p>
      </div>
    );
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
                <SettingsDialog />
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

              {/* Bismillah for non-Tawbah surahs */}
              {selectedSurah.number !== 9 && selectedSurah.number !== 1 && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-2xl font-arabic mb-2">
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </p>
                    <p className="text-sm text-muted-foreground">
                      In the name of Allah, the Entirely Merciful, the
                      Especially Merciful.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Content based on view mode */}
              {viewMode === "cards" ? <CardView /> : <ContinuousView />}

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
