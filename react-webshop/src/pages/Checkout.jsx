import { useContext, useState } from 'react';
import { CartContext } from '../CartContext';
import { AuthContext } from '../AuthContext'; 
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
    const { cart, cartTotal, clearCart } = useContext(CartContext); 
    const { user } = useContext(AuthContext); 
    const navigate = useNavigate();
    
    const [paymentMethod, setPaymentMethod] = useState('bankcard');
    
    const shippingCost = paymentMethod === 'utanvet' ? 500 : 0;
    const finalTotal = cartTotal + shippingCost;

    const [formData, setFormData] = useState({
        email: user ? user.email : '', 
        lastname: '',
        firstname: '',
        address: '',
        zip: '',
        city: '',
        phone: '',
        cardNumber: '',
        cardExpiry: '',
        cardCvc: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- RENDELÉS LEADÁSA (C# Backendhez kötve) ---
    const handleOrder = async () => {
        // 1. Biztonsági ellenőrzések
        if (cart.length === 0) {
            alert("A kosarad üres! Nem tudsz rendelést leadni.");
            return;
        }

        if (!user) {
            alert("A rendelés leadásához kérlek jelentkezz be!");
            navigate('/login');
            return;
        }

        if (!formData.lastname || !formData.firstname || !formData.address || !formData.zip || !formData.city || !formData.phone) {
            alert("Kérlek, töltsd ki az összes szállítási adatot!");
            return;
        }

        if (paymentMethod === 'bankcard') {
            if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvc) {
                alert("Kérlek, add meg a bankkártya adatait!");
                return;
            }
        }

        // 2. Cím adatcsomag a C# AddressesController-nek
        const addressPayload = {
            userId: user.id || user.Id, // Attól függően, hogy a C# kis vagy nagybetűvel adta vissza
            street: formData.address,
            city: formData.city,
            zip: formData.zip,
            country: "Magyarország"
        };

        // 3. Rendelés adatcsomag a C# OrdersController-nek
        const orderPayload = {
            userId: user.id || user.Id,
            status: "pending"
            // Megjegyzés: Ha a C# modelled (Order.cs) vár TotalPrice-t is, azt itt adhatod hozzá:
            // totalPrice: finalTotal
        };

        try {
            console.log("Cím mentése a C# szerveren...");
            
            // --- 1. LÉPÉS: Cím beküldése ---
            const addressResponse = await fetch('http://localhost:5074/api/Addresses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addressPayload)
            });

            if (!addressResponse.ok) {
                throw new Error("Hiba a szállítási cím mentésekor!");
            }

            console.log("Rendelés rögzítése a C# szerveren...");

            // --- 2. LÉPÉS: Rendelés beküldése ---
            const orderResponse = await fetch('http://localhost:5074/api/Orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload)
            });

            if (!orderResponse.ok) {
                throw new Error("Hiba a rendelés mentésekor!");
            }

            // --- SIKERES BEFEJEZÉS ---
            alert("Sikeres rendelés! Köszönjük a vásárlást.");
            clearCart(); 
            navigate('/');

        } catch (error) {
            console.error("Hiba:", error);
            alert("Hiba történt a rendelés leadása közben. Ellenőrizd a szerver kapcsolatot!");
        }
    };

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                
                {/* BAL OLDAL: ŰRLAPOK */}
                <div className="checkout-form-section">
                    <h1>Pénztár</h1>
                    
                    <div className="form-group-block">
                        <h3>Kapcsolattartás</h3>
                        <div className="form-row">
                            <input 
                                type="email" 
                                name="email"
                                placeholder="E-mail cím" 
                                className="full-width" 
                                value={formData.email}
                                onChange={handleChange}
                                disabled={!!user} 
                                style={{ backgroundColor: user ? '#e9ecef' : 'white' }}
                            />
                        </div>
                    </div>

                    <div className="form-group-block">
                        <h3>Szállítási adatok</h3>
                        <div className="form-row">
                            <input type="text" name="lastname" placeholder="Vezetéknév" className="half-width" value={formData.lastname} onChange={handleChange} />
                            <input type="text" name="firstname" placeholder="Keresztnév" className="half-width" value={formData.firstname} onChange={handleChange} />
                        </div>
                        <div className="form-row">
                            <input type="text" name="address" placeholder="Utca, házszám" className="full-width" value={formData.address} onChange={handleChange} />
                        </div>
                        <div className="form-row">
                            <input type="text" name="zip" placeholder="Irányítószám" className="half-width" value={formData.zip} onChange={handleChange} />
                            <input type="text" name="city" placeholder="Város" className="half-width" value={formData.city} onChange={handleChange} />
                        </div>
                        <div className="form-row">
                            <input type="tel" name="phone" placeholder="Telefonszám" className="full-width" value={formData.phone} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-group-block">
                        <h3>Fizetési mód</h3>
                        <div className="payment-options">
                            <label className="payment-option">
                                <input type="radio" name="payment" value="bankcard" checked={paymentMethod === 'bankcard'} onChange={() => setPaymentMethod('bankcard')} />
                                Bankkártya (SimplePay)
                            </label>

                            {paymentMethod === 'bankcard' && (
                                <div style={{ padding: '15px', background: '#fcfcfc', border: '1px solid #ddd', borderRadius: '5px', marginTop: '-5px', marginBottom: '10px' }}>
                                    <div className="form-row">
                                        <input type="text" name="cardNumber" placeholder="Kártyaszám" className="full-width" value={formData.cardNumber} onChange={handleChange} />
                                    </div>
                                    <div className="form-row">
                                        <input type="text" name="cardExpiry" placeholder="Lejárati dátum (MM/YY)" className="half-width" value={formData.cardExpiry} onChange={handleChange} />
                                        <input type="text" name="cardCvc" placeholder="CVC" className="half-width" value={formData.cardCvc} onChange={handleChange} />
                                    </div>
                                </div>
                            )}

                            <label className="payment-option">
                                <input type="radio" name="payment" value="utanvet" checked={paymentMethod === 'utanvet'} onChange={() => setPaymentMethod('utanvet')} />
                                Utánvét (+500 Ft)
                            </label>
                        </div>
                    </div>
                    
                    <button 
                        className="btn-submit-order" 
                        onClick={handleOrder}
                        style={{ opacity: cart.length === 0 ? 0.5 : 1, cursor: cart.length === 0 ? 'not-allowed' : 'pointer' }}
                    >
                        Megrendelés elküldése
                    </button>
                </div>

                {/* JOBB OLDAL: ÖSSZEGZÉS */}
                <div className="checkout-summary-section">
                    <div className="summary-card">
                        <h3 style={{ marginBottom: '20px', fontSize: '18px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            Rendelés összegzése
                        </h3>
                        
                        <div className="checkout-items-list">
                            {cart.length === 0 ? (
                                <p style={{ color: '#777' }}>A kosarad üres.</p>
                            ) : (
                                cart.map((item, index) => (
                                    <div className="summary-item" key={index}>
                                        <img src={item.images[0]} alt={item.name} />
                                        <div>
                                            <p>{item.name}</p>
                                            <small>Méret: {item.size} | Mennyiség: {item.quantity}</small>
                                        </div>
                                        <p style={{ fontWeight: 'bold' }}>{(Number(item.price) * item.quantity).toLocaleString('hu-HU')} Ft</p>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="summary-totals">
                            <div className="row">
                                <span>Részösszeg</span>
                                <span>{cartTotal.toLocaleString('hu-HU')} Ft</span>
                            </div>
                            <div className="row">
                                <span>Szállítás</span>
                                <span>{shippingCost === 0 ? 'Ingyenes' : `${shippingCost} Ft`}</span>
                            </div>
                            <div className="row total">
                                <span>Végösszeg</span>
                                <span>{finalTotal.toLocaleString('hu-HU')} Ft</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}