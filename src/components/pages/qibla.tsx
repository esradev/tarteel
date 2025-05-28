import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Compass, MapPin, Navigation, Target, Loader2 } from "lucide-react";

export default function Qibla() {
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationName, setLocationName] = useState<string>("");
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Kaaba coordinates
  const KAABA_LAT = 21.4225;
  const KAABA_LNG = 39.8262;

  const calculateQiblaDirection = (lat: number, lng: number) => {
    const φ1 = (lat * Math.PI) / 180;
    const φ2 = (KAABA_LAT * Math.PI) / 180;
    const Δλ = ((KAABA_LNG - lng) * Math.PI) / 180;

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x =
      Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

    let bearing = (Math.atan2(y, x) * 180) / Math.PI;
    bearing = (bearing + 360) % 360;

    return bearing;
  };

  const getLocation = () => {
    setLoading(true);
    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        // Calculate Qibla direction
        const direction = calculateQiblaDirection(latitude, longitude);
        setQiblaDirection(direction);

        // Get location name using reverse geocoding (mock)
        setLocationName(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        setLoading(false);
      },
      (error) => {
        setError("Unable to retrieve your location");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  // Device orientation for compass
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setDeviceHeading(360 - event.alpha);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation);
      return () =>
        window.removeEventListener("deviceorientation", handleOrientation);
    }
  }, []);

  const compassRotation =
    qiblaDirection !== null ? qiblaDirection - deviceHeading : 0;

  return (
    <SidebarInset>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-b bg-card p-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold">Qibla Direction</h1>
              <p className="text-muted-foreground">
                Find the direction to Kaaba for prayer
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Location Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Your Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    {userLocation ? (
                      <div>
                        <p className="font-semibold">{locationName}</p>
                        <p className="text-sm text-muted-foreground">
                          Latitude: {userLocation.lat.toFixed(6)}, Longitude:{" "}
                          {userLocation.lng.toFixed(6)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        Location not detected
                      </p>
                    )}
                  </div>
                  <Button onClick={getLocation} disabled={loading}>
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Navigation className="h-4 w-4" />
                    )}
                    {loading ? "Getting Location..." : "Get Location"}
                  </Button>
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </CardContent>
            </Card>

            {/* Qibla Direction Card */}
            {qiblaDirection !== null && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Qibla Direction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div>
                      <div className="text-4xl font-bold text-primary">
                        {qiblaDirection.toFixed(1)}°
                      </div>
                      <p className="text-muted-foreground">from North</p>
                    </div>
                    <Badge variant="outline" className="text-sm">
                      Distance to Kaaba: ~
                      {userLocation
                        ? Math.round(
                            calculateDistance(
                              userLocation.lat,
                              userLocation.lng
                            )
                          )
                        : 0}{" "}
                      km
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Compass */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-center justify-center">
                  <Compass className="h-5 w-5" />
                  Qibla Compass
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div className="relative w-80 h-80">
                    {/* Compass Background */}
                    <div className="absolute inset-0 rounded-full border-8 border-gray-300 bg-white dark:bg-gray-800">
                      {/* Compass Markings */}
                      <div className="absolute inset-4 rounded-full border-2 border-gray-200 dark:border-gray-600">
                        {/* Cardinal Directions */}
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-sm font-bold">
                          N
                        </div>
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm font-bold">
                          S
                        </div>
                        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-sm font-bold">
                          W
                        </div>
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm font-bold">
                          E
                        </div>
                      </div>

                      {/* Qibla Arrow */}
                      {qiblaDirection !== null && (
                        <div
                          className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
                          style={{ transform: `rotate(${compassRotation}deg)` }}
                        >
                          <div className="w-1 h-32 bg-gradient-to-t from-green-600 to-green-400 rounded-full relative">
                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-green-600"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-green-600 rounded-full border-2 border-white"></div>
                          </div>
                        </div>
                      )}

                      {/* Center Dot */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-800 dark:bg-white rounded-full"></div>
                    </div>

                    {/* Kaaba Icon */}
                    {qiblaDirection !== null && (
                      <div
                        className="absolute -top-8 left-1/2 transform -translate-x-1/2 transition-transform duration-300"
                        style={{ transform: `rotate(${compassRotation}deg)` }}
                      >
                        <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
                          <div className="w-2 h-2 bg-gold rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {qiblaDirection === null && (
                  <div className="text-center mt-4">
                    <p className="text-muted-foreground">
                      Please allow location access to show Qibla direction
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>How to Use</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <p>Allow location access when prompted by your browser</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <p>
                      Hold your device flat and point it in the direction shown
                      by the green arrow
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <p>
                      The arrow points towards the Kaaba in Mecca for your
                      prayer direction
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

// Helper function to calculate distance
function calculateDistance(lat1: number, lng1: number): number {
  const KAABA_LAT = 21.4225;
  const KAABA_LNG = 39.8262;

  const R = 6371; // Earth's radius in kilometers
  const dLat = ((KAABA_LAT - lat1) * Math.PI) / 180;
  const dLng = ((KAABA_LNG - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((KAABA_LAT * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
