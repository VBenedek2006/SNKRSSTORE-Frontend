import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]); 

  // BIZTONSÁGI ŐR
  useEffect(() => {
    if (!user || user.role?.toLowerCase() !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Adatok lekérése a C# szervertől
  useEffect(() => {
    if (user && user.role?.toLowerCase() === 'admin') {
      fetchData();
    }
  }, [user, activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'products') {
        const res = await fetch('http://localhost:5074/api/Products');
        const data = await res.json();
        setProducts(data);
      } else if (activeTab === 'users') {
        const res = await fetch('http://localhost:5074/api/Users');
        const data = await res.json();
        setUsers(data);
      } else if (activeTab === 'orders') {
        const res = await fetch('http://localhost:5074/api/Orders');
        if (res.ok) {
            const data = await res.json();
            setOrders(data);
        }
      }
    } catch (error) {
      console.error("Hiba az adatok betöltésekor:", error);
    }
  };

  // --- ÁR MÓDOSÍTÁSA ---
  const handleEditPrice = async (product) => {
    const newPrice = prompt(`Add meg az új árat ehhez: ${product.name || product.Name}`, product.price || product.Price);
    
    if (newPrice && !isNaN(newPrice)) {
      const updatedProduct = { ...product, price: Number(newPrice), Price: Number(newPrice) };
      try {
        let res = await fetch(`http://localhost:5074/api/Products`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProduct)
        });
        if (res.status === 404 || res.status === 405) {
            res = await fetch(`http://localhost:5074/api/Products/${product.id || product.Id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProduct)
            });
        }
        if (res.ok) {
          alert("Ár sikeresen frissítve!");
          fetchData(); 
        } else {
          alert("Hiba a mentés során.");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // --- TERMÉK TÖRLÉSE ---
  const handleDeleteProduct = async (id) => {
    if (window.confirm("Biztosan törölni szeretnéd ezt a terméket? A művelet nem vonható vissza!")) {
      try {
        const res = await fetch(`http://localhost:5074/api/Products/${id}`, { method: 'DELETE' });
        if (res.ok) {
          alert("Termék sikeresen törölve!");
          fetchData(); 
        } else {
          alert("Hiba a törlés során!");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // --- ÚJ: JOGOSULTSÁG MÓDOSÍTÁSA LEGÖRDÜLŐVEL ---
  const handleRoleChange = async (u, newRole) => {
    // Biztosíték, hogy ne állítsuk át véletlenül
    if (!window.confirm(`Biztosan módosítod ${u.email || u.Email} rangját erre: ${newRole.toUpperCase()}?`)) {
      return; 
    }

    const updatedUser = { ...u, role: newRole };
    
    try {
      let res = await fetch(`http://localhost:5074/api/Users`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });
      if (res.status === 404 || res.status === 405) {
          res = await fetch(`http://localhost:5074/api/Users/${u.id || u.Id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedUser)
          });
      }
      if (res.ok) {
        alert("Rang sikeresen frissítve!");
        fetchData(); 
      } else {
        alert("Hiba a rang mentése során.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || user.role?.toLowerCase() !== 'admin') return null;

  return (
    <div style={{ display: 'flex', minHeight: '80vh', backgroundColor: '#0a0a0a', color: '#ffffff' }}>
      
      {/* BAL OLDALI MENÜ */}
      <div style={{ width: '250px', backgroundColor: '#111', borderRight: '1px solid #333', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2 style={{ color: '#00d2ff', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Vezérlőpult</h2>
        
        <button onClick={() => setActiveTab('products')} style={activeTab === 'products' ? sidebarBtnActive : sidebarBtn}>
          👟 Termékek kezelése
        </button>
        <button onClick={() => setActiveTab('users')} style={activeTab === 'users' ? sidebarBtnActive : sidebarBtn}>
          👥 Felhasználók
        </button>
        <button onClick={() => setActiveTab('orders')} style={activeTab === 'orders' ? sidebarBtnActive : sidebarBtn}>
          📦 Rendelések
        </button>
      </div>

      {/* JOBB OLDALI TARTALOM */}
      <div style={{ flex: 1, padding: '40px' }}>
        
        {/* --- TERMÉKEK TÁBLÁZAT --- */}
        {activeTab === 'products' && (
          <div>
            <h1 style={{ marginBottom: '20px', color: '#00d2ff' }}>Termékek kezelése</h1>
            <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid #333' }}>
              <table style={tableStyle}>
                <thead>
                  <tr style={{ backgroundColor: '#1a1a1a' }}>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Terméknév</th>
                    <th style={thStyle}>Ár (Ft)</th>
                    <th style={thStyle}>Műveletek</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id || p.Id} style={trStyle}>
                      <td style={tdStyle}>{p.id || p.Id}</td>
                      <td style={tdStyle}><strong>{p.name || p.Name}</strong></td>
                      <td style={tdStyle}>{Number(p.price || p.Price).toLocaleString('hu-HU')} Ft</td>
                      <td style={tdStyle}>
                        <button onClick={() => handleEditPrice(p)} style={editBtnStyle}>
                          <i className="fa-solid fa-pen" style={{ marginRight: '8px' }}></i> Ár szerkesztése
                        </button>
                        <button onClick={() => handleDeleteProduct(p.id || p.Id)} style={deleteBtnStyle}>
                          <i className="fa-solid fa-trash" style={{ marginRight: '8px' }}></i> Törlés
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- FELHASZNÁLÓK TÁBLÁZAT --- */}
        {activeTab === 'users' && (
          <div>
            <h1 style={{ marginBottom: '20px', color: '#00d2ff' }}>Regisztrált Felhasználók</h1>
            <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid #333' }}>
              <table style={tableStyle}>
                <thead>
                  <tr style={{ backgroundColor: '#1a1a1a' }}>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>E-mail</th>
                    <th style={thStyle}>Rang módosítása</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id || u.Id} style={trStyle}>
                      <td style={tdStyle}>{u.id || u.Id}</td>
                      <td style={tdStyle}>{u.email || u.Email}</td>
                      <td style={tdStyle}>
                        {/* ÚJ: Legördülő menü a rang kiválasztásához */}
                        <select 
                          value={u.role?.toLowerCase() || 'user'}
                          onChange={(e) => handleRoleChange(u, e.target.value)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '5px',
                            backgroundColor: u.role?.toLowerCase() === 'admin' ? '#00d2ff' : '#333',
                            color: u.role?.toLowerCase() === 'admin' ? '#000' : '#fff',
                            border: 'none',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            outline: 'none'
                          }}
                        >
                          <option value="user">USER (Vásárló)</option>
                          <option value="admin">ADMIN (Vezetőség)</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- RENDELÉSEK TÁBLÁZAT --- */}
        {activeTab === 'orders' && (
          <div>
            <h1 style={{ marginBottom: '20px', color: '#00d2ff' }}>Beérkezett Rendelések</h1>
            <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid #333' }}>
              <table style={tableStyle}>
                <thead>
                  <tr style={{ backgroundColor: '#1a1a1a' }}>
                    <th style={thStyle}>Rendelés ID</th>
                    <th style={thStyle}>Felhasználó ID</th>
                    <th style={thStyle}>Állapot / Dátum</th>
                    <th style={thStyle}>Műveletek</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#aaa' }}>
                        Még nincsenek rendelések az adatbázisban.
                      </td>
                    </tr>
                  ) : (
                    orders.map(o => (
                      <tr key={o.id || o.Id} style={trStyle}>
                        <td style={tdStyle}>#{o.id || o.Id}</td>
                        <td style={tdStyle}>
                          Felhasználó ID: {o.userId || o.UserId || 'Ismeretlen'}
                        </td>
                        <td style={tdStyle}>
                          {o.status || o.Status || o.createdAt || o.CreatedAt || 'Feldolgozás alatt'}
                        </td>
                        <td style={tdStyle}>
                          <button onClick={() => alert("RENDELÉS RÉSZLETEI:\n\n" + JSON.stringify(o, null, 2))} style={editBtnStyle}>
                            <i className="fa-solid fa-eye" style={{ marginRight: '8px' }}></i>
                            Részletek megtekintése
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// --- SÖTÉT TÉMÁJÚ STÍLUSOK ---
const sidebarBtn = { background: 'transparent', color: '#aaa', border: 'none', padding: '15px', textAlign: 'left', cursor: 'pointer', fontSize: '1.1rem', borderRadius: '5px', transition: '0.3s' };
const sidebarBtnActive = { ...sidebarBtn, background: '#00d2ff', color: '#000', fontWeight: 'bold', boxShadow: '0 0 10px rgba(0, 210, 255, 0.3)' };

const tableStyle = { width: '100%', borderCollapse: 'collapse', backgroundColor: '#111', color: '#fff' };
const thStyle = { padding: '15px', textAlign: 'left', textTransform: 'uppercase', fontSize: '0.9rem', color: '#00d2ff', borderBottom: '2px solid #333' };
const tdStyle = { padding: '15px' };
const trStyle = { borderBottom: '1px solid #222', transition: 'background-color 0.2s' };

const editBtnStyle = { backgroundColor: '#00d2ff', color: '#000', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' };
const deleteBtnStyle = { backgroundColor: '#ff4444', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s', marginLeft: '10px' };