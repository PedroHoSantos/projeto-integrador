import { Bar } from "react-chartjs-2";
import { db } from "../services/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useState, useEffect } from "react";

export default function ConsumoRacks() {
  const [racks, setRacks] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "racks"), (snap) => {
      setRacks(snap.docs.map(doc => doc.data()));
    });
    return () => unsub();
  }, []);

  const data = {
    labels: racks.map(r => r.nome),
    datasets: [
      {
        label: "Consumo (kW)",
        data: racks.map(r => r.consumo),
      }
    ]
  };

  return (
    <div className="min-h-screen bg-bgLight p-8 text-textBase">
      <div className="bg-white p-8 rounded-xl shadow-sm border max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-primary mb-6">Consumo por Rack</h1>
        <Bar data={data} />
      </div>
    </div>
  );
}
