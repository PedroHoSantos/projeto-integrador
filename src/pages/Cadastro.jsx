import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";

export default function Cadastro({ onVoltar }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    const handleCadastro = async () => {
        setError("");
        setSuccess("");

        if (!email || !senha) {
            setError("Preencha todos os campos.");
            return;
        }

        if (!email.includes("@")) {
            setError("E-mail inválido.");
            return;
        }

        if (senha.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email.trim(), senha);
            setSuccess("Conta criada com sucesso! Agora você pode entrar.");
        } catch {
            setError("Não foi possível criar a conta. Tente outro e-mail.");
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-bgLight">
            <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-semibold text-primary text-center mb-6">
                    Criar Conta
                </h1>

                <input
                    type="email"
                    placeholder="E-mail"
                    className="w-full p-3 bg-gray-100 rounded-lg mb-3 border border-gray-200"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Senha"
                    className="w-full p-3 bg-gray-100 rounded-lg mb-6 border border-gray-200"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />

                {error && (
                    <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
                )}

                {success && (
                    <p className="text-green-600 text-sm mb-2 text-center">{success}</p>
                )}


                <button
                    onClick={handleCadastro}
                    className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
                >
                    Criar Conta
                </button>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Já tem conta?{" "}
                    <span
                        className="text-highlight cursor-pointer hover:underline"
                        onClick={onVoltar}
                    >
                        Entrar
                    </span>
                </p>
            </div>
        </div>
    );
}
