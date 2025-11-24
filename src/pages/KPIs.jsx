import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

export default function KPIs() {
  const [pue, setPue] = useState(0);
  const [cue, setCue] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "simulations"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ ...doc.data() }));

      if (list.length > 0) {
        const avgConsumption = list.reduce((sum, v) => sum + v.consumption, 0) / list.length;
        const avgTemp = list.reduce((sum, v) => sum + v.temperature, 0) / list.length;

        setPue((avgConsumption / 1.8).toFixed(2));
        setCue((avgConsumption / avgTemp).toFixed(2));
      }
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-bgLight p-8 text-textBase">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-4xl mx-auto">

        <h1 className="text-2xl font-semibold text-primary mb-6">KPIs Energéticos</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="p-6 border rounded-lg text-center">
            <p className="text-gray-500 text-sm">PUE (Power Usage Effectiveness)</p>
            <h2 className="text-4xl text-primary font-bold">{pue}</h2>
          </div>

          <div className="p-6 border rounded-lg text-center">
            <p className="text-gray-500 text-sm">CUE (Carbon Usage Effectiveness)</p>
            <h2 className="text-4xl text-primary font-bold">{cue}</h2>
          </div>

        </div>
      </div>
    </div>
  );
}
