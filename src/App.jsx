import React, { useState, useEffect } from "react";
import { auth } from "./services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Sobre from "./pages/Sobre";
import Historico from "./pages/Historico";


export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  if (!user) return <Login onLogin={() => setUser(auth.currentUser)} />;

  return (
    <div>
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-lg font-semibold text-primary">Monitor Energético</h1>

        <div className="flex gap-6">
          <button onClick={() => setPage("dashboard")} className="hover:text-highlight">Dashboard</button>
          <button onClick={() => setPage("sobre")} className="hover:text-highlight">Sobre</button>
          <button onClick={() => setPage("historico")} className="hover:text-highlight">Histórico</button>

        </div>

        <button
          onClick={() => signOut(auth)}
          className="text-sm text-red-600 font-medium hover:underline"
        >
          Sair
        </button>
      </nav>



      {page === "dashboard" && <Dashboard />}
      {page === "sobre" && <Sobre />}
      {page === "historico" && <Historico />}
    </div>
  );
}
