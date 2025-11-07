import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import * as XLSX from "xlsx";
import { deleteDoc, doc, getDocs } from "firebase/firestore";

export default function Dashboard() {
  const [data, setData] = useState([]);

  // Gera dados simulados
  const simulateData = async () => {
    const consumption = (Math.random() * 4 + 1).toFixed(2);
    const temperature = (25 + Math.random() * 5).toFixed(1);
    await addDoc(collection(db, "simulations"), {
      consumption: Number(consumption),
      temperature: Number(temperature),
      timestamp: serverTimestamp(),
    });
  };

  //Apaga os dados caso necessário
  const clearData = async () => {
    const querySnapshot = await getDocs(collection(db, "simulations"));
    querySnapshot.forEach(async (docItem) => {
      await deleteDoc(doc(db, "simulations", docItem.id));
    });
  };


  // Escuta Firestore em tempo real
  useEffect(() => {
    const q = query(collection(db, "simulations"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const formatted = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(formatted);
    });
    return () => unsubscribe();
  }, []);

  // Estatísticas básicas
  const averageConsumption =
    data.length > 0
      ? (data.reduce((sum, d) => sum + d.consumption, 0) / data.length).toFixed(2)
      : 0;

  const averageTemp =
    data.length > 0
      ? (data.reduce((sum, d) => sum + d.temperature, 0) / data.length).toFixed(1)
      : 0;

  const maxConsumption =
    data.length > 0
      ? Math.max(...data.map((d) => d.consumption)).toFixed(2)
      : 0;

  const hasAlert = data.some((d) => d.consumption > 4.5);

  // Exportar para Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((d) => ({
        Data: d.timestamp
          ? new Date(d.timestamp.toDate()).toLocaleString()
          : "—",
        Consumo_kW: d.consumption,
        Temperatura_C: d.temperature,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Simulações");
    XLSX.writeFile(workbook, "relatorio_consumo.xlsx");
  };

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

  const chartOptions = {
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#E5E7EB" } }
    }
  };


  return (
    <div className="min-h-screen bg-bgLight p-8 text-textBase">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        ⚡ Monitoramento Energético
      </h2>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
          <p className="text-sm text-gray-500">Consumo médio</p>
          <h3 className="text-3xl font-semibold text-primary">{averageConsumption} kW</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
          <p className="text-sm text-gray-500">Temperatura média</p>
          <h3 className="text-3xl font-semibold text-primary">{averageTemp} °C</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
          <p className="text-sm text-gray-500">Pico de consumo</p>
          <h3 className="text-3xl font-semibold text-primary">{maxConsumption} kW</h3>
        </div>
      </div>

      {/* Alerta de consumo alto */}
      {hasAlert && (
        <div className="bg-red-100 text-red-700 p-3 mb-6 rounded shadow text-center font-semibold">
          ⚠️ Alerta: consumo acima do limite seguro detectado!
        </div>
      )}

      {/* Gráfico */}
      <div className="bg-white p-4 rounded shadow mb-6">
        {data.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <p className="text-gray-500 text-center">
            Nenhum dado ainda. Clique em “Gerar Simulação”.
          </p>
        )}
      </div>

      {/* Tabela de histórico */}
      <div className="bg-white p-4 rounded shadow overflow-x-auto">
        <h3 className="text-lg font-semibold mb-2">Histórico de Leituras</h3>
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2">Data/Hora</th>
              <th className="p-2">Consumo (kW)</th>
              <th className="p-2">Temperatura (°C)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-2">
                  {d.timestamp
                    ? new Date(d.timestamp.toDate()).toLocaleString()
                    : "—"}
                </td>
                <td className={`p-2 ${d.consumption > 4.5 ? "text-red-600 font-bold" : ""}`}>
                  {d.consumption}
                </td>
                <td className="p-2">{d.temperature}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botões */}
      <div className="flex flex-wrap gap-4 justify-center mt-8">
        <button
          onClick={simulateData}
          className="bg-primary text-white px-6 py-3 rounded-lg shadow-sm hover:opacity-90 transition"
        >
          Gerar Simulação
        </button>

        <button
          onClick={exportToExcel}
          className="bg-highlight text-white px-6 py-3 rounded-lg shadow-sm hover:opacity-90 transition"
        >
          Exportar Dados
        </button>

        <button
          onClick={clearData}
          className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-sm hover:opacity-90 transition"
        >
          Apagar Dados
        </button>
      </div>

    </div>
  );
}
