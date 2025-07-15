import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "./Firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loadingFavs, setLoadingFavs] = useState(true);

  // Favori kontrol fonksiyonu
  const isFavorite = (productId) => {
    return favorites.some((item) => item.id === productId);
  };

  // Kullanıcının favorilerini gerçek zamanlı dinleme
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setFavorites([]);
        setLoadingFavs(false);
        return;
      }

      const uid = user.uid;
      const favsColRef = collection(db, "users", uid, "favorites");

      const unsubscribeSnapshot = onSnapshot(
        favsColRef,
        (snapshot) => {
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setFavorites(items);
          setLoadingFavs(false);
        },
        (error) => {
          console.error("Error fetching favorites:", error);
          setLoadingFavs(false);
        }
      );

      return () => unsubscribeSnapshot();
    });

    return () => unsubscribeAuth();
  }, []);

  // Favoriye ekleme
  const addToFavorites = async (product) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Giriş yapmalısınız");

      const uid = user.uid;
      const favRef = doc(db, "users", uid, "favorites", product.id);

      const snap = await getDoc(favRef);
      if (snap.exists()) {
        await setDoc(favRef, {
          ...snap.data(),
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(favRef, {
          name: product.name,
          price: product.price,
          imageUrls: product.imageUrls || [],
          addedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Favori ekleme hatası:", error);
      // UI katmanına iletmek için hatayı tekrar fırlat
      throw error;
    }
  };

  // Favoriden kaldırma
  const removeFromFavorites = async (productId) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Giriş yapmalısınız");

      const uid = user.uid;
      const favRef = doc(db, "users", uid, "favorites", productId);
      await deleteDoc(favRef);
    } catch (error) {
      console.error("Favori kaldırma hatası:", error);
      throw error;
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loadingFavs,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
