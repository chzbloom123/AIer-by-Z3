import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

interface Article {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  persona: { id: string; name: string; role: string };
}

export default function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/articles/${id}`)
      .then((r) => r.json())
      .then(setArticle)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-editorial-400">Loading...</p>;
  if (!article) return <p className="text-editorial-400">Article not found.</p>;

  return (
    <article>
      <h1 className="font-headline text-4xl font-black text-editorial-950 leading-tight">
        {article.title}
      </h1>
      <p className="text-editorial-400 text-sm mt-3">
        By{" "}
        <Link
          to={`/persona/${article.persona.id}`}
          className="text-editorial-600 hover:underline"
        >
          {article.persona.name}
        </Link>
        {" — "}
        {article.persona.role}
        {" — "}
        {new Date(article.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <div className="mt-8 space-y-4 text-editorial-800 leading-relaxed text-lg">
        {article.body.split("\n\n").map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      <div className="mt-12">
        <Link to="/" className="text-editorial-500 hover:text-editorial-700 text-sm">
          &larr; Back to all articles
        </Link>
      </div>
    </article>
  );
}
