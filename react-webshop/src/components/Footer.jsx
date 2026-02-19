export default function Footer() {
  return (
    <footer className="main-footer">
        <div className="footer-container">
            <div className="footer-col">
                <h3 className="logo">SNKRS<span>STORE</span></h3>
                <p><strong>Cím:</strong> Miskolc Palóczy László utca 3.</p>
                <p><strong>Telefon:</strong> +36 30 881 3082</p>
                <p><strong>E-mail:</strong> info@snkrsstore.hu</p>
                <div className="social-links">
                    <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                    <a href="#"><i className="fa-brands fa-instagram"></i></a>
                    <a href="#"><i className="fa-brands fa-tiktok"></i></a>
                </div>
            </div>

            <div className="footer-col">
                <h4>Vásárlás</h4>
                <ul>
                    <li><a href="#">Összes termék</a></li>
                    <li><a href="#">Újdonságok</a></li>
                    <li><a href="#">Akciók</a></li>
                    <li><a href="#">Mérettáblázat</a></li>
                </ul>
            </div>

            <div className="footer-col">
                <h4>Információk</h4>
                <ul>
                    <li><a href="#">Rólunk</a></li>
                    <li><a href="#">Szállítási információk</a></li>
                    <li><a href="#">Általános Szerződési Feltételek</a></li>
                    <li><a href="#">Adatkezelési tájékoztató</a></li>
                </ul>
            </div>

            <div className="footer-col">
                <h4>Hírlevél</h4>
                <p>Iratkozz fel, hogy ne maradj le az új dropokról!</p>
                <form className="newsletter-form">
                    <input type="email" placeholder="E-mail címed" required />
                    <button type="submit">Feliratkozás</button>
                </form>
            </div>
        </div>
        <div className="footer-bottom">
            <p>&copy; 2026 SNKRSSTORE - Minden jog fenntartva.</p>
        </div>
    </footer>
  );
}