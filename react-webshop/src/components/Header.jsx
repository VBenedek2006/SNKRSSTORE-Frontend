import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../CartContext';
import { AuthContext } from '../AuthContext'; // <--- ÚJ IMPORT

export default function Header() {
  const location = useLocation();
  const { cartCount, setIsCartOpen } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext); // <--- ÚJ ADATOK

  return (
    <header>
        <nav className="navbar">
            <div className="logo"><Link to="/">SNKRS<span>STORE</span></Link></div>
            <ul className="nav-links">
                <li><Link to="/" className={location.pathname === '/' ? "active" : ""}>Főoldal</Link></li>
                <li><Link to="/webshop" className={location.pathname.includes('/webshop') ? "active" : ""}>Webshop</Link></li>
                <li><Link to="/rolunk" className={location.pathname === '/rolunk' ? "active" : ""}>Rólunk</Link></li>
                <li><Link to="/kapcsolat" className={location.pathname === '/kapcsolat' ? "active" : ""}>Kapcsolat</Link></li>
            </ul>
            <div className="nav-icons"> 
                
                {/* --- BEJELENTKEZÉS LOGIKA --- */}
                {user ? (
                    // Ha be van lépve, akkor mutatjuk a nevét és kilépési lehetőséget
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <span style={{color: '#fff', fontSize: '14px'}}>Szia, {user.username}!</span>
                        <a href="#" onClick={(e) => { e.preventDefault(); logout(); }} style={{fontSize: '14px', color: '#ff4444'}}>
                            <i className="fa-solid fa-right-from-bracket"></i>
                        </a>
                    </div>
                ) : (
                    // Ha nincs belépve, akkor a login oldalra visszük
                    <Link to="/login"><i className="fa-solid fa-user"></i></Link> 
                )}
                {/* --------------------------- */}

                <a href="#" className="cart-icon" onClick={(e) => { e.preventDefault(); setIsCartOpen(true); }}> 
                    <i className="fa-solid fa-cart-shopping"></i> 
                    <span id="cart-count">{cartCount}</span> 
                </a> 
            </div>
        </nav>
    </header>
  );
}