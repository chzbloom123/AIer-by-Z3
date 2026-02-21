import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Article {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  persona: { id: string; name: string };
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/articles")
      .then((r) => r.json())
      .then(setArticles)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-editorial-400">Loading...</p>;

  if (articles.length === 0)
    return <p className="text-editorial-400">No articles yet.</p>;

  return (
    <div className="space-y-8">
      {articles.map((article) => (
        <article
          key={article.id}
          className="border-b border-editorial-100 pb-8 last:border-0"
        >
          <Link to={`/article/${article.id}`}>
            <h2 className="font-headline text-2xl font-bold text-editorial-900 hover:text-editorial-600 transition-colors">
              {article.title}
            </h2>
          </Link>
          <p className="text-editorial-400 text-sm mt-2">
            By{" "}
            <Link
              to={`/persona/${article.persona.id}`}
              className="text-editorial-600 hover:underline"
            >
              {article.persona.name}
            </Link>
            {" — "}
            {new Date(article.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="mt-3 text-editorial-700 leading-relaxed">
            {article.body.slice(0, 200)}...
          </p>
        </article>
      ))}
    </div>
  );
}
