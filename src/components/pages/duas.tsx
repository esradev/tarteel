import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Heart,
  Search,
  Sun,
  Moon,
  Utensils,
  Car,
  Home,
  BookOpen,
  Star,
} from "lucide-react";

interface Dua {
  id: number;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  category: string;
  reference?: string;
}

export default function Duas() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Duas", icon: Heart },
    { id: "morning", name: "Morning", icon: Sun },
    { id: "evening", name: "Evening", icon: Moon },
    { id: "food", name: "Food & Drink", icon: Utensils },
    { id: "travel", name: "Travel", icon: Car },
    { id: "home", name: "Home", icon: Home },
    { id: "study", name: "Study", icon: BookOpen },
    { id: "general", name: "General", icon: Star },
  ];

  const duas: Dua[] = [
    {
      id: 1,
      title: "Morning Remembrance",
      arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ",
      transliteration: "Asbahna wa asbahal-mulku lillahi, walhamdu lillah",
      translation:
        "We have reached the morning and at this very time unto Allah belongs all sovereignty, and all praise is for Allah.",
      category: "morning",
      reference: "Muslim 2723",
    },
    {
      id: 2,
      title: "Evening Remembrance",
      arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ",
      transliteration: "Amsayna wa amsal-mulku lillahi, walhamdu lillah",
      translation:
        "We have reached the evening and at this very time unto Allah belongs all sovereignty, and all praise is for Allah.",
      category: "evening",
      reference: "Muslim 2723",
    },
    {
      id: 3,
      title: "Before Eating",
      arabic: "بِسْمِ اللَّهِ",
      transliteration: "Bismillah",
      translation: "In the name of Allah.",
      category: "food",
      reference: "Abu Dawud 3767",
    },
    {
      id: 4,
      title: "After Eating",
      arabic:
        "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
      transliteration:
        "Alhamdu lillahil-ladhi at'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah",
      translation:
        "All praise is due to Allah who has fed me this and provided it for me without any might nor power from myself.",
      category: "food",
      reference: "Abu Dawud 4023",
    },
    {
      id: 5,
      title: "When Leaving Home",
      arabic:
        "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
      transliteration:
        "Bismillahi, tawakkaltu 'alallahi, wa la hawla wa la quwwata illa billah",
      translation:
        "In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.",
      category: "home",
      reference: "Abu Dawud 5095",
    },
    {
      id: 6,
      title: "When Entering Home",
      arabic:
        "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلِجِ وَخَيْرَ الْمَخْرَجِ",
      transliteration:
        "Allahumma inni as'aluka khayral-mawliji wa khayral-makhraji",
      translation:
        "O Allah, I ask You for the best of entering and the best of exiting.",
      category: "home",
      reference: "Abu Dawud 5096",
    },
    {
      id: 7,
      title: "For Knowledge",
      arabic: "رَبِّ زِدْنِي عِلْمًا",
      transliteration: "Rabbi zidni 'ilma",
      translation: "My Lord, increase me in knowledge.",
      category: "study",
      reference: "Quran 20:114",
    },
    {
      id: 8,
      title: "When Starting a Journey",
      arabic:
        "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ",
      transliteration:
        "Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin",
      translation:
        "Glory is to Him who has subjected this to us, and we could never have it (by our efforts).",
      category: "travel",
      reference: "Quran 43:13",
    },
    {
      id: 9,
      title: "Seeking Forgiveness",
      arabic:
        "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
      transliteration:
        "Astaghfirullaha al-'Azeem al-ladhi la ilaha illa Huwa al-Hayyu al-Qayyumu wa atubu ilayh",
      translation:
        "I seek forgiveness of Allah the Mighty, whom there is none worthy of worship except Him, the Living, the Eternal, and I repent unto Him.",
      category: "general",
      reference: "Abu Dawud 1517",
    },
    {
      id: 10,
      title: "Protection from Evil",
      arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
      transliteration:
        "A'udhu bi kalimatillahi at-tammati min sharri ma khalaq",
      translation:
        "I seek refuge in the perfect words of Allah from the evil of what He has created.",
      category: "general",
      reference: "Muslim 2708",
    },
  ];

  const filteredDuas = duas.filter((dua) => {
    const matchesCategory =
      selectedCategory === "all" || dua.category === selectedCategory;
    const matchesSearch =
      dua.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.translation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SidebarInset>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-b bg-card p-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold">Daily Duas</h1>
              <p className="text-muted-foreground">
                Essential supplications for daily life
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search duas..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={
                          selectedCategory === category.id
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                        className="flex items-center gap-2"
                      >
                        <category.icon className="h-4 w-4" />
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Duas List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredDuas.map((dua) => (
                <Card
                  key={dua.id}
                  className="group hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{dua.title}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {
                          categories.find((cat) => cat.id === dua.category)
                            ?.name
                        }
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Arabic Text */}
                    <div className="text-right">
                      <p className="text-2xl font-arabic leading-loose text-primary">
                        {dua.arabic}
                      </p>
                    </div>

                    {/* Transliteration */}
                    <div className="bg-accent/50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Transliteration:
                      </p>
                      <p className="italic">{dua.transliteration}</p>
                    </div>

                    {/* Translation */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Translation:
                      </p>
                      <p className="leading-relaxed">{dua.translation}</p>
                    </div>

                    {/* Reference */}
                    {dua.reference && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground">
                          Reference: {dua.reference}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredDuas.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No duas found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or category filter.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Information Card */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  About Duas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <p>
                    Duas (supplications) are an essential part of Islamic
                    worship and daily life. They help maintain a connection with
                    Allah throughout the day.
                  </p>
                  <p>
                    These authentic duas are sourced from the Quran and Sunnah,
                    providing spiritual guidance and blessings for various
                    situations.
                  </p>
                  <div className="pt-2">
                    <h5 className="font-semibold mb-2">
                      Benefits of Regular Duas:
                    </h5>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Strengthens connection with Allah</li>
                      <li>Provides spiritual protection and guidance</li>
                      <li>Brings peace and tranquility to the heart</li>
                      <li>Helps remember Allah throughout the day</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
