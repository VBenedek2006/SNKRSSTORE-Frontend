import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// Oldalak importálása
import Home from './pages/Home';
import Webshop from './pages/Webshop';
import TermekReszletek from './pages/TermekReszletek';
import Checkout from './pages/Checkout';
import AuthPage from './pages/AuthPage';
import Rolunk from './pages/Rolunk';      
import Kapcsolat from './pages/Kapcsolat'; 

// --- ÚJ RÉSZ: A Tervező importálása ---
import Tervezo from './pages/Tervezo';
// --------------------------------------

// Context-ek (Az Agyak)
import { CartProvider } from './CartContext'; 
import { AuthProvider } from './AuthContext'; 
import CartSidebar from './components/CartSidebar'; 

function App() {
  return (
    // 3. FONTOS: Itt az AuthProvider a legkülső burok!
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Header />
          <CartSidebar />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/webshop" element={<Webshop />} />
            <Route path="/termek/:id" element={<TermekReszletek />} />
            <Route path="/penztar" element={<Checkout />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/rolunk" element={<Rolunk />} />
            <Route path="/kapcsolat" element={<Kapcsolat />} />
            
            {/* --- ÚJ RÉSZ: A Tervező útvonala --- */}
            <Route path="/tervezo" element={<Tervezo />} />
            
          </Routes>
          
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;