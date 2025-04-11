import React from "react";
import "../styles/global-components.css";

const ConversionHistory = ({
  history,
  onSelectHistoryItem,
  onClearHistory,
}) => {
  if (!history || history.length === 0) {
    return (
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-clock-history me-2"></i>Histórico de Operações
          </h5>
        </div>
        <div className="card-body text-center py-4">
          <p className="no-data-message">
            <i className="bi bi-journal-x me-2"></i>
            Nenhuma operação registrada
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className="bi bi-clock-history me-2"></i>Histórico de Operações
        </h5>
        <button
          onClick={onClearHistory}
          className="btn btn-sm btn-outline-danger"
        >
          <i className="bi bi-trash me-1"></i>Limpar
        </button>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-dark table-hover table-borderless mb-0">
            <thead>
              <tr className="table-header">
                <th>Data/Hora</th>
                <th>Operação</th>
                <th>Taxa</th>
                <th>Resultado</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr
                  key={index}
                  onClick={() =>
                    onSelectHistoryItem && onSelectHistoryItem(item)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <td className="text-muted">
                    {new Date(item.date).toLocaleString()}
                  </td>
                  <td>
                    <span className="fw-bold">
                      {item.amount?.toFixed(2) || "0.00"} {item.fromCurrency}
                    </span>
                  </td>
                  <td>
                    <span className="text-info">
                      1 {item.fromCurrency} ={" "}
                      {item.rate ? item.rate.toFixed(6) : "0.000000"}{" "}
                      {item.toCurrency}
                    </span>
                  </td>
                  <td>
                    <span className="text-success fw-bold">
                      {item.convertedAmount?.toFixed(2) || "0.00"}{" "}
                      {item.toCurrency}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ConversionHistory;
