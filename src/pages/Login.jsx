import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import Cadastro from "./Cadastro";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showCadastro, setShowCadastro] = useState(false);

  const [error, setError] = useState("");

  if (showCadastro) return <Cadastro onVoltar={() => setShowCadastro(false)} />;


  const handleLogin = async () => {
    setError("");

    if (!email || !senha) {
      setError("Preencha todos os campos.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email.trim(), senha);
      onLogin();
    } catch {
      setError("E-mail ou senha incorretos.");
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

        {error && (
          <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
        )}


        <button
          onClick={handleLogin}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition"
        >
          Entrar
        </button>

        <p className="mt-4 text-sm text-center text-gray-600">
          Não tem conta?{" "}
          <span
            className="text-highlight cursor-pointer hover:underline"
            onClick={() => setShowCadastro(true)}
          >
            Cadastrar
          </span>
        </p>

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
