import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, onSnapshot, addDoc } from "firebase/firestore";

export default function Racks() {
  const [racks, setRacks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nome, setNome] = useState("");
  const [consumo, setConsumo] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "racks"), (snapshot) => {
      setRacks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const addRack = async () => {
    if (!nome || !consumo) return;

    await addDoc(collection(db, "racks"), {
      nome,
      consumo: Number(consumo)
    });

    setNome("");
    setConsumo("");
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-bgLight p-8 text-textBase">
      <div className="bg-white p-8 rounded-xl border border-gray-200 max-w-4xl mx-auto">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-primary">Gestão de Racks</h1>

          <button
            onClick={() => setShowModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg shadow-sm hover:opacity-90"
          >
            + Adicionar Rack
          </button>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-3 text-gray-600 font-medium">Rack</th>
              <th className="py-3 text-gray-600 font-medium">Consumo (kW)</th>
            </tr>
          </thead>
          <tbody>
            {racks.map((rack) => (
              <tr key={rack.id} className="border-b hover:bg-gray-50">
                <td className="py-3">{rack.nome}</td>
                <td className="py-3">{rack.consumo} kW</td>
              </tr>
            ))}

            {racks.length === 0 && (
              <tr>
                <td colSpan="2" className="py-6 text-center text-gray-500">
                  Nenhum rack cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">

            <h2 className="text-xl font-semibold text-primary mb-4">Novo Rack</h2>

            <input
              type="text"
              placeholder="Nome do Rack"
              className="w-full p-3 rounded-lg border mb-3 bg-gray-50"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <input
              type="number"
              placeholder="Consumo (kW)"
              className="w-full p-3 rounded-lg border mb-6 bg-gray-50"
              value={consumo}
              onChange={(e) => setConsumo(e.target.value)}
            />

            <div className="flex gap-3">
              <button
                onClick={addRack}
                className="flex-1 bg-primary text-white py-3 rounded-lg hover:opacity-90"
              >
                Salvar
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
