import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products as backupProducts } from '../products';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5074/api/Products');
        if (!response.ok) throw new Error("Hiba a szerver elérésekor");
        
        const dbData = await response.json();
        
        if (Array.isArray(dbData) && dbData.length > 0) {
          // --- HIBRID TRÜKK BEÉPÍTÉSE ---
          const mergedProducts = dbData.map(dbItem => {
             // C# kompatibilis ID keresés
             const dbId = dbItem.id || dbItem.Id; 
             const localItem = backupProducts.find(p => p.id === dbId);
             
             return {
                 ...dbItem,
                 id: dbId, // Szabványosítjuk az id-t kisbetűsre
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

  const featuredProducts = products.slice(0, 3);

  return (
    <main>
      <section className="hero">
          <div className="hero-content">
              <h1>Magyarország legnagyobb <br /> <span>streetwear</span> webshopja</h1>
              <p>A legritkább ruhamárkák egy helyen. Nézz szét nyugodtan!</p>
              <Link to="/webshop" className="btn-primary">Shop</Link>
          </div>
      </section>

      <section className="products" id="products">
          <div className="section-title">
              <h2>Termékeink</h2>
              <p>Legfelkapott sneakerek</p>
          </div>
          
          {loading ? (
              <div style={{textAlign: 'center', padding: '50px', fontSize: '1.2rem'}}>Betöltés...</div>
          ) : (
              <div className="product-grid">
                  {featuredProducts.map((product) => {
                      // A hibrid trükk miatt most már biztosan van 'images' tömbünk, így elég csak az elsőt lekérni:
                      const imageSrc = product.images[0];

                      return (
                          <div className="product-card" key={product.id}>
                              <Link to={`/termek/${product.id}`}>
                                  <div className="img-container">
                                      <img src={imageSrc} alt={product.name || product.Name} />
                                  </div>
                              </Link>

                              <div className="product-info">
                                  <span className="brand-name">SNKRSSTORE</span>
                                  
                                  <Link to={`/termek/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                      <h3 className="model-name">{product.name || product.Name}</h3>
                                  </Link>
                                  
                                  <div className="product-footer">
                                      <p className="price">{Number(product.price || product.Price).toLocaleString('hu-HU')} FT</p>
                                      
                                      <Link to={`/termek/${product.id}`}>
                                          <i className="fa-solid fa-cart-shopping cart-btn-icon"></i>
                                      </Link>
                                  </div>
                              </div>
                          </div>
                      );
                  })}
              </div>
          )}
      </section>
    </main>
  );
}