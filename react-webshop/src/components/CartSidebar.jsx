import { useContext } from 'react';
import { CartContext } from '../CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartSidebar() {
  const { cart, removeFromCart, cartTotal, isCartOpen, setIsCartOpen } = useContext(CartContext);
  
  const navigate = useNavigate();

  return (
    <>
      <div 
        className={`cart-overlay ${isCartOpen ? 'open' : ''}`} 
        onClick={() => setIsCartOpen(false)}
      ></div>

      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Kosarad</h3>
          <span className="close-cart" onClick={() => setIsCartOpen(false)}>
            <i className="fa-solid fa-xmark"></i>
          </span>
        </div>
        
        <div className="cart-items" id="cart-items-container">
          {cart.length === 0 ? (
            <p style={{ color: '#fff', textAlign: 'center', marginTop: '20px' }}>A kosarad jelenleg üres.</p>
          ) : (
            cart.map((item, index) => (
              <div className="sidebar-item" key={index}>
                <img src={item.images[0]} alt={item.name} />
                <div className="sidebar-item-info" style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '13px', marginBottom: '5px' }}>{item.name}</h4>
                  <p style={{ color: 'var(--text-gray)', fontSize: '11px', margin: 0 }}>Méret: {item.size}</p>
                  <p style={{ color: 'var(--accent-blue)', fontSize: '13px', fontWeight: 'bold', margin: '5px 0 0' }}>
                    {/* BIZTONSÁGI JAVÍTÁS: Number() beletéve */}
                    {item.quantity} x {Number(item.price).toLocaleString('hu-HU')} FT
                  </p>
                </div>
                <i 
                  className="fa-solid fa-trash remove-btn" 
                  onClick={() => removeFromCart(item.id, item.size)}
                  style={{ alignSelf: 'center', cursor: 'pointer', color: '#ff4444' }}
                ></i>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span>Összesen:</span>
            <span>{cartTotal.toLocaleString('hu-HU')} Ft</span>
          </div>
          
          <button 
            className="btn-checkout" 
            style={{ backgroundColor: '#1ab60c' }}
            onClick={() => {
              setIsCartOpen(false); 
              navigate('/penztar'); 
            }}
          >
            Tovább a pénztárhoz
          </button>
        </div>
      </div>
    </>
  );
}