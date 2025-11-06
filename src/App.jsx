import React from "react";
import { useState, useEffect } from "react";
import { auth } from "./services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  if (!user) return <Login onLogin={() => setUser(auth.currentUser)} />;

  return (
    <div>
      <nav className="flex justify-between items-center p-4 bg-gray-200">
        <span>Monitor Energético</span>
        <button onClick={() => signOut(auth)} className="text-red-600">Sair</button>
      </nav>
      <Dashboard />
    </div>
  );
}
