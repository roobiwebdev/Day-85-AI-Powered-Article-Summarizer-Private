import { useState, useEffect } from "react";
import { Typewriter } from "react-simple-typewriter";
import { copy, linkIcon, tick } from "../assets";
import { useLazyGetSummaryQuery } from "../services/article";
import { SendHorizontal, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });
  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  // useEffect(() => {
  //   try {
  //     const storedArticles = localStorage.getItem("articles");
  //     const articles = storedArticles ? JSON.parse(storedArticles) : [];

  //     const migrated = articles.map((article) =>
  //       article.id ? article : { ...article, id: uuidv4() }
  //     );

  //     setAllArticles(migrated);
  //   } catch (error) {
  //     console.error("Error parsing local storage data:", error);
  //     setAllArticles([]); // Reset on error
  //   }
  // }, []);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const { data } = await getSummary({ articleUrl: article.url });

  //     console.log(data); // Log to inspect the response

  //     if (data?.summary) {
  //       const newArticle = {
  //         ...article,
  //         summary: data.summary,
  //         id: uuidv4(),
  //       };

  //       const updatedAllArticles = [newArticle, ...allArticles];
  //       setAllArticles(updatedAllArticles);
  //       localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
  //       setArticle(newArticle);
  //     } else {
  //       console.error("No summary found in the response");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching or parsing summary data:", error);
  //   }
  // };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const response = await getSummary({ articleUrl: article.url });

  //     if (!response || !response.data) {
  //       console.error("Invalid response from API", response);
  //       setArticle({
  //         ...article,
  //         summary: "Error fetching summary. Please try again.",
  //       });
  //       return;
  //     }

  //     console.log("API Response Data:", response.data);

  //     const summaryText = response.data?.summary || "No summary available.";

  //     const newArticle = {
  //       ...article,
  //       summary: summaryText,
  //       id: uuidv4(),
  //     };

  //     setAllArticles([newArticle, ...allArticles]);
  //     localStorage.setItem(
  //       "articles",
  //       JSON.stringify([newArticle, ...allArticles])
  //     );
  //     setArticle(newArticle);
  //   } catch (err) {
  //     console.error("Unexpected error:", err);
  //     setArticle({ ...article, summary: "An unexpected error occurred." });
  //   }
  // };

  // Updated Demo component handleSubmit function
  //   const handleSubmit = async (e) => {
  //     e.preventDefault();

  //     // Check that the URL is valid
  //     if (!article.url || typeof article.url !== "string") {
  //       console.error("Article URL is invalid.");
  //       return;
  //     }

  //     // Call the getSummary API with the article URL
  //     const response = await getSummary({ articleText: article.url });

  //     if (response.error) {
  //       console.error("API Error:", response.error);
  //     } else {
  //       // Handle successful summary response
  //       console.log("Summary:", response.data.summary);
  //     }

  // console.log("Summary:", response.data[0]?.summary_text);
  //   };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Check that the URL is valid
  //   if (!article.url || typeof article.url !== "string") {
  //     console.error("Article URL is invalid.");
  //     return;
  //   }

  //   // Call the getSummary API with the article URL
  //   const response = await getSummary({ articleText: article.url });

  //   if (response.error) {
  //     console.error("API Error:", response.error);
  //   } else {
  //     // Get the summary_text from response data
  //     const summaryText = response.data[0]?.summary_text;

  //     if (summaryText) {
  //       // Update the state with the summary
  //       setArticle({
  //         ...article,
  //         summary: summaryText,
  //       });
  //     } else {
  //       console.error("No summary text found in the response");
  //     }
  //   }
  // };

  useEffect(() => {
    try {
      const storedArticles = localStorage.getItem("articles");
      const articles = storedArticles ? JSON.parse(storedArticles) : [];

      const migrated = articles.map((article) =>
        article.id ? article : { ...article, id: uuidv4() }
      );

      setAllArticles(migrated);
    } catch (error) {
      console.error("Error parsing local storage data:", error);
      setAllArticles([]); // Reset on error
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check that the URL is valid
    if (!article.url || typeof article.url !== "string") {
      console.error("Article URL is invalid.");
      return;
    }

    let retryCount = 0;
    const maxRetries = 3;
    let response;

    while (retryCount < maxRetries) {
      try {
        response = await getSummary({ articleText: article.url });

        if (response.error) {
          console.error("API Error:", response.error);
          break;
        }

        const summaryText = response.data?.summary || "No summary available.";

        const newArticle = {
          ...article,
          summary: summaryText,
          id: uuidv4(),
        };

        const updatedArticles = [newArticle, ...allArticles];
        setAllArticles(updatedArticles);
        localStorage.setItem("articles", JSON.stringify(updatedArticles));
        setArticle(newArticle);
        break; // Exit loop after successful request
      } catch (error) {
        retryCount++;
        console.error(`Attempt ${retryCount} failed:`, error);

        if (retryCount === maxRetries) {
          console.error("Max retries reached. Please try again later.");
          // Optionally, you can show a user-friendly message here.
        } else {
          console.log("Retrying...");
          // Wait for a short period before retrying
          await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay
        }
      }
    }
  };

  const handleCopy = (text) => {
    setCopied(text);
    navigator.clipboard.writeText(text);
    setTimeout(() => setCopied(""), 3000);
  };

  const handleDelete = (id) => {
    const updated = allArticles.filter((article) => article.id !== id);
    setAllArticles(updated);
    localStorage.setItem("articles", JSON.stringify(updated));

    // Clear current article if deleted
    if (article.id === id) setArticle({ url: "", summary: "" });
  };

  return (
    <section className="mt-16 w-full max-w-xl">
      <div className="flex flex-col w-full gap-2">
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="link icon"
            className="absolute left-0 my-2 ml-3 w-5"
          />
          <input
            type="url"
            placeholder="Enter An Article URL"
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            required
            className="block w-full rounded-md border border-gray-400 bg-black text-white py-2.5 pl-8 pr-12 shadow-lg font-satoshi font-medium focus:border-black focus:outline-none focus:ring-0 peer"
          />
          <button
            type="submit"
            className="hover:border-gray-300 hover:text-gray-300 absolute inset-y-0 right-0 my-1.5 mr-1.5 flex w-10 items-center justify-center rounded border border-gray-200 font-sans text-xl font-medium text-gray-400 peer-focus:border-gray-100 peer-focus:text-gray-100"
          >
            <SendHorizontal />
          </button>
        </form>

        <div
          className="flex flex-col gap-1 max-h-[11rem] overflow-y-auto"
          id="scrollbar"
        >
          {allArticles.map((item) => (
            <div
              key={`link-${item.id}`}
              className="flex items-center justify-between relative p-3 flex-row gap-3 cursor-pointer mr-2 rounded-lg border border-gray-800 bg-black/50 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur "
            >
              <div
                onClick={() => setArticle(item)}
                className="flex-1 overflow-hidden "
              >
                <p className="font-satoshi text-blue-700 font-medium text-sm truncate link_text pl-8">
                  {item.url}
                </p>
              </div>

              <div
                className="w-7 h-7 rounded-full bg-white/10 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur flex justify-center items-center cursor-pointer absolute left-2 right-0"
                onClick={() => handleCopy(item.url)}
              >
                <img
                  src={copied === item.url ? tick : copy}
                  alt="copy_icon"
                  className="w-[50%] h-[50%] object-contain"
                />
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-500"
              >
                <Trash2 size={18} strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="my-10 w-full max-w-full flex justify-center items-center">
        {isFetching ? (
          <span className="loader"></span>
        ) : error ? (
          <p className="font-inter font-bold text-red-500 text-center">
            Well, that was not supposed to happen ..
            <br />
            <span className="font-satoshi font-normal text-gray-400">
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-3 relative w-[98%] md:w-full">
              <h2 className="font-satoshi font-bold text-gray-300 text-xl">
                Article
                <span className="font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Summary
                </span>
              </h2>
              <div className="rounded-xl border border-gray-800 bg-black/50 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur p-4 ">
                {/* Typing Effect with paragraphs separated by newlines */}
                <p className="font-inter font-medium text-sm text-gray-200 leading-relaxed whitespace-pre-wrap my-[.8em] white-space-pre break-words">
                  <Typewriter
                    words={[article.summary]}
                    loop={1}
                    typeSpeed={10}
                    deleteSpeed={10}
                    delaySpeed={500}
                  />
                </p>

                {/* Copy Button for Summary */}
                <div
                  className="w-7 h-7 rounded-full bg-white/10 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur flex justify-center items-center cursor-pointer absolute top-2 right-2"
                  onClick={() => handleCopy(article.summary)}
                >
                  <img
                    src={copied === article.summary ? tick : copy}
                    alt="copy_icon"
                    className="w-5 h-5 object-contain"
                  />
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;
