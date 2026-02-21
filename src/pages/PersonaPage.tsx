import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

interface Persona {
  id: string;
  name: string;
  bio: string;
  role: string;
  imageUrl: string | null;
  articles: {
    id: string;
    title: string;
    createdAt: string;
  }[];
}

export default function PersonaPage() {
  const { id } = useParams();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/personas/${id}`)
      .then((r) => r.json())
      .then(setPersona)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-editorial-400">Loading...</p>;
  if (!persona) return <p className="text-editorial-400">Persona not found.</p>;

  return (
    <div>
      <div className="mb-8">
        {persona.imageUrl && (
          <img
            src={persona.imageUrl}
            alt={persona.name}
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
        )}
        <h1 className="font-headline text-3xl font-bold text-editorial-950">
          {persona.name}
        </h1>
        <p className="text-editorial-500 text-sm mt-1 capitalize">
          {persona.role}
        </p>
        <p className="mt-4 text-editorial-700 leading-relaxed">{persona.bio}</p>
      </div>

      <h2 className="font-headline text-xl font-bold text-editorial-800 mb-4 border-b border-editorial-200 pb-2">
        Articles by {persona.name}
      </h2>

      {persona.articles.length === 0 ? (
        <p className="text-editorial-400">No articles yet.</p>
      ) : (
        <div className="space-y-4">
          {persona.articles.map((article) => (
            <div key={article.id}>
              <Link
                to={`/article/${article.id}`}
                className="font-headline text-lg text-editorial-900 hover:text-editorial-600 transition-colors"
              >
                {article.title}
              </Link>
              <p className="text-editorial-400 text-sm">
                {new Date(article.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link to="/" className="text-editorial-500 hover:text-editorial-700 text-sm">
          &larr; Back to all articles
        </Link>
      </div>
    </div>
  );
}
