import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import * as XLSX from "xlsx";

export default function Historico() {
    const [data, setData] = useState([]);
    const [avgConsumption, setAvgConsumption] = useState(0);
    const [avgTemp, setAvgTemp] = useState(0);
    const [maxConsumption, setMaxConsumption] = useState(0);


    useEffect(() => {
        const q = query(collection(db, "simulations"), orderBy("timestamp", "desc"));
        const unsub = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setData(list);

            // Cálculo do resumo
            if (list.length > 0) {
                const avgCons = list.reduce((acc, item) => acc + item.consumption, 0) / list.length;
                const avgTmp = list.reduce((acc, item) => acc + item.temperature, 0) / list.length;
                const maxCons = Math.max(...list.map((item) => item.consumption));

                setAvgConsumption(avgCons.toFixed(2));
                setAvgTemp(avgTmp.toFixed(1));
                setMaxConsumption(maxCons.toFixed(2));
            } else {
                setAvgConsumption(0);
                setAvgTemp(0);
                setMaxConsumption(0);
            }
        });
        return () => unsub();
    }, []);

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data.map(item => ({
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

                <div className="overflow-x-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 text-center">
                            <p className="text-sm text-gray-500">Total de Registros</p>
                            <h3 className="text-2xl font-semibold text-primary">{data.length}</h3>
                        </div>

                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 text-center">
                            <p className="text-sm text-gray-500">Consumo Médio</p>
                            <h3 className="text-2xl font-semibold text-primary">{avgConsumption} kW</h3>
                        </div>

                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 text-center">
                            <p className="text-sm text-gray-500">Temperatura Média</p>
                            <h3 className="text-2xl font-semibold text-primary">{avgTemp} °C</h3>
                        </div>

                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 text-center">
                            <p className="text-sm text-gray-500">Pico de Consumo</p>
                            <h3 className="text-2xl font-semibold text-primary">{maxConsumption} kW</h3>
                        </div>
                    </div>

                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="py-3 text-gray-600 font-medium">Data</th>
                                <th className="py-3 text-gray-600 font-medium">Consumo (kW)</th>
                                <th className="py-3 text-gray-600 font-medium">Temperatura (°C)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3">
                                        {new Date(item.timestamp?.toDate()).toLocaleString()}
                                    </td>
                                    <td className="py-3">{item.consumption}</td>
                                    <td className="py-3">{item.temperature}</td>
                                </tr>
                            ))}

                            {data.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="py-6 text-center text-gray-500">
                                        Nenhum registro encontrado.
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
