import { useState } from "react";
import { useEffect } from "react";
import "./App.css";

const CATEGORIES = [
  "wisdom", "philosophy", "life", "truth", "inspirational", "relationships",
  "love", "faith", "humor", "success", "courage", "happiness",
  "art", "writing", "fear", "nature", "time", "freedom", "death", "leadership"
];

function App() {
  const [quote, setQuote] = useState(null);

  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(false);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const addFavorite = (quoteObj) => {
    if (favorites.some(fav => fav.quote === quoteObj.quote)) {
      return;
    }
      setFavorites([...favorites, quoteObj]);
  };

  const removeFavorite = (quoteText) => {
    setFavorites(favorites.filter(fav => fav.quote !== quoteText));
  };



  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);


  useEffect(() => {
    const sun = document.querySelector(".sun");

    const handleMouseMove = (e) => {
      const moveX = e.clientX * 0.02; 
      const moveY = e.clientY * 0.02;

      sun.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const fetchQuote = async (cat) => {
    setCategory(cat);
    setLoading(true);

    try {
      const excludeList = CATEGORIES.filter(c => c !== cat).join(",");
      const response = await fetch(
        `https://api.api-ninjas.com/v2/randomquotes?category=${cat}&exclude_categories=${excludeList}`,
        {
          headers: {
            "X-Api-Key": import.meta.env.VITE_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setQuote(data[0]);
    } catch (error) {
      console.error("Error fetching quote:", error);
    }

    setLoading(false);
  };

  return (
    <>
    <div className="sun"></div>
    <div className="sun-rays"></div>

    <div className="cloud cloud-1"></div>
    <div className="cloud cloud-2"></div>
    <div className="cloud cloud-3"></div>
    <div className="cloud cloud-4"></div>
    <div className="cloud cloud-5"></div>


    <div className="dashboard">
      <h1 className="dashboard-title">What kind of quote would you like?</h1>

      <div className="button-grid">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${category === cat ? "active" : ""}`}
            onClick={() => fetchQuote(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <p className="loading">Loading...</p>}

      {!loading && quote && (
        <div className="quote-card">
          <p className="quote-text">"{quote.quote}"</p>
          <p className="quote-author">— {quote.author}</p>

          <button className="favorite-btn" onClick={() => addFavorite(quote)}>
            Add to Favorites
          </button>
        </div>
      )}

      {favorites.length > 0 && (
        <div className="favorites-section">
          <h2 className="favorites-title">Your Favorites</h2>

          <div className="favorites-grid">
            {favorites.map((fav, i) => (
              <div className="favorite-card" key={i}>
                <p className="favorite-quote">"{fav.quote}"</p>
                <p className="favorite-author">— {fav.author}</p>

                <button className="remove-btn" onClick={() => removeFavorite(fav.quote)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>g
    </>
  );
}

export default App;