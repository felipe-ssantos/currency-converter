import React, { useState, useEffect } from "react";
import CurrencyConverter from "./components/CurrencyConverter";
import ConversionHistory from "./components/ConversionHistory";
import ConversionChart from "./components/ConversionChart";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/App.css";

function App() {
  const [conversionHistory, setConversionHistory] = useState([]);
  const [showClearModal, setShowClearModal] = useState(false);

  useEffect(() => {
    // localStorage
    const savedHistory = localStorage.getItem("conversionHistory");
    if (savedHistory) {
      setConversionHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {    
    localStorage.setItem(
      "conversionHistory",
      JSON.stringify(conversionHistory)
    );
  }, [conversionHistory]);

  const handleConversionComplete = (newConversion) => {
    setConversionHistory((prevHistory) =>
      [newConversion, ...prevHistory].slice(0, 10)
    );
  };

  const handleSelectHistoryItem = (item) => {
    console.log("Item selecionado:", item);
  };

  const handleClearHistory = () => {
    setShowClearModal(true);
  };

  const confirmClearHistory = () => {
    setConversionHistory([]);
    setShowClearModal(false);
  };

  return (
    <div className="container py-4">
      <div
        className={`modal fade ${showClearModal ? "show d-block" : ""}`}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-dark text-light">
            <div className="modal-header">
              <h5 className="modal-title">Limpar histórico</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowClearModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <p>
                Tem certeza que deseja limpar todo o histórico de conversões?
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowClearModal(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmClearHistory}
              >
                <i className="bi bi-trash"></i> Limpar
              </button>
            </div>
          </div>
        </div>
      </div>
      {showClearModal && <div className="modal-backdrop fade show"></div>}

      <header className="text-center mb-5">
        <h1 className="display-4 text-primary fw-bold">
          <i className="bi bi-currency-exchange me-2"></i> Conversor de Moedas
        </h1>
        <p className="lead text-light opacity-85">
          {" "}
          Converta moedas em tempo real e acompanhe o histórico de taxas
        </p>
      </header>

      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="glass-card rounded-4 shadow-lg p-4">
            <CurrencyConverter
              onConversionComplete={handleConversionComplete}
            />
          </div>
        </div>
        <div className="col-lg-6 mb-4">
          <div className="glass-card rounded-4 shadow-lg p-4">
            <ConversionHistory
              history={conversionHistory}
              onSelectHistoryItem={handleSelectHistoryItem}
              onClearHistory={handleClearHistory}
            />
          </div>
        </div>
        <div className="col-12">
          <div className="glass-card rounded-4 shadow-lg p-4">
            <ConversionChart history={conversionHistory} />
          </div>
        </div>
      </div>

      <footer className="mt-5 py-4 bg-dark bg-opacity-90 border-top border-primary">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-currency-exchange fs-3 text-primary me-2"></i>
                <h5 className="mb-0 text-light fw-bold">Conversor de Moedas</h5>
              </div>
              <p className="text-muted small">
                Plataforma de conversão monetária com taxas atualizadas em tempo
                real e histórico de câmbio.
              </p>
              <div className="d-flex gap-3">
                <a
                  href="https://github.com/felipe-ssantos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none text-primary"
                >
                  <i className="bi bi-github fs-5"></i>
                </a>
                <a
                  href="https://www.exchangerate-api.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none text-primary"
                >
                  <i className="bi bi-database fs-5"></i>
                </a>
              </div>
            </div>

            <div className="col-lg-4">
              <h6 className="text-light fw-bold mb-3">Tecnologias</h6>
              <div className="d-flex flex-wrap gap-2">
                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary">
                  React
                </span>
                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary">
                  Bootstrap 5
                </span>
                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary">
                  Chart.js
                </span>
                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary">
                  API Rest
                </span>
                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary">
                  JavaScript ES6
                </span>
              </div>
            </div>

            <div className="col-lg-4">
              <h6 className="text-light fw-bold mb-3">Status</h6>
              <div className="d-flex align-items-center mb-2">
                <span className="pulse-dot me-2"></span>
                <span className="text-success small">Operacional</span>
              </div>
              <div className="d-flex align-items-center">
                <i className="bi bi-lightning-charge-fill text-warning me-2"></i>
                <span className="text-muted small">
                  Atualizado em {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <hr className="my-4 border-secondary" />

          <div className="row">
            <div className="col-md-6 text-center text-md-start">
              <p className="small text-muted mb-0">
                © {new Date().getFullYear()} Conversor de Moedas.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <p className="small text-muted mb-0">
                Desenvolvido por{" "}
                <span className="text-primary">Felipe Santos</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
