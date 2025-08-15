import React from "react";
import { ToggleButton, Card, CurrentCard, SearchBox } from "./components";
import { VscLoading } from "react-icons/vsc";
import { FiLogOut } from "react-icons/fi";
import type { CityWeather } from "./components/SearchBox";
import Login from "./components/Login";
import Register from "./components/Register";

export type AppContextProps = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AppContext = React.createContext({} as AppContextProps);

const API_BASE = "http://localhost:8000";

/** ---------- date helpers (robust to string/number/Date) ---------- */
function parseDate(input: unknown): Date | null {
  if (!input) return null;
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input;
  if (typeof input === "number") {
    // if epoch seconds, multiply; if ms, use as-is
    const ms = input < 1e12 ? input * 1000 : input;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof input === "string") {
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function labelFrom(baseDate: Date, index: number): string {
  const d = addDays(baseDate, index);
  const today = startOfDay(new Date());
  const dayOnly = startOfDay(d);
  const diffDays = Math.round((dayOnly.getTime() - today.getTime()) / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/** ---------------------------------------------------------------- */

function App(): JSX.Element {
  const [selectedCity, setSelectedCity] = React.useState<CityWeather | null>(null);
  const [selectedDay, setSelectedDay] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState(false);

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [showRegister, setShowRegister] = React.useState(false);
  const [username, setUsername] = React.useState<string>("");

  // On mount: if token exists, restore session
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Not authorized");
        const me = await res.json();
        setUsername(me.name);
        setIsLoggedIn(true);
        localStorage.setItem("username", me.name);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setIsLoggedIn(false);
        setUsername("");
      }
    })();
  }, []);

  // Choose a stable base date for labels (first forecast date -> start-of-day)
  const labelBaseDate = React.useMemo(() => {
    const first = parseDate(selectedCity?.weather?.[0]?.dateForecast);
    return first ? startOfDay(first) : startOfDay(new Date());
  }, [selectedCity?.weather]);

  // Show Login/Register before logged in
  if (!isLoggedIn) {
    return showRegister ? (
      <Register
        onRegister={() => setShowRegister(false)}
        onLoginClick={() => setShowRegister(false)}
      />
    ) : (
      <Login
        onLogin={(user: { name: string; token: string }) => {
          setUsername(user.name);
          localStorage.setItem("username", user.name);
          localStorage.setItem("token", user.token);
          setIsLoggedIn(true);
        }}
        onRegisterClick={() => setShowRegister(true)}
      />
    );
  }

  return (
    <div className="text-slate-800 dark:text-slate-200 min-h-screen flex flex-col">
      {/* NAVBAR */}
      <header className="flex justify-between items-center px-4 py-2 bg-slate-100 dark:bg-slate-900 shadow-md">
        <h1 className="text-lg sm:text-xl font-bold truncate max-w-[60%]">
          Weather App{" "}
          {username && <span className="text-sky-500 font-normal">({username})</span>}
        </h1>
        <div className="flex items-center gap-2 sm:gap-4">
          <ToggleButton />
          <button
            onClick={() => {
              setIsLoggedIn(false);
              setShowRegister(false);
              setSelectedCity(null);
              setSelectedDay(0);
              setUsername("");
              localStorage.removeItem("username");
              localStorage.removeItem("token");
            }}
            className="p-2 sm:p-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md flex items-center justify-center transition-transform hover:scale-105"
            title="Logout"
          >
            <FiLogOut size={18} />
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center p-2 sm:p-4">
        <AppContext.Provider value={{ isLoading, setIsLoading }}>
          <div className="flex items-center justify-center mb-4 sm:mb-6 w-full">
            <SearchBox setSelectedCity={setSelectedCity} />
          </div>

          <div className="transition-all ease-in-out w-full">
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-3xl sm:text-4xl text-slate-400">
                <VscLoading className="animate-spin" />
              </div>
            ) : selectedCity?.name &&
              selectedCity?.country &&
              selectedCity?.weather &&
              selectedCity.weather[selectedDay]?.dateForecast &&
              selectedCity.weather[selectedDay]?.description &&
              selectedCity.weather[selectedDay]?.iconId &&
              selectedCity.weather[selectedDay]?.temp &&
              selectedCity.weather[selectedDay]?.tempMax &&
              selectedCity.weather[selectedDay]?.tempMin &&
              selectedCity.weather[selectedDay]?.humidity ? (
              <>
                <CurrentCard
                  cityName={{ city: selectedCity?.name, country: selectedCity?.country }}
                  weather={{
                    dateForecast: selectedCity.weather[selectedDay]?.dateForecast,
                    description: selectedCity.weather[selectedDay]?.description,
                    iconID: selectedCity.weather[selectedDay]?.iconId,
                    temp: selectedCity.weather[selectedDay]?.temp,
                    tempMax: selectedCity.weather[selectedDay]?.tempMax,
                    tempMin: selectedCity.weather[selectedDay]?.tempMin,
                    humidity: selectedCity.weather[selectedDay]?.humidity,
                  }}
                />

                {/* Forecast cards with stable, non-repeating labels */}
                <div className="flex overflow-auto gap-2 sm:gap-4 p-2 mt-4 w-full sm:justify-center">
                  {selectedCity.weather.map((weather, index) => (
                    <Card
                      key={index}
                      code={weather.iconId || ""}
                      day={labelFrom(labelBaseDate, index)} // <- labels from base + index
                      setSelectedDay={setSelectedDay}
                      temperature={Math.floor(weather.temp || 0)}
                      index={index}
                    />
                  ))}
                </div>
              </>
            ) : (
              <CurrentCard />
            )}
          </div>
        </AppContext.Provider>
      </main>

      {/* FOOTER */}
      <footer className="flex flex-col items-center justify-center p-2 sm:p-4 text-xs sm:text-sm bg-slate-100 dark:bg-slate-900 mt-4">
        <span>COPYRIGHT &copy; 2025 PCCOE 2026 STQA Group</span>
        <span>All rights reserved</span>
      </footer>
    </div>
  );
}

export default App;
