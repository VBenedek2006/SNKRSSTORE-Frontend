import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products as backupProducts } from '../products';

export default function Webshop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Összes');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5074/api/Products');
        if (!response.ok) throw new Error("Hálózati hiba");
        
        const dbData = await response.json();
        
        if (Array.isArray(dbData) && dbData.length > 0) {
          // --- HIBRID TRÜKK: Összefűzzük a DB adatokat a helyi képekkel/méretekkel ---
          const mergedProducts = dbData.map(dbItem => {
             // Megnézzük, hogy kisbetűs vagy nagybetűs-e az ID a C# miatt
             const dbId = dbItem.id || dbItem.Id; 
             
             // Megkeressük a régi JS fájlban a cipőt az ID alapján
             const localItem = backupProducts.find(p => p.id === dbId);
             
             return {
                 ...dbItem,
                 id: dbId, // Szabványosítjuk az ID-t
                 // Ha megtalálja a régi fájlban, beteszi a képeit és méreteit, különben ad egy alapértelmezettet
                 images: localItem && localItem.images ? localItem.images : ['/img/placeholder.webp'],
                 sizes: localItem && localItem.sizes ? localItem.sizes : ['40', '41', '42', '43', '44']
             };
          });
          setProducts(mergedProducts); 
        } else {
          setProducts(backupProducts); 
        }
      } catch (error) {
        setProducts(backupProducts); 
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    if (activeFilter === 'Összes') return true;
    
    // Itt már biztosan a hibrid méreteket használjuk
    let sizes = product.sizes || [];
    if (typeof sizes === 'string') {
        sizes = sizes.split(',').map(s => s.trim());
    }
    
    const isClothing = Array.isArray(sizes) && (sizes.includes('S') || sizes.includes('M') || sizes.includes('L')); 
    if (activeFilter === 'Sneakerek') return !isClothing;
    if (activeFilter === 'Ruházat') return isClothing;
    return true;
  });

  if (loading) return <div style={{textAlign: 'center', padding: '100px'}}>Termékek betöltése...</div>;

  return (
    <section className="webshop-container">
      <div className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '20px' }}>Webshop</h2>
        <div className="filter-buttons" style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
          {['Összes', 'Sneakerek', 'Ruházat'].map((category) => (
             <button 
                key={category}
                className={activeFilter === category ? 'btn-filter active' : 'btn-filter'}
                onClick={() => setActiveFilter(category)}
                style={activeFilter === category ? activeStyle : inactiveStyle}
              >
                {category}
              </button>
          ))}
        </div>
      </div>

      <div className="product-grid">
        {filteredProducts.map((shoe) => {
            // Mivel a hibrid trükk garantálja az images tömböt, ezt már nagyon egyszerű lekérni:
            const imageSrc = shoe.images[0];

            return (
              <div className="product-card" key={shoe.id}>
                <Link to={`/termek/${shoe.id}`}>
                  <div className="img-container">
                    <img src={imageSrc} alt={shoe.name || shoe.Name} />
                  </div>
                </Link>
                <div className="product-info">
                  <span className="brand-name">SNKRSSTORE</span>
                  <Link to={`/termek/${shoe.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 className="model-name">{shoe.name || shoe.Name}</h3>
                  </Link>
                  <div className="product-footer">
                    <p className="price">{Number(shoe.price || shoe.Price).toLocaleString('hu-HU')} FT</p>
                    <Link to={`/termek/${shoe.id}`}>
                        <i className="fa-solid fa-cart-shopping cart-btn-icon"></i>
                    </Link>
                  </div>
                </div>
              </div>
            );
        })}
      </div>
    </section>
  );
}

const inactiveStyle = { padding: '10px 25px', borderRadius: '25px', border: '1px solid #333', backgroundColor: 'transparent', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: '0.3s' };
const activeStyle = { ...inactiveStyle, backgroundColor: '#00d2ff', color: '#000', border: '1px solid #00d2ff' };