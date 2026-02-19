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
      role: 'customer' // Alapértelmezett vásárlói jogkör
    };

    try {
      console.log("KÜLDÉS A SZERVERNEK (Regisztráció):", payload);

      // VALÓDI BEKÖTÉS A C# SZERVERHEZ
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

  // --- BEJELENTKEZÉS (C# Backendhez kötve) ---
  const login = async (email, password) => {
    try {
      console.log("BEJELENTKEZÉS ELLENŐRZÉSE A SZERVEREN...");

      // Lekérjük az összes felhasználót a C# backendtől
      const response = await fetch('http://localhost:5074/api/Users');
      
      if (!response.ok) {
         throw new Error("Nem sikerült elérni a szervert.");
      }

      const users = await response.json();
      
      // Megkeressük azt, aki egyezik az email és jelszó párossal
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        setUser(foundUser);
        // Ez marad, hogy frissítés (F5) után is bejelentkezve maradjon a kliens:
        localStorage.setItem('snkrs_current_user', JSON.stringify(foundUser)); 
        return { success: true };
      } else {
        return { success: false, message: "Hibás email cím vagy jelszó!" };
      }

    } catch (error) {
      console.error("Hiba:", error);
      return { success: false, message: "Szerver hiba történt! Ellenőrizd, hogy fut-e a C# backend." };
    }
  };

  // 4. Kijelentkezés (Ez marad kliens oldali)
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