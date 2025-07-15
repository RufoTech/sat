// src/Favorite.jsx
import React, { useEffect, useState } from "react";
import { useFavorites } from "./FavoriteContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./Firebase";

export default function FavoriteList() {
  const { favorites, loadingFavs } = useFavorites();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      try {
        const proms = favorites.map(async (fav) => {
          if (!fav.id) return null;
          const prodDocRef = doc(db, "products", fav.id);
          const snap = await getDoc(prodDocRef);
          if (snap.exists()) return { id: snap.id, ...snap.data() };
          return null;
        });
        const results = await Promise.all(proms);
        // undefined və null-ları filter edirik
        setProducts(results.filter((p) => p));
      } catch (error) {
        console.error("Error fetching favorite products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    if (!loadingFavs) {
      fetchFavoriteProducts();
    }
  }, [favorites, loadingFavs]);

  if (loadingFavs || loadingProducts) {
    return <p>Yüklənir...</p>;
  }

  if (products.length === 0) {
    return <p>Heç bir favorit məhsul tapılmadı.</p>;
  }

  return (
    <div>
      <h2>Favori Məhsullar</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {products.map((prod) => (
          <li
            key={prod.id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
              border: "1px solid #eee",
              padding: "0.5rem",
              borderRadius: "8px",
            }}
          >
            {/* Şəkil */}
            {prod.imageUrls && prod.imageUrls.length > 0 && (
              <img
                src={prod.imageUrls[0]}
                alt={prod.name}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "4px",
                  marginRight: "1rem",
                }}
              />
            )}
            {/* Məhsul məlumatı */}
            <div>
              <h3 style={{ margin: 0 }}>{prod.name}</h3>
              <p style={{ margin: "0.25rem 0 0" }}>Qiymət: {prod.price} ₼</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
