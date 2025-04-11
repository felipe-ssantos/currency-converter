import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

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
              label: `${fromCurrency}/${toCurrency}`,
              data: rates,
              borderColor: "#28a745",
              borderWidth: 2,
              tension: 0.1,
              fill: false,
              pointBackgroundColor: "#fff",
              pointBorderColor: "#28a745",
              pointRadius: 3,
              pointHoverRadius: 5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: "#1e2a3a",
              titleColor: "#38b6ff",
              bodyColor: "#ffffff",
              borderColor: "#2a3b4d",
              borderWidth: 1,
              padding: 10,
              callbacks: {
                label: (context) =>
                  ` ${context.parsed.y.toFixed(6)} ${toCurrency}`,
              },
            },
          },
          scales: {
            x: {
              grid: {
                color: "#2a3b4d",
                drawBorder: false,
              },
              ticks: {
                color: "#8b9dc7",
                maxRotation: 45,
                minRotation: 45,
                autoSkip: true,
                maxTicksLimit: 10,
              },
            },
            y: {
              grid: {
                color: "#2a3b4d",
                drawBorder: false,
              },
              ticks: {
                color: "#8b9dc7",
                callback: (value) => value.toFixed(4),
              },
            },
          },
          interaction: {
            intersect: false,
            mode: "index",
          },
          elements: {
            line: {
              borderJoinStyle: "round",
            },
            point: {
              hoverRadius: 6,
              hoverBorderWidth: 2,
            },
          },
        },
      });
    }

    return () => chartInstance.current?.destroy();
  }, [history]);

  useEffect(() => {
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!history || history.length < 2) {
    return (
      <div className="card shadow-sm mt-3">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="bi bi-graph-up me-2"></i>Gráfico de Câmbio
          </h5>
        </div>
        <div className="card-body text-center py-4">
          <p className="no-data-message">
            <i className="bi bi-exclamation-circle me-2"></i>
            Dados insuficientes para exibir o gráfico
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm mt-3">
      <div className="card-header">
        <h5 className="mb-0">
          <i className="bi bi-graph-up me-2"></i>Gráfico de Câmbio
        </h5>
      </div>
      <div className="card-body p-2">
        <div className="chart-container" style={{ minHeight: "400px" }}>
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default ConversionChart;
