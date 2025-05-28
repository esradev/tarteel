import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Clock,
  MapPin,
  Settings,
  Sunrise,
  Sun,
  Sunset,
  Moon,
} from "lucide-react";

interface PrayerTime {
  name: string;
  time: string;
  icon: any;
  isNext?: boolean;
  isPassed?: boolean;
}

export default function PrayerTimes() {
  const [location, setLocation] = useState("New York, NY");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Mock prayer times with more detailed data
    const mockPrayerTimes: PrayerTime[] = [
      { name: "Fajr", time: "05:30", icon: Sunrise, isPassed: true },
      { name: "Sunrise", time: "07:15", icon: Sun, isPassed: true },
      { name: "Dhuhr", time: "12:45", icon: Sun, isNext: true },
      { name: "Asr", time: "16:20", icon: Sun },
      { name: "Maghrib", time: "18:45", icon: Sunset },
      { name: "Isha", time: "20:15", icon: Moon },
    ];
    setPrayerTimes(mockPrayerTimes);

    return () => clearInterval(timer);
  }, []);

  const nextPrayer = prayerTimes.find((prayer) => prayer.isNext);

  return (
    <SidebarInset>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-b bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-2xl font-bold">Prayer Times</h1>
                <p className="text-muted-foreground">
                  Stay connected with your daily prayers
                </p>
              </div>
            </div>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Location and Current Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter your location"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Prayer times are calculated for your location
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Current Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {currentTime.toLocaleTimeString()}
                  </div>
                  <div className="text-blue-100">
                    {currentTime.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Next Prayer Highlight */}
            {nextPrayer && (
              <Card className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Next Prayer
                      </h3>
                      <div className="flex items-center gap-3">
                        <nextPrayer.icon className="h-8 w-8" />
                        <div>
                          <div className="text-2xl font-bold">
                            {nextPrayer.name}
                          </div>
                          <div className="text-green-100">
                            {nextPrayer.time}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-green-100">
                        Time remaining
                      </div>
                      <div className="text-xl font-bold">2h 15m</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All Prayer Times */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Prayer Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prayerTimes.map((prayer) => (
                    <div
                      key={prayer.name}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        prayer.isNext
                          ? "bg-primary/10 border-primary"
                          : prayer.isPassed
                          ? "bg-muted/50"
                          : "bg-background"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2 rounded-lg ${
                            prayer.isNext
                              ? "bg-primary text-primary-foreground"
                              : prayer.isPassed
                              ? "bg-muted"
                              : "bg-accent"
                          }`}
                        >
                          <prayer.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-semibold">{prayer.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {prayer.name === "Sunrise"
                              ? "Shurooq"
                              : `${prayer.name} Prayer`}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">
                          {prayer.time}
                        </div>
                        <div className="flex gap-2">
                          {prayer.isNext && (
                            <Badge variant="default">Next</Badge>
                          )}
                          {prayer.isPassed && (
                            <Badge variant="secondary">Completed</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Prayer Time Calculation Method */}
            <Card>
              <CardHeader>
                <CardTitle>Calculation Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      Calculation Method
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Islamic Society of North America (ISNA)
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Madhab</label>
                    <p className="text-sm text-muted-foreground">
                      Hanafi (Asr calculation)
                    </p>
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
