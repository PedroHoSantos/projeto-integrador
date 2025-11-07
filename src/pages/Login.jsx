import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      onLogin();
    } catch {
      alert("E-mail ou senha incorretos.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgLight">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold text-primary text-center mb-6">
          Entrar
        </h1>

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 bg-gray-100 rounded-lg mb-3 border border-gray-200 focus:outline-highlight"
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full p-3 bg-gray-100 rounded-lg mb-6 border border-gray-200 focus:outline-highlight"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition"
        >
          Entrar
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Esqueceu a senha?{" "}
          <span className="text-highlight cursor-pointer hover:underline">
            Recuperar
          </span>
        </p>
      </div>
    </div>
  );
}
