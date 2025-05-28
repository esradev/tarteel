"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  BookOpen,
  Clock,
  Compass,
  Calendar,
  Heart,
  ArrowRight,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Star,
} from "lucide-react";

interface PrayerTime {
  name: string;
  time: string;
  icon: any;
  isNext?: boolean;
}

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [hijriDate, setHijriDate] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Fetch prayer times (mock data for now)
    const mockPrayerTimes: PrayerTime[] = [
      { name: "Fajr", time: "05:30", icon: Sunrise },
      { name: "Dhuhr", time: "12:45", icon: Sun, isNext: true },
      { name: "Asr", time: "16:20", icon: Sun },
      { name: "Maghrib", time: "18:45", icon: Sunset },
      { name: "Isha", time: "20:15", icon: Moon },
    ];
    setPrayerTimes(mockPrayerTimes);

    // Mock Hijri date
    setHijriDate("15 Jumada Al-Awwal 1446");

    return () => clearInterval(timer);
  }, []);

  const quickActions = [
    {
      title: "Read Quran",
      description: "Continue your daily recitation",
      icon: BookOpen,
      href: "/quran",
      color: "bg-green-500",
    },
    {
      title: "Prayer Times",
      description: "View today's prayer schedule",
      icon: Clock,
      href: "/prayer-times",
      color: "bg-blue-500",
    },
    {
      title: "Find Qibla",
      description: "Get accurate prayer direction",
      icon: Compass,
      href: "/qibla",
      color: "bg-purple-500",
    },
    {
      title: "Daily Duas",
      description: "Recite morning and evening duas",
      icon: Heart,
      href: "/duas",
      color: "bg-pink-500",
    },
  ];

  return (
    <SidebarInset>
      <div className="flex h-full flex-col bg-background text-foreground">
        {/* Header */}
        <div className="border-b bg-card p-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold">Assalamu Alaikum</h1>
              <p className="text-muted-foreground">
                Welcome to your Islamic dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6 w-full">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Time and Date Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Current Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {currentTime.toLocaleTimeString()}
                  </div>
                  <div className="text-blue-100">
                    {currentTime.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-teal-600 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Hijri Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{hijriDate}</div>
                  <div className="text-green-100">Islamic Calendar</div>
                </CardContent>
              </Card>
            </div>

            {/* Prayer Times Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Today's Prayer Times
                  </CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    {/* <Link href="/prayer-times">
                      View All <ArrowRight className="h-4 w-4 ml-1" />
                    </Link> */}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {prayerTimes.map((prayer) => (
                    <div
                      key={prayer.name}
                      className={`p-4 rounded-lg border text-center ${
                        prayer.isNext
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted"
                      }`}
                    >
                      <prayer.icon className="h-6 w-6 mx-auto mb-2" />
                      <div className="font-semibold">{prayer.name}</div>
                      <div className="text-sm">{prayer.time}</div>
                      {prayer.isNext && (
                        <Badge variant="secondary" className="mt-2">
                          Next
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <Card
                    key={action.title}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    {/* <Link href={action.href}>
                      <CardContent className="p-6">
                        <div
                          className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}
                        >
                          <action.icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-semibold mb-2">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                      </CardContent>
                    </Link> */}
                  </Card>
                ))}
              </div>
            </div>

            {/* Daily Verse */}
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Verse of the Day
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-right mb-4">
                  <p className="text-2xl font-arabic leading-loose">
                    وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا
                  </p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-muted-foreground italic">
                    "And whoever fears Allah - He will make for him a way out."
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Quran 65:2
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
