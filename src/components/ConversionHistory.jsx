import React from "react";
import "../styles/ConversionHistory.css";

const ConversionHistory = ({
  history,
  onSelectHistoryItem,
  onClearHistory,
}) => {
  if (!history || history.length === 0) {
    return (
      <div className="glass-card rounded-4 shadow-lg border-0 mt-4">
        <div className="card-header bg-transparent border-bottom border-secondary d-flex justify-content-between align-items-center">
          <h3 className="mb-0 text-light history-title">
            <i className="bi bi-clock-history me-2"></i> Histórico de Conversões
          </h3>
        </div>
        <div className="card-body text-center py-4">
          <p className="text-muted">
            <i className="bi bi-clock me-2"></i> Nenhum histórico disponível
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-4 shadow-lg border-0 mt-4">
      <div className="card-header bg-transparent border-bottom border-secondary d-flex justify-content-between align-items-center">
        <h3 className="mb-0 text-light history-title">
          <i className="bi bi-clock-history me-2"></i> Histórico de Conversões
        </h3>
        <button
          className="btn btn-sm btn-outline-danger limpar-historico"
          onClick={onClearHistory}
          title="Limpar histórico"
        >
          <i className="bi bi-trash me-1"></i> Limpar
        </button>
      </div>
      <div className="card-body p-0">
        <div className="list-group list-group-flush">
          {history.map((item, index) => (
            <button
              key={index}
              className="list-group-item list-group-item-action bg-transparent border-bottom border-secondary"
              onClick={() => onSelectHistoryItem && onSelectHistoryItem(item)}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1 text-white">
                    {item.amount?.toFixed(2) || "0.00"} {item.fromCurrency} →{" "}
                    <span className="text-primary">
                      {item.convertedAmount?.toFixed(2) || "0.00"}{" "}
                      {item.toCurrency}
                    </span>
                  </h5>
                  <small className="text-muted">
                    Taxa: 1 {item.fromCurrency} ={" "}
                    {item.rate ? item.rate.toFixed(6) : "0.000000"}{" "}
                    {item.toCurrency}
                  </small>
                </div>
                <small className="text-muted">
                  {new Date(item.date).toLocaleString()}
                </small>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConversionHistory;
