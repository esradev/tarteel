import { useState } from "react";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar, routes } from "./components/app-sidebar";

export default function App() {
  const [currentRoute, setCurrentRoute] = useState("/");

  const CurrentComponent = routes[currentRoute] || (() => <div>Not Found</div>);

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="bg-background w-full text-foreground flex flex-col md:flex-row h-screen">
        <AppSidebar currentRoute={currentRoute} onNavigate={setCurrentRoute} />
        <main className="bg-background flex p-6 w-full">
          <CurrentComponent />
        </main>
      </div>
    </SidebarProvider>
  );
}
