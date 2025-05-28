import { useState, useEffect } from "react";

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  id: number;
  text: string;
  translation: string;
}

export function useQuranData() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
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
    setAyahs([]);
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
      .catch(() => {
        setError("Failed to load surah");
        setOffline(true);
      })
      .finally(() => setLoadingAyahs(false));
  }, [selectedSurah]);

  return {
    surahs,
    selectedSurah,
    setSelectedSurah,
    ayahs,
    loadingSurahs,
    loadingAyahs,
    error,
    offline,
  };
}
