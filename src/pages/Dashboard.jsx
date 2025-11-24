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
import Recomendacoes from "./Recomendacoes";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);

  // Gera dados simulados de forma mais realista
  const simulateData = async () => {
    const now = new Date();
    const hour = now.getHours();

    // Simula um padrão de consumo mais alto durante o horário comercial (8h-18h)
    const isBusinessHours = hour >= 8 && hour < 18;
    let baseConsumption = isBusinessHours ? 3.5 : 1.5;
    
    // Adiciona uma variação aleatória
    baseConsumption += Math.random() * 0.5 - 0.25; // Variação de -0.25 a +0.25

    // Chance de 5% de ocorrer um pico de consumo
    if (Math.random() < 0.05) {
      baseConsumption *= 1.5; // Aumenta o consumo em 50%
    }

    // Simula a temperatura com um padrão diário
    const baseTemperature = isBusinessHours ? 25 : 22;
    const temperature = (baseTemperature + Math.random() * 2 - 1).toFixed(1);

    // Mantém a umidade com variação simples
    const humidity = (45 + Math.random() * 15).toFixed(1);

    const consumption = Math.max(0.5, baseConsumption).toFixed(2); // Garante um consumo mínimo

    await addDoc(collection(db, "simulations"), {
      consumption: Number(consumption),
      temperature: Number(temperature),
      humidity: Number(humidity),
      timestamp: serverTimestamp(),
    });
  };

  useEffect(() => {
    const interval = setInterval(simulateData, 1000 * 60 * 1); // 1 minuto
    return () => clearInterval(interval);
  }, []);

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

  // Lógica de paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Filtro de dados para o gráfico
  const filteredData = data.filter(d => {
    if (!filterDate || !d.timestamp) return true;
    const itemDate = new Date(d.timestamp.toDate()).toISOString().split("T")[0];
    return itemDate === filterDate;
  });

  // Estatísticas básicas
  const averageConsumption =
    data.length > 0
      ? (data.reduce((sum, d) => sum + d.consumption, 0) / data.length).toFixed(2)
      : 0;

  const averageTemp =
    data.length > 0
      ? (data.reduce((sum, d) => sum + d.temperature, 0) / data.length).toFixed(1)
      : 0;

  const averageHumidity =
    (data.reduce((s, v) => s + v.humidity, 0) / data.length).toFixed(1);

  const maxConsumption =
    data.length > 0
      ? Math.max(...data.map((d) => d.consumption)).toFixed(2)
      : 0;

  const hasAlert = data.some(() => averageConsumption > 4.5);

  const hasAlertTemp = data.some(() => averageTemp > 27);

  const hasAlertHumidity = data.some(() => averageHumidity > 55);

  // Exportar para Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((d) => ({
        Data: d.timestamp
          ? new Date(d.timestamp.toDate()).toLocaleString()
          : "—",
        Consumo_kW: d.consumption,
        Temperatura_C: d.temperature,
        Umidade: d.humidity
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Simulações");
    XLSX.writeFile(workbook, "relatorio_consumo.xlsx");
  };

  // Dados do gráfico
  const chartData = {
    labels: filteredData.map((d) =>
      d.timestamp ? new Date(d.timestamp.toDate()).toLocaleTimeString() : "—"
    ),
    datasets: [
      {
        label: "Consumo (kW)",
        data: filteredData.map((d) => d.consumption),
        borderColor: "yellow",
        backgroundColor: "rgba(0, 0, 255, 0.1)",
        tension: 0.4,
      },
      {
        label: "Umidade (%)",
        data: filteredData.map((d) => d.humidity),
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.1)",
        tension: 0.4,
      },
      {
        label: "Temperatura (°C)",
        data: filteredData.map((d) => d.temperature),
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.1)",
        tension: 0.4,
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
        Monitoramento Energético
      </h2>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
          <p className="text-sm text-gray-500">Consumo médio</p>
          <h3 className="text-3xl font-semibold text-primary">{averageConsumption} kW</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
          <p className="text-sm text-gray-500">Temperatura média</p>
          <h3 className="text-3xl font-semibold text-primary">{averageTemp} °C</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
          <p className="text-sm text-gray-500">Umidade média</p>
          <h3 className="text-3xl font-semibold text-primary">{averageHumidity} %</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
          <p className="text-sm text-gray-500">Pico de consumo</p>
          <h3 className="text-3xl font-semibold text-primary">{maxConsumption} kW</h3>
        </div>
      </div>

      {/* Alerta de consumo alto */}
      <div className="flex flex-col items-center">
        {hasAlert && (
          <div className="bg-red-100 text-red-700 p-3 mb-6 rounded shadow text-center font-semibold w-max">
            Alerta: Consumo acima do limite seguro detectado!
          </div>
        )}
        {hasAlertTemp && (
          <div className="bg-red-100 text-red-700 p-3 mb-6 rounded shadow text-center font-semibold w-max">
            Alerta: Temperatura acima do limite seguro detectado!
          </div>
        )}
        {hasAlertHumidity && (
          <div className="bg-red-100 text-red-700 p-3 mb-6 rounded shadow text-center font-semibold w-max">
            Alerta: Umidade acima do limite seguro detectado!
          </div>
        )}
      </div>

      {/* Botões */}
      <div className="flex flex-wrap gap-4 justify-center mt-8 mb-6">
        <button
          onClick={exportToExcel}
          className="bg-highlight text-white px-6 py-3 rounded-lg shadow-sm hover:opacity-90 transition"
        >
          Exportar Dados
        </button>
      </div>

      {/* Gráfico */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex justify-center mb-4">
          <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="border p-2 rounded"/>
        </div>
        {filteredData.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <p className="text-gray-500 text-center">
            Nenhum dado para a data selecionada.
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
              <th className="p-2">Umidade (%)</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((d, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-2">
                  {d.timestamp
                    ? new Date(d.timestamp.toDate()).toLocaleString()
                    : "—"}
                </td>
                <td className={`p-2 ${d.consumption > 4.5 ? "text-red-600 font-bold" : ""}`}>{d.consumption}</td>
                <td className={`p-2 ${d.temperature > 27 ? "text-red-600 font-bold" : ""}`}>{d.temperature}</td>
                <td className={`p-2 ${d.humidity > 55 ? "text-red-600 font-bold" : ""}`}>{d.humidity}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination Controls */}
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
            <button key={number} onClick={() => paginate(number)} className={`px-4 py-2 mx-1 rounded ${currentPage === number ? 'bg-primary text-white' : 'bg-gray-200'}`}>
              {number}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 ">
        <Recomendacoes />
      </div>
    </div>
  );
}
