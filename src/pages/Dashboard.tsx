import { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

interface Persona {
  id: string;
  name: string;
  role: string;
}

interface Article {
  id: string;
  title: string;
  body: string;
  personaId: string;
  createdAt: string;
  persona: { id: string; name: string };
}

function getToken() {
  return localStorage.getItem("token") || "";
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  // Persona form
  const [pName, setPName] = useState("");
  const [pBio, setPBio] = useState("");
  const [pRole, setPRole] = useState("reporter");

  // Article form
  const [aTitle, setATitle] = useState("");
  const [aBody, setABody] = useState("");
  const [aPersonaId, setAPersonaId] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editPersonaId, setEditPersonaId] = useState("");

  useEffect(() => {
    if (!getToken()) {
      navigate("/admin/login");
      return;
    }
    loadData();
  }, [navigate]);

  async function loadData() {
    const [pRes, aRes] = await Promise.all([
      fetch("/api/personas"),
      fetch("/api/articles"),
    ]);
    const pData = await pRes.json();
    const aData = await aRes.json();
    setPersonas(pData);
    setArticles(aData);
    if (pData.length > 0 && !aPersonaId) {
      setAPersonaId(pData[0].id);
    }
  }

  async function createPersona(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/personas", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ name: pName, bio: pBio, role: pRole }),
    });
    if (res.status === 401) {
      navigate("/admin/login");
      return;
    }
    setPName("");
    setPBio("");
    setPRole("reporter");
    loadData();
  }

  async function createArticle(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/articles", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        title: aTitle,
        body: aBody,
        personaId: aPersonaId,
      }),
    });
    if (res.status === 401) {
      navigate("/admin/login");
      return;
    }
    setATitle("");
    setABody("");
    loadData();
  }

  async function deleteArticle(id: string) {
    if (!confirm("Delete this article?")) return;
    await fetch(`/api/admin/articles/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    loadData();
  }

  function startEdit(article: Article) {
    setEditingId(article.id);
    setEditTitle(article.title);
    setEditBody(article.body);
    setEditPersonaId(article.personaId);
  }

  async function saveEdit(e: FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    await fetch(`/api/admin/articles/${editingId}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({
        title: editTitle,
        body: editBody,
        personaId: editPersonaId,
      }),
    });
    setEditingId(null);
    loadData();
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/admin/login");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-2xl font-bold text-editorial-950">
          Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="text-sm text-editorial-500 hover:text-editorial-700"
        >
          Log out
        </button>
      </div>

      {/* Personas Section */}
      <section className="mb-12">
        <h2 className="font-headline text-xl font-bold text-editorial-800 border-b border-editorial-200 pb-2 mb-4">
          Personas
        </h2>

        <div className="space-y-2 mb-6">
          {personas.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 text-sm text-editorial-700"
            >
              <span className="font-semibold">{p.name}</span>
              <span className="text-editorial-400 capitalize">{p.role}</span>
            </div>
          ))}
          {personas.length === 0 && (
            <p className="text-editorial-400 text-sm">No personas yet.</p>
          )}
        </div>

        <form
          onSubmit={createPersona}
          className="bg-white border border-editorial-200 rounded p-4 space-y-3"
        >
          <h3 className="text-sm font-semibold text-editorial-600">
            Create Persona
          </h3>
          <input
            placeholder="Name"
            value={pName}
            onChange={(e) => setPName(e.target.value)}
            className="w-full border border-editorial-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-editorial-400"
            required
          />
          <textarea
            placeholder="Bio"
            value={pBio}
            onChange={(e) => setPBio(e.target.value)}
            className="w-full border border-editorial-200 rounded px-3 py-2 text-sm h-20 focus:outline-none focus:border-editorial-400"
            required
          />
          <select
            value={pRole}
            onChange={(e) => setPRole(e.target.value)}
            className="w-full border border-editorial-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-editorial-400"
          >
            <option value="reporter">Reporter</option>
            <option value="commentator">Commentator</option>
          </select>
          <button
            type="submit"
            className="bg-editorial-900 text-white px-4 py-2 rounded text-sm hover:bg-editorial-700 transition-colors"
          >
            Create Persona
          </button>
        </form>
      </section>

      {/* Articles Section */}
      <section>
        <h2 className="font-headline text-xl font-bold text-editorial-800 border-b border-editorial-200 pb-2 mb-4">
          Articles
        </h2>

        <div className="space-y-4 mb-6">
          {articles.map((a) =>
            editingId === a.id ? (
              <form
                key={a.id}
                onSubmit={saveEdit}
                className="bg-white border border-editorial-300 rounded p-4 space-y-3"
              >
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border border-editorial-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-editorial-400"
                  required
                />
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  className="w-full border border-editorial-200 rounded px-3 py-2 text-sm h-32 focus:outline-none focus:border-editorial-400"
                  required
                />
                <select
                  value={editPersonaId}
                  onChange={(e) => setEditPersonaId(e.target.value)}
                  className="w-full border border-editorial-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-editorial-400"
                >
                  {personas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-editorial-900 text-white px-4 py-2 rounded text-sm hover:bg-editorial-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="border border-editorial-200 px-4 py-2 rounded text-sm hover:bg-editorial-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div
                key={a.id}
                className="flex items-start justify-between border-b border-editorial-100 pb-3"
              >
                <div>
                  <p className="font-semibold text-sm text-editorial-800">
                    {a.title}
                  </p>
                  <p className="text-editorial-400 text-xs">
                    by {a.persona.name} —{" "}
                    {new Date(a.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => startEdit(a)}
                    className="text-xs text-editorial-500 hover:text-editorial-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteArticle(a.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          )}
          {articles.length === 0 && (
            <p className="text-editorial-400 text-sm">No articles yet.</p>
          )}
        </div>

        <form
          onSubmit={createArticle}
          className="bg-white border border-editorial-200 rounded p-4 space-y-3"
        >
          <h3 className="text-sm font-semibold text-editorial-600">
            Create Article
          </h3>
          <input
            placeholder="Title"
            value={aTitle}
            onChange={(e) => setATitle(e.target.value)}
            className="w-full border border-editorial-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-editorial-400"
            required
          />
          <textarea
            placeholder="Body"
            value={aBody}
            onChange={(e) => setABody(e.target.value)}
            className="w-full border border-editorial-200 rounded px-3 py-2 text-sm h-32 focus:outline-none focus:border-editorial-400"
            required
          />
          <select
            value={aPersonaId}
            onChange={(e) => setAPersonaId(e.target.value)}
            className="w-full border border-editorial-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-editorial-400"
          >
            {personas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-editorial-900 text-white px-4 py-2 rounded text-sm hover:bg-editorial-700 transition-colors"
          >
            Create Article
          </button>
        </form>
      </section>
    </div>
  );
}
