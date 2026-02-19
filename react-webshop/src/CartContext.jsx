import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext'; // JAVÍTÁS: Behozzuk a felhasználó adatait!

export const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useContext(AuthContext); // Lekérjük, hogy be van-e lépve valaki

  // JAVÍTÁS: Dinamikus kulcs generálása. Mindenkinek saját kosara lesz!
  const getCartKey = () => {
    return user ? `snkrs_cart_${user.id || user.Id}` : 'snkrs_cart_guest';
  };

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 1. Amikor a USER megváltozik (belép vagy kilép), betöltjük az Ő kosarát!
  useEffect(() => {
    const savedCart = localStorage.getItem(getCartKey());
    setCart(savedCart ? JSON.parse(savedCart) : []);
  }, [user]); // Ez a kulcsszó: ha változik a user, lefut újra!

  // 3. Függvény: Termék kosárba tétele
  const addToCart = (product, size, quantity) => {
    
    const actualMainImage = product.mainImage || product.MainImage || product.main_image;
    const validImage = actualMainImage || (product.images && product.images[0]) || '/img/placeholder.webp';
    const productId = product.id || product.Id;

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => (item.id === productId || item.Id === productId) && item.size === size
      );

      let newCart;
      if (existingItem) {
        newCart = prevCart.map((item) =>
          (item.id === productId || item.Id === productId) && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCart = [...prevCart, { 
            ...product, 
            id: productId,
            size, 
            quantity,
            images: [validImage]
        }];
      }
      
      // JAVÍTÁS: Azonnali mentés a felhasználó SAJÁT fiókjába
      localStorage.setItem(getCartKey(), JSON.stringify(newCart));
      return newCart;
    });
    
    setIsCartOpen(true);
  };

  // 4. Elem törlése a kosárból
  const removeFromCart = (productId, size) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter(item => !((item.id === productId || item.Id === productId) && item.size === size));
      localStorage.setItem(getCartKey(), JSON.stringify(newCart)); // Mentés frissítése
      return newCart;
    });
  };

  // 5. Kosár teljes ürítése (Rendelés után)
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(getCartKey());
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (Number(item.price || item.Price) * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
        cart, addToCart, removeFromCart, clearCart, cartCount, cartTotal, isCartOpen, setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}