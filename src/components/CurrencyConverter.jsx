import React, { useState, useEffect } from "react";
import { fetchExchangeRates } from "../services/api";
import "../styles/CurrencyConverter.css";

const CurrencyConverter = ({ onConversionComplete }) => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("BRL");
  const [exchangeRates, setExchangeRates] = useState({});
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [availableCurrencies, setAvailableCurrencies] = useState([
    "USD",
    "EUR",
    "BRL",
    "GBP",
    "JPY",
    "CAD",
    "AUD",
    "CNY",
  ]);

  useEffect(() => {
    const loadExchangeRates = async () => {
      try {
        setIsLoading(true);
        const data = await fetchExchangeRates(fromCurrency);
        if (data.rates) {
          setExchangeRates(data.rates);
          setAvailableCurrencies(Object.keys(data.rates).sort());
        }
      } catch (error) {
        console.error("Falha ao carregar taxas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExchangeRates();
  }, [fromCurrency]);

  useEffect(() => {
    if (exchangeRates[toCurrency]) {
      calculateConversion(amount, exchangeRates[toCurrency]);
    }
  }, [amount, toCurrency, exchangeRates]);

  const calculateConversion = (value, rate) => {
    const result = parseFloat(value) * rate;
    setConvertedAmount(result);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const conversion = {
      date: new Date().toISOString(),
      fromCurrency,
      toCurrency,
      amount: parseFloat(amount),
      convertedAmount,
      rate: exchangeRates[toCurrency],
    };

    const history = JSON.parse(
      localStorage.getItem("conversionHistory") || "[]"
    );
    localStorage.setItem(
      "conversionHistory",
      JSON.stringify([conversion, ...history].slice(0, 10))
    );

    if (onConversionComplete) {
      onConversionComplete(conversion);
    }
  };

  const currencies = availableCurrencies;

  return (
    <div className="glass-card rounded-4 shadow-lg border-0 overflow-hidden">
      <div className="card-header bg-transparent border-bottom border-secondary">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0 text-primary converter-title">
            <i className="bi bi-currency-exchange me-2"></i> Conversor de Moedas
          </h3>
          <div className="d-flex align-items-center text-info small">
            <span className="pulse-dot me-2"></span>
            <span className="live-rates">Live Rates</span>
          </div>
        </div>
      </div>

      <div className="card-body bg-transparent">
        {isLoading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Seção do Valor */}
            <div className="mb-4">
              <label
                htmlFor="amount"
                className="form-label text-light mb-2 valor-label"
              >
                Valor
              </label>
              <div
                className="input-group bg-dark bg-opacity-25 rounded-3 overflow-hidden"
                style={{ width: "280px" }}
              >
                <span className="input-group-text bg-transparent border-0 text-primary pe-1">
                  <i className="bi bi-cash fs-5"></i>
                </span>
                <input
                  type="number"
                  className="form-control form-control-sm bg-secondary bg-opacity-75 border-0 text-white"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0.01"
                  step="0.01"
                  required
                  style={{ height: "50px" }}
                />
              </div>
            </div>

            {/* Seção de Seleção de Moedas */}
            <div className="row mb-4 g-3">
              <div className="col-md-5">
                <label
                  htmlFor="fromCurrency"
                  className="form-label text-light mb-2"
                >
                  De
                </label>
                <select
                  className="form-select bg-dark bg-opacity-25 border-secondary text-white"
                  id="fromCurrency"
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  style={{ height: "50px", width: "100%" }}
                >
                  {currencies.map((currency) => (
                    <option key={`from-${currency}`} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-2 d-flex align-items-end justify-content-center">
                <button
                  type="button"
                  className="btn btn-outline-primary rounded-circle p-2 swap-btn"
                  onClick={() => {
                    const temp = fromCurrency;
                    setFromCurrency(toCurrency);
                    setToCurrency(temp);
                  }}
                  style={{ width: "40px", height: "40px" }}
                >
                  <i className="bi bi-arrow-left-right"></i>
                </button>
              </div>

              <div className="col-md-5">
                <label
                  htmlFor="toCurrency"
                  className="form-label text-light mb-2"
                >
                  Para
                </label>
                <select
                  className="form-select bg-dark bg-opacity-25 border-secondary text-white"
                  id="toCurrency"
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  style={{ height: "50px", width: "100%" }}
                >
                  {currencies.map((currency) => (
                    <option key={`to-${currency}`} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Resultado da Conversão */}
            <div className="mb-4 bg-dark bg-opacity-25 rounded-3 p-3 border border-secondary">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-1 text-white">
                    {amount} {fromCurrency} ={" "}
                    <span className="text-primary">
                      {convertedAmount.toFixed(2)} {toCurrency}
                    </span>
                  </h4>
                  <small className="text-light">
                    Taxa: 1 {fromCurrency} ={" "}
                    {exchangeRates[toCurrency]?.toFixed(4)} {toCurrency}
                  </small>
                </div>
              </div>
            </div>

            {/* Botão de Conversão */}
            <button
              type="submit"
              className="btn btn-primary w-100 py-3 rounded-3 position-relative overflow-hidden border-0"
              style={{
                background: "linear-gradient(90deg, #38b6ff 0%, #5271ff 100%)",
                fontSize: "1.1rem",
              }}
            >
              <i className="bi bi-arrow-repeat me-2"></i> Converter
              <div className="glow-effect"></div>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;
