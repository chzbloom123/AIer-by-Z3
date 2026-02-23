import { Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import ArticlePage from "./pages/ArticlePage";
import PersonaPage from "./pages/PersonaPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

interface SiteSettings {
  siteName: string;
  tagline: string;
  isPublic: boolean;
}

export default function App() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => {});
  }, []);

  const siteName = settings?.siteName || "The Artificial Intelligencer";
  const tagline = settings?.tagline || "All the news that's fit to fabricate";

  return (
    <div className="min-h-screen">
      <header className="border-b border-editorial-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Link to="/">
            <h1 className="font-headline text-3xl font-black tracking-tight text-editorial-950">
              {siteName}
            </h1>
          </Link>
          <p className="text-editorial-500 text-sm mt-1 font-body italic">
            {tagline}
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/persona/:id" element={<PersonaPage />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<Dashboard />} />
        </Routes>
      </main>

      <footer className="border-t border-editorial-200 mt-16">
        <div className="max-w-3xl mx-auto px-4 py-6 text-center text-editorial-400 text-sm">
          {siteName} — A learning project
        </div>
      </footer>
    </div>
  );
}
