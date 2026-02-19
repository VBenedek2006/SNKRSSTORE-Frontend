export default function Kapcsolat() {
  
  const handleSend = (e) => {
    e.preventDefault();
    alert("Üzenet elküldve!");
  };

  return (
    <div className="contact-page" style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto', color: '#fff' }}>
      
      {/* CÍMSOR */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', textTransform: 'uppercase', marginBottom: '10px' }}>
          Lépj <span style={{ color: '#4facfe' }}>Kapcsolatba</span>
        </h1>
        <p style={{ color: '#aaa', maxWidth: '600px', margin: '0 auto' }}>
          Segítségre van szükséged a méretezéssel? Vagy csak kérdeznél egy drop-ról? Írj nekünk bátran!
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '50px', justifyContent: 'center' }}>
        
        {/* BAL OLDAL: ELÉRHETŐSÉGEK (Kártyás stílusban) */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          
          <div style={{ background: '#111', padding: '25px', borderRadius: '15px', marginBottom: '20px', border: '1px solid #222' }}>
            <i className="fa-solid fa-location-dot" style={{ color: '#4facfe', fontSize: '24px', marginBottom: '15px' }}></i>
            <h3 style={{ fontSize: '18px', marginBottom: '5px' }}>Üzletünk</h3>
            <p style={{ color: '#888', margin: 0 }}>Miskolc, Palóczy László utca 3, 3525</p>
          </div>

          <div style={{ background: '#111', padding: '25px', borderRadius: '15px', marginBottom: '20px', border: '1px solid #222' }}>
            <i className="fa-solid fa-envelope" style={{ color: '#4facfe', fontSize: '24px', marginBottom: '15px' }}></i>
            <h3 style={{ fontSize: '18px', marginBottom: '5px' }}>Email</h3>
            <p style={{ color: '#888', margin: 0 }}>info@snkrsstore.hu</p>
          </div>

          <div style={{ background: '#111', padding: '25px', borderRadius: '15px', border: '1px solid #222' }}>
            <i className="fa-solid fa-phone" style={{ color: '#4facfe', fontSize: '24px', marginBottom: '15px' }}></i>
            <h3 style={{ fontSize: '18px', marginBottom: '5px' }}>Telefon</h3>
            <p style={{ color: '#888', margin: 0 }}>+36 30 881 3082</p>
          </div>

        </div>

        {/* JOBB OLDAL: SÖTÉT ŰRLAP */}
        <div style={{ flex: '1.5', minWidth: '300px', background: '#111', padding: '40px', borderRadius: '20px', border: '1px solid #222' }}>
          <h2 style={{ marginBottom: '30px', fontSize: '24px' }}>Üzenet küldése</h2>
          
          <form onSubmit={handleSend}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#aaa', fontSize: '14px', marginBottom: '8px', display: 'block' }}>Neved</label>
              <input 
                type="text" 
                placeholder="Teljes név" 
                style={{ width: '100%', padding: '15px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none' }} 
                required 
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#aaa', fontSize: '14px', marginBottom: '8px', display: 'block' }}>E-mail címed</label>
              <input 
                type="email" 
                placeholder="pelda@email.com" 
                style={{ width: '100%', padding: '15px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none' }} 
                required 
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ color: '#aaa', fontSize: '14px', marginBottom: '8px', display: 'block' }}>Üzenet</label>
              <textarea 
                rows="5" 
                placeholder="Miben segíthetünk?" 
                style={{ width: '100%', padding: '15px', background: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none', resize: 'none' }} 
                required
              ></textarea>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '15px', fontSize: '16px', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer', background: '#4facfe', border: 'none', color: '#fff' }}>
              Üzenet Küldése
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}