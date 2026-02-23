import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import ArticlePage from "./pages/ArticlePage";
import PersonaPage from "./pages/PersonaPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-editorial-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-6" flex items-center justify-between>
<div>
  <Link to="/">
            <h1 className="font-headline text-3xl font-black tracking-tight text-editorial-950">
              The Artificial Intelligencer
            </h1>
          </Link>
          <p className="text-editorial-500 text-sm mt-1 font-body italic">
            All the news that's fit to fabricate
          </p>
        </div>
                <Link to="/admin/login" className="text-xs text-editorial-400 hover:text-editorial-600 font-body">Admin</Link>
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
          The Artificial Intelligencer — A learning project
        </div>
      </footer>
    </div>
  );
}
