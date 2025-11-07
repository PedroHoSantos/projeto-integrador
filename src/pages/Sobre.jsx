import React from "react";

export default function Sobre() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Sobre o Projeto</h1>

      <p className="text-lg mb-4">
        O <strong>Monitor Energético</strong> é um sistema web desenvolvido com o objetivo
        de acompanhar e analisar o consumo de energia e temperatura de um ambiente
        ou equipamento. Ele simula leituras periódicas, registra essas informações
        em banco de dados e apresenta os resultados de forma visual e intuitiva.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Tecnologias Utilizadas</h2>
      <ul className="list-disc ml-6 text-lg">
        <li><strong>React</strong> — Interface e componentes</li>
        <li><strong>Firebase Authentication</strong> — Login de usuários</li>
        <li><strong>Firestore Database</strong> — Armazenamento dos dados simulados</li>
        <li><strong>Chart.js</strong> — Visualização dos dados em gráficos</li>
        <li><strong>Tailwind CSS</strong> — Estilização rápida e responsiva</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Relevância Acadêmica</h2>
      <p className="text-lg">
        O projeto demonstra conceitos de sistemas distribuídos, análise de dados,
        monitoramento contínuo, visualização analítica e boas práticas de desenvolvimento
        web moderno. Além disso, pode ser expandido futuramente para leitura de sensores
        físicos utilizando <strong>ESP32 / IoT</strong>.
      </p>
    </div>
  );
}
