import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function Dashboard() {
  const [data, setData] = useState([]);

  // Gera dados simulados
  const simulateData = async () => {
    const consumption = (Math.random() * 4 + 1).toFixed(2); // Consumo entre 1 e 5 kW
    const temperature = (25 + Math.random() * 5).toFixed(1); // Temperatura entre 25 e 30°C
    await addDoc(collection(db, "simulations"), {
      consumption: Number(consumption),
      temperature: Number(temperature),
      timestamp: serverTimestamp(),
    });
  };

  // Lê dados do Firestore em tempo real
  useEffect(() => {
    const q = query(collection(db, "simulations"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const formatted = snapshot.docs.map((doc) => doc.data());
      setData(formatted);
    });
    return () => unsubscribe();
  }, []);

  // Dados do gráfico
  const chartData = {
    labels: data.map((_, i) => `Leitura ${i + 1}`),
    datasets: [
      {
        label: "Consumo (kW)",
        data: data.map((d) => d.consumption),
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.1)",
        tension: 0.3,
      },
      {
        label: "Temperatura (°C)",
        data: data.map((d) => d.temperature),
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.1)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl mb-6 font-semibold">📊 Monitoramento Energético</h2>
      <button
        onClick={simulateData}
        className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 transition"
      >
        Gerar Simulação
      </button>

      <div className="mt-8 max-w-3xl mx-auto bg-white shadow-md p-4 rounded-lg">
        {data.length > 0 ? (
          <Line data={chartData} />
        ) : (
          <p className="text-gray-500 mt-4">Nenhum dado registrado ainda. Clique em “Gerar Simulação”.</p>
        )}
      </div>
    </div>
  );
}
