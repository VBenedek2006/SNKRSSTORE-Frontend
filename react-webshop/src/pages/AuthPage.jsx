import { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  // Ez dönti el, hogy melyik fülön vagyunk (alapból: true = Bejelentkezés)
  const [isLogin, setIsLogin] = useState(true); 
  
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  // Itt tároljuk a beírt adatokat
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  
  const [message, setMessage] = useState('');

  // Ha írsz a mezőkbe, ez frissíti az adatokat
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Amikor megnyomod a gombot
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (isLogin) {
      // --- BEJELENTKEZÉS (Csak Email és Jelszó kell) ---
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/'); // Visszavisz a főoldalra
      } else {
        setMessage(result.message);
      }
    } else {
      // --- REGISZTRÁCIÓ (Itt kell a Felhasználónév is!) ---
      if (!formData.username) {
        setMessage("A felhasználónév megadása kötelező!");
        return;
      }
      // Itt küldjük el mind a 3 adatot a rendszernek
      const result = await register(formData.email, formData.password, formData.username);
      
      if (result.success) {
        alert("Sikeres regisztráció! Most jelentkezz be.");
        setIsLogin(true); // Átváltunk bejelentkezésre
        setFormData({ username: '', email: '', password: '' }); // Töröljük a mezőket
      } else {
        setMessage(result.message);
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        
        {/* FÜLEK: Váltás Bejelentkezés és Regisztráció között */}
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${isLogin ? 'active' : ''}`} 
            onClick={() => { setIsLogin(true); setMessage(''); }}
          >
            Bejelentkezés
          </button>
          <button 
            className={`auth-tab ${!isLogin ? 'active' : ''}`} 
            onClick={() => { setIsLogin(false); setMessage(''); }}
          >
            Regisztráció
          </button>
        </div>

        {/* ŰRLAP */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* A cím változik attól függően, hol vagyunk */}
          <h2>{isLogin ? 'Bejelentkezés' : 'Fiók létrehozása'}</h2>
          
          {/* 1. MEZŐ: Felhasználónév (Csak Regisztrációnál látszik!) */}
          {!isLogin && (
            <input 
              type="text" 
              name="username" 
              placeholder="Felhasználónév" 
              value={formData.username} 
              onChange={handleChange} 
              required 
            />
          )}
          
          {/* 2. MEZŐ: E-mail cím (Mindig látszik) */}
          <input 
            type="email" 
            name="email" 
            placeholder="E-mail cím" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
          
          {/* 3. MEZŐ: Jelszó (Mindig látszik) */}
          <input 
            type="password" 
            name="password" 
            placeholder="Jelszó" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />

          {/* Hibaüzenet helye (ha van) */}
          {message && <div className="form-msg">{message}</div>}

          {/* A gomb felirata is változik */}
          <button className="btn-primary" type="submit">
            {isLogin ? 'Bejelentkezés' : 'Regisztráció'}
          </button>
        </form>

      </div>
    </div>
  );
}