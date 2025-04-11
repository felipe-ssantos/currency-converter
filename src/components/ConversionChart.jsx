import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "../styles/ConversionChart.css";

const ConversionChart = ({ history }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (history?.length > 0 && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const dates = history
        .map((item) => new Date(item.date).toLocaleString())
        .reverse();
      const rates = history.map((item) => item.rate).reverse();
      const fromCurrency = history[0].fromCurrency;
      const toCurrency = history[0].toCurrency;

      const ctx = chartRef.current.getContext("2d");
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: dates,
          datasets: [
            {
              label: `Taxa de Câmbio (${fromCurrency} → ${toCurrency})`,
              data: rates,
              borderColor: "#38b6ff",
              borderWidth: 3 /* Linha mais espessa */,
              tension: 0.4,
              fill: true,
              backgroundColor:
                "rgba(56, 182, 255, 0.15)" /* Área mais visível */,
              pointBackgroundColor: "#38b6ff",
              pointBorderColor: "#ffffff",
              pointRadius: 5,
              pointHoverRadius: 8,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: "#f8f9fa" /* Texto mais claro */,
                font: {
                  size: 14,
                  weight: "500",
                },
              },
            },
            title: {
              display: true,
              text: `Evolução da Taxa de Câmbio: ${fromCurrency} → ${toCurrency}`,
              color: "#ffffff",
              font: {
                size: 16,
                weight: "bold",
              },
              padding: {
                top: 10,
                bottom: 20,
              },
            },
            tooltip: {
              backgroundColor: "rgba(16, 18, 37, 0.95)" /* Fundo mais opaco */,
              titleColor: "#38b6ff",
              bodyColor: "#ffffff",
              borderColor: "#38b6ff",
              borderWidth: 1,
              padding: 12,
              callbacks: {
                label: (context) =>
                  ` ${context.parsed.y.toFixed(6)} ${toCurrency}`,
                title: (context) => `Data: ${context[0].label}`,
              },
            },
          },
          scales: {
            x: {
              grid: {
                color: "rgba(56, 182, 255, 0.2)" /* Grid mais visível */,
              },
              ticks: {
                color: "#a8c6ff" /* Ticks mais claros */,
                maxRotation: 45,
                minRotation: 45,
              },
            },
            y: {
              beginAtZero: false,
              grid: {
                color: "rgba(56, 182, 255, 0.2)" /* Grid mais visível */,
              },
              ticks: {
                color: "#a8c6ff" /* Ticks mais claros */,
                callback: (value) => value.toFixed(4),
              },
            },
          },
          interaction: {
            intersect: false,
            mode: "index",
          },
        },
      });
    }

    return () => chartInstance.current?.destroy();
  }, [history]);

  if (!history || history.length < 2) {
    return (
      <div className="glass-card rounded-4 shadow-lg mt-4">
        <div className="card-header">
          <h3 className="mb-0 text-info chart-title">
            <i className="bi bi-graph-up me-2"></i> Gráfico de Conversões
          </h3>
        </div>
        <div className="card-body text-center py-4">
          <p className="no-data-message">
            <i className="bi bi-exclamation-circle me-2"></i>
            Faça pelo menos duas conversões para visualizar o gráfico
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-4 shadow-lg mt-4">
      <div className="card-header">
        <h3 className="mb-0 text-info chart-title">
          <i className="bi bi-graph-up me-2"></i> Gráfico de Conversões
        </h3>
      </div>
      <div className="card-body">
        <div className="chart-container">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default ConversionChart;
