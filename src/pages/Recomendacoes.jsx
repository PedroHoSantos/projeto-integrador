import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

export default function Recomendações() {
  const [data, setData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "simulations"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ ...doc.data() }));
      setData(list);

      if (list.length > 0) {
        const last = list[0];
        const recs = [];

        if (last.temperature > 28) recs.push("Temperatura elevada detectada. Considere aumentar a ventilação do ambiente.");
        if (last.consumption > 3.5) recs.push("Consumo alto identificado. Verifique distribuição de carga entre racks.");
        if (recs.length === 0) recs.push("Sistema operando dentro dos parâmetros recomendados.");

        setRecommendations(recs);
      }
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-bgLight p-8 text-textBase">
      <div className="bg-white p-8 rounded-xl border border-gray-200 max-w-4xl mx-auto">
        
        <h1 className="text-2xl font-semibold text-primary mb-6">Recomendações de Eficiência</h1>

        <ul className="space-y-4">
          {recommendations.map((item, index) => (
            <li key={index} className="p-4 bg-gray-100 rounded-lg border text-gray-700">
              • {item}
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}
