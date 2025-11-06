import React from "react";
import { useState } from "react";
import { auth } from "../services/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async (isRegister) => {
    try {
      if (isRegister)
        await createUserWithEmailAndPassword(auth, email, password);
      else
        await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-2xl mb-4 font-semibold">Monitor Energético</h2>
      <input
        type="email"
        placeholder="E-mail"
        className="border p-2 mb-2 w-64"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        className="border p-2 mb-4 w-64"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => handleAuth(false)}>Entrar</button>
      <button className="text-sm text-blue-600 mt-2" onClick={() => handleAuth(true)}>Cadastrar</button>
    </div>
  );
}
