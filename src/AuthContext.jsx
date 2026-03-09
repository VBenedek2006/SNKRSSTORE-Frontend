import { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // 1. Megnézzük, van-e bejelentkezett felhasználó (Hogy F5 után ne léptessen ki)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('snkrs_current_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // --- REGISZTRÁCIÓ (C# Backendhez kötve) ---
  const register = async (email, password, username) => {
    const payload = {
      username: username,
      email: email,
      password: password,
      role: 'User' // Alapértelmezett vásárlói jogkör
    };

    try {
      console.log("KÜLDÉS A SZERVERNEK (Regisztráció):", payload);

      const response = await fetch('http://localhost:5074/api/Users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        return { success: true, message: "Sikeres regisztráció! Most már bejelentkezhetsz." };
      } else {
        return { success: false, message: "Hiba a regisztráció során! (Lehet, hogy már létezik ez az email vagy felhasználónév)" };
      }

    } catch (error) {
      console.error("Hiba:", error);
      return { success: false, message: "Szerver hiba történt! Ellenőrizd, hogy fut-e a C# backend." };
    }
  };

  // --- BEJELENTKEZÉS (ÚJ, BIZTONSÁGOS MÓDSZER AZ ADMIN RANGGAL) ---
  const login = async (email, password) => {
    try {
      console.log("BEJELENTKEZÉS ELLENŐRZÉSE A SZERVEREN...");

      // A dedikált, biztonságos Login végpontot hívjuk!
      const response = await fetch('http://localhost:5074/api/Users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password }) // Csak ezt a kettőt küldjük
      });
      
      if (!response.ok) {
         // Ha 401-es (Unauthorized) hibát kapunk a C#-tól
         if (response.status === 401) {
             return { success: false, message: "Hibás email cím vagy jelszó!" };
         }
         throw new Error("Nem sikerült elérni a szervert.");
      }

      // Ha sikeres, a C# visszaküldi az adataidat (id, username, email, role)
      const userData = await response.json();
      
      setUser(userData); // Beállítjuk a React memóriájába
      localStorage.setItem('snkrs_current_user', JSON.stringify(userData)); // VIP karszalag a böngészőnek!
      
      // Visszaadjuk a role-t is, hogy a bejelentkező oldal tudja, hova kell vinni!
      return { success: true, role: userData.role };

    } catch (error) {
      console.error("Hiba:", error);
      return { success: false, message: "Szerver hiba történt! Ellenőrizd, hogy fut-e a C# backend." };
    }
  };

  // 4. Kijelentkezés
  const logout = () => {
    setUser(null);
    localStorage.removeItem('snkrs_current_user');
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}