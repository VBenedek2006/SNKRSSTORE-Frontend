import { Link } from 'react-router-dom';

export default function Rolunk() {
  return (
    <div className="page-container" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
      <div className="about-hero" style={{ marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>A STREETWEAR <span style={{ color: '#6c5ce7' }}>OTTHONA</span></h1>
        <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '800px', margin: '0 auto' }}>
          A SNKRSSTORE nem csak egy webshop. Ez egy közösség azoknak, akik nem érik be az átlagossal.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
        <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '10px' }}>
          <h3>100% Eredetiség</h3>
          <p style={{ color: '#777' }}>Minden egyes terméket szakértőink vizsgálnak át.</p>
        </div>
        <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '10px' }}>
          <h3>Limitált Kiadások</h3>
          <p style={{ color: '#777' }}>A legritkább kollekciók egy helyen.</p>
        </div>
        <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '10px' }}>
          <h3>Gyors Szállítás</h3>
          <p style={{ color: '#777' }}>Raktáron lévő termékeinket azonnal küldjük.</p>
        </div>
      </div>

      <div style={{ marginTop: '80px' }}>
        <Link to="/webshop" className="btn-primary" style={{ display: 'inline-block', padding: '10px 20px', background: 'black', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          Irány a Webshop
        </Link>
      </div>
    </div>
  );
}