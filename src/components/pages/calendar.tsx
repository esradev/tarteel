import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Star,
  Moon,
} from "lucide-react";

interface IslamicEvent {
  date: number;
  title: string;
  description: string;
  type: "major" | "minor";
}

interface IslamicMonth {
  name: string;
  arabicName: string;
  days: number;
  events: IslamicEvent[];
}

export default function IslamicCalendar() {
  const [currentMonth, setCurrentMonth] = useState(4); // Jumada Al-Awwal (5th month, 0-indexed)
  const [currentYear, setCurrentYear] = useState(1446);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const islamicMonths: IslamicMonth[] = [
    {
      name: "Muharram",
      arabicName: "مُحَرَّم",
      days: 30,
      events: [
        {
          date: 1,
          title: "Islamic New Year",
          description: "Beginning of the Islamic calendar year",
          type: "major",
        },
        {
          date: 10,
          title: "Day of Ashura",
          description: "Day of fasting and remembrance",
          type: "major",
        },
      ],
    },
    {
      name: "Safar",
      arabicName: "صَفَر",
      days: 29,
      events: [],
    },
    {
      name: "Rabi' Al-Awwal",
      arabicName: "رَبِيع الْأَوَّل",
      days: 30,
      events: [
        {
          date: 12,
          title: "Mawlid an-Nabi",
          description: "Birth of Prophet Muhammad (PBUH)",
          type: "major",
        },
      ],
    },
    {
      name: "Rabi' Al-Thani",
      arabicName: "رَبِيع الثَّانِي",
      days: 29,
      events: [],
    },
    {
      name: "Jumada Al-Awwal",
      arabicName: "جُمَادَىٰ الْأُولَىٰ",
      days: 30,
      events: [],
    },
    {
      name: "Jumada Al-Thani",
      arabicName: "جُمَادَىٰ الثَّانِيَة",
      days: 29,
      events: [],
    },
    {
      name: "Rajab",
      arabicName: "رَجَب",
      days: 30,
      events: [
        {
          date: 27,
          title: "Isra and Mi'raj",
          description: "Night Journey of Prophet Muhammad (PBUH)",
          type: "major",
        },
      ],
    },
    {
      name: "Sha'ban",
      arabicName: "شَعْبَان",
      days: 29,
      events: [
        {
          date: 15,
          title: "Laylat al-Bara'at",
          description: "Night of Forgiveness",
          type: "minor",
        },
      ],
    },
    {
      name: "Ramadan",
      arabicName: "رَمَضَان",
      days: 30,
      events: [
        {
          date: 1,
          title: "First Day of Ramadan",
          description: "Beginning of the holy month of fasting",
          type: "major",
        },
        {
          date: 27,
          title: "Laylat al-Qadr",
          description: "Night of Power",
          type: "major",
        },
      ],
    },
    {
      name: "Shawwal",
      arabicName: "شَوَّال",
      days: 29,
      events: [
        {
          date: 1,
          title: "Eid al-Fitr",
          description: "Festival of Breaking the Fast",
          type: "major",
        },
      ],
    },
    {
      name: "Dhu al-Qi'dah",
      arabicName: "ذُو الْقِعْدَة",
      days: 30,
      events: [],
    },
    {
      name: "Dhu al-Hijjah",
      arabicName: "ذُو الْحِجَّة",
      days: 29,
      events: [
        {
          date: 9,
          title: "Day of Arafah",
          description: "Day of standing at Arafah during Hajj",
          type: "major",
        },
        {
          date: 10,
          title: "Eid al-Adha",
          description: "Festival of Sacrifice",
          type: "major",
        },
      ],
    },
  ];

  const currentMonthData = islamicMonths[currentMonth];
  const today = 15; // Mock current date

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
    setSelectedDate(null);
  };

  const renderCalendarDays = () => {
    const days = [];
    const daysInMonth = currentMonthData.days;

    for (let day = 1; day <= daysInMonth; day++) {
      const hasEvent = currentMonthData.events.some(
        (event) => event.date === day
      );
      const isToday = day === today;
      const isSelected = day === selectedDate;

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(day)}
          className={`
            relative p-3 text-center rounded-lg border transition-colors
            ${
              isToday ? "bg-primary text-primary-foreground border-primary" : ""
            }
            ${
              isSelected && !isToday ? "bg-accent border-accent-foreground" : ""
            }
            ${!isToday && !isSelected ? "hover:bg-accent" : ""}
            ${hasEvent ? "ring-2 ring-green-500 ring-opacity-50" : ""}
          `}
        >
          <span className="text-sm font-medium">{day}</span>
          {hasEvent && (
            <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
          )}
        </button>
      );
    }

    return days;
  };

  const selectedDateEvents = selectedDate
    ? currentMonthData.events.filter((event) => event.date === selectedDate)
    : [];

  return (
    <SidebarInset>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-b bg-card p-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold">Islamic Calendar</h1>
              <p className="text-muted-foreground">
                Hijri calendar with important Islamic dates
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Current Date Display */}
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{today}</div>
                  <div className="text-xl mb-1">
                    {currentMonthData.name} {currentYear}
                  </div>
                  <div className="text-2xl font-arabic">
                    {currentMonthData.arabicName}
                  </div>
                  <div className="text-blue-100 mt-2">
                    Corresponding to:{" "}
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5" />
                        {currentMonthData.name} {currentYear}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => navigateMonth("prev")}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => navigateMonth("next")}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-lg font-arabic text-center">
                      {currentMonthData.arabicName}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-2 mb-4">
                      {["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"].map(
                        (day) => (
                          <div
                            key={day}
                            className="text-center text-sm font-medium text-muted-foreground p-2"
                          >
                            {day}
                          </div>
                        )
                      )}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {renderCalendarDays()}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Events and Information */}
              <div className="space-y-6">
                {/* Selected Date Events */}
                {selectedDate && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {selectedDate} {currentMonthData.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedDateEvents.length > 0 ? (
                        <div className="space-y-3">
                          {selectedDateEvents.map((event, index) => (
                            <div
                              key={index}
                              className="p-3 rounded-lg bg-accent"
                            >
                              <div className="flex items-start gap-2">
                                <Star className="h-4 w-4 text-yellow-500 mt-1" />
                                <div>
                                  <h4 className="font-semibold">
                                    {event.title}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {event.description}
                                  </p>
                                  <Badge
                                    variant={
                                      event.type === "major"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="mt-2"
                                  >
                                    {event.type === "major"
                                      ? "Major Event"
                                      : "Minor Event"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          No events on this date
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Month Events */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Events This Month
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {currentMonthData.events.length > 0 ? (
                      <div className="space-y-3">
                        {currentMonthData.events.map((event, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer"
                            onClick={() => setSelectedDate(event.date)}
                          >
                            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                              {event.date}
                            </div>
                            <div>
                              <h4 className="font-semibold">{event.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {event.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        No special events this month
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Islamic Calendar Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Moon className="h-5 w-5" />
                      About Hijri Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <p>
                        The Islamic calendar is a lunar calendar consisting of
                        12 months in a year of 354 or 355 days.
                      </p>
                      <p>
                        It is used to determine the proper days of Islamic
                        holidays and rituals.
                      </p>
                      <div className="pt-2">
                        <h5 className="font-semibold mb-2">
                          Current Year: {currentYear} AH
                        </h5>
                        <p className="text-muted-foreground">
                          AH stands for "Anno Hegirae" (Year of the Hijra),
                          marking the migration of Prophet Muhammad (PBUH) from
                          Mecca to Medina.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
