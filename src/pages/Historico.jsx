import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import * as XLSX from "xlsx";

export default function Historico() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState("all");

  // Busca todos os dados uma vez
  useEffect(() => {
    const q = query(collection(db, "simulations"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(list);
      setFiltered(list);
    });
    return () => unsub();
  }, []);

  // Aplica filtros localmente
  useEffect(() => {
    const now = new Date();
    let start;

    if (filter === "today") {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      setFiltered(data.filter(d => d.timestamp?.toDate() >= start));
    } 
    
    else if (filter === "week") {
      start = new Date();
      start.setDate(now.getDate() - 7);
      setFiltered(data.filter(d => d.timestamp?.toDate() >= start));
    } 
    
    else if (filter === "month") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      setFiltered(data.filter(d => d.timestamp?.toDate() >= start));
    } 
    
    else {
      setFiltered(data);
    }

  }, [filter, data]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filtered.map(item => ({
      Data: new Date(item.timestamp?.toDate()).toLocaleString(),
      Consumo_kW: item.consumption,
      Temperatura_C: item.temperature
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Histórico");
    XLSX.writeFile(workbook, "historico_consumo.xlsx");
  };

  return (
    <div className="min-h-screen bg-bgLight p-8 text-textBase">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-primary">Histórico de Leituras</h1>
          <button
            onClick={exportToExcel}
            className="bg-highlight text-white px-5 py-2 rounded-lg shadow-sm hover:opacity-90 transition"
          >
            Exportar Excel
          </button>
        </div>

        <div className="flex gap-3 mb-6">
          <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-lg border ${filter==="all"?"bg-primary text-white":"bg-white"}`}>Tudo</button>
          <button onClick={() => setFilter("today")} className={`px-4 py-2 rounded-lg border ${filter==="today"?"bg-primary text-white":"bg-white"}`}>Hoje</button>
          <button onClick={() => setFilter("week")} className={`px-4 py-2 rounded-lg border ${filter==="week"?"bg-primary text-white":"bg-white"}`}>Últimos 7 dias</button>
          <button onClick={() => setFilter("month")} className={`px-4 py-2 rounded-lg border ${filter==="month"?"bg-primary text-white":"bg-white"}`}>Este mês</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-3 text-gray-600 font-medium">Data</th>
                <th className="py-3 text-gray-600 font-medium">Consumo (kW)</th>
                <th className="py-3 text-gray-600 font-medium">Temperatura (°C)</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{new Date(item.timestamp?.toDate()).toLocaleString()}</td>
                  <td className="py-3">{item.consumption}</td>
                  <td className="py-3">{item.temperature}</td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="3" className="py-6 text-center text-gray-500">
                    Nenhum registro encontrado para este período.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
