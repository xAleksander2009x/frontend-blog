import { useParams } from "react-router";
import ArticleDetail from "../components/article/ArticleDetail/ArticleDetail";

const ArticlePage = () => {
  const { id } = useParams();

  return (
    <main className="min-h-screen bg-gi-light-gray px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl rounded-xl border border-gi-dark-ash bg-card p-6 shadow-sm sm:p-10">
        <ArticleDetail articleId={id} />
      </div>
    </main>
  );
};

export default ArticlePage;
