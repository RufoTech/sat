import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "./Firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs, // Bu satırı ekledik
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [subtotal, setSubtotal] = useState(0);

  // Real-time listener for user's cart in Firestore
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setCart([]);
        setLoading(false);
        return;
      }

      const uid = user.uid;
      const cartCollectionRef = collection(db, "users", uid, "cart");

      const unsubscribeSnapshot = onSnapshot(
        cartCollectionRef,
        (snapshot) => {
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCart(items);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching cart:", error);
          setLoading(false);
        }
      );

      return () => unsubscribeSnapshot();
    });

    return () => unsubscribeAuth();
  }, []);

  // Calculate total items and subtotal whenever cart changes
  useEffect(() => {
    const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalItems(itemsCount);
    setSubtotal(totalPrice);
  }, [cart]);

  // Formats subtotal to two decimals
  const getFormattedSubtotal = () => subtotal.toFixed(2);

  // Add or update item in cart
  const addToCart = async (product, quantity = 1) => {
    const user = auth.currentUser;
    if (!user) throw new Error("You must be logged in");
    const uid = user.uid;
    const cartItemRef = doc(db, "users", uid, "cart", product.id);

    const snap = await getDoc(cartItemRef);
    if (snap.exists()) {
      await updateDoc(cartItemRef, {
        quantity: snap.data().quantity + quantity,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(cartItemRef, {
        name: product.name,
        price: product.price,
        imageUrls: product.imageUrls || [],
        quantity,
        addedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    const user = auth.currentUser;
    if (!user) throw new Error("You must be logged in");
    const uid = user.uid;
    const cartItemRef = doc(db, "users", uid, "cart", productId);
    await deleteDoc(cartItemRef);
  };

  // Update item quantity in cart
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    const user = auth.currentUser;
    if (!user) throw new Error("You must be logged in");
    const uid = user.uid;
    const cartItemRef = doc(db, "users", uid, "cart", productId);
    await updateDoc(cartItemRef, {
      quantity,
      updatedAt: serverTimestamp(),
    });
  };

  // Clear entire cart
  const clearCart = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("You must be logged in");
    const uid = user.uid;
    const cartCollectionRef = collection(db, "users", uid, "cart");
    
    try {
      const batch = writeBatch(db);
      const snapshot = await getDocs(cartCollectionRef);
      
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        totalItems,
        subtotal,
        getFormattedSubtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);