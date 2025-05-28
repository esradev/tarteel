import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  Home,
  BookOpen,
  Clock,
  Compass,
  Calendar,
  Heart,
  Settings,
  User,
} from "lucide-react";

import Dashboard from "./pages/dashboard";
import Quran from "./pages/quran";
import PrayerTimes from "./pages/prayer-times";
import Qibla from "./pages/qibla";
import IslamicCalendar from "./pages/calendar";
import Duas from "./pages/duas";
// import { SettingsPage } from "./pages/settings";

// Dummy components for each route
// const Dashboard = () => <Dashboard />;
// const Quran = () => <Quran />;
// const PrayerTimes = () => <PrayerTimes />;
// const Qibla = () => <Qibla />;
// const IslamicCalendar = () => <IslamicCalendar />;
// const Duas = () => <Duas />;
const SettingsPage = () => <div>Settings Page</div>; // Placeholder for SettingsPage
const Profile = () => <div>Profile Page</div>; // Placeholder for Profile Page

export const routes: Record<string, React.FC> = {
  "/": Dashboard,
  "/quran": Quran,
  "/prayer-times": PrayerTimes,
  "/qibla": Qibla,
  "/calendar": IslamicCalendar,
  "/duas": Duas,
  "/settings": SettingsPage,
  "/profile": Profile,
};

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Quran",
    url: "/quran",
    icon: BookOpen,
  },
  {
    title: "Prayer Times",
    url: "/prayer-times",
    icon: Clock,
  },
  {
    title: "Qibla Direction",
    url: "/qibla",
    icon: Compass,
  },
  {
    title: "Islamic Calendar",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Duas",
    url: "/duas",
    icon: Heart,
  },
];

const bottomItems = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
];

interface AppSidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export function AppSidebar({ currentRoute, onNavigate }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="p-2">
          <h1 className="text-xl font-bold text-center">Islamic App</h1>
          <p className="text-sm text-muted-foreground text-center">
            Your spiritual companion
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={currentRoute === item.url}
                    tooltip={item.title}
                  >
                    <button
                      type="button"
                      onClick={() => onNavigate(item.url)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        background: "none",
                        border: "none",
                        width: "100%",
                        padding: 0,
                        cursor: "pointer",
                      }}
                    >
                      <item.icon className="h-4 w-4" />
                      <span style={{ marginLeft: 8 }}>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {bottomItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={currentRoute === item.url}
                tooltip={item.title}
              >
                <button
                  type="button"
                  onClick={() => onNavigate(item.url)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "none",
                    border: "none",
                    width: "100%",
                    padding: 0,
                    cursor: "pointer",
                  }}
                >
                  <item.icon className="h-4 w-4" />
                  <span style={{ marginLeft: 8 }}>{item.title}</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
