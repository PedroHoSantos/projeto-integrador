import React from "react";

export default function Sobre() {
  return (
    <div className="min-h-screen bg-bgLight p-8 text-textBase max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Sobre o Projeto</h1>

      <p className="text-lg mb-4">
      O sistema desenvolvido tem como objetivo monitorar e analisar o consumo energético e a temperatura de um ambiente de forma contínua, apresentando os dados em um painel visual e permitindo a geração de relatórios para acompanhamento histórico. O sistema foi projetado com foco em acessibilidade, simplicidade operacional e aplicação em cenários educacionais e laboratoriais.

A aplicação foi construída no modelo Web, utilizando React como framework de interface e Firebase como plataforma de backend e persistência de dados. A comunicação é realizada diretamente com o Firestore, que armazena leituras simuladas de consumo e temperatura, garantindo atualização em tempo real sem necessidade de servidor intermediário.

O painel principal exibe métricas agregadas, como consumo médio, temperatura média e picos de uso, além de gráficos de linha que representam a variação temporal. Um módulo de Relatórios permite consultar histórico filtrando por dia, semana ou mês, e exportar os dados em formato Excel. Para avaliação de desempenho energético, são calculados indicadores PUE (Power Usage Effectiveness) e CUE (Carbon Usage Effectiveness) com base nos valores coletados.

A aplicação inclui também um módulo de Recomendações, onde são apresentadas orientações automáticas de eficiência energética, geradas conforme padrões observados nas leituras. Outro módulo, Gestão de Racks, permite registrar e visualizar o consumo individual de racks ou setores monitorados, contribuindo para análise de distribuição de carga.

O sistema utiliza autenticação via Firebase Authentication, possibilitando criação e gerenciamento de contas de acesso. A interface foi estilizada utilizando Tailwind CSS, seguindo identidade visual uniforme e responsiva.
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
