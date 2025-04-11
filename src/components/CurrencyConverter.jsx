import React, { useState, useEffect } from "react";
import { fetchExchangeRates } from "../services/api";
import "../styles/global-components.css";

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
    "CHF",
    "MXN",
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
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className="bi bi-currency-exchange me-2"></i> Câmbio de Moedas
        </h5>
        <div className="market-status">
          <span className="market-indicator"></span>
          <span className="market-status-text">Taxas ao vivo</span>
        </div>
      </div>

      <div className="card-body">
        {isLoading ? (
          <div className="loading-container">
            <div className="market-spinner"></div>
            <span>Carregando cotações...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Valor</label>
              <div className="input-group">
                <span className="input-group-text">{fromCurrency}</span>
                <input
                  type="number"
                  className="form-control"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="row g-2 mb-3">
              <div className="col-md-5">
                <label className="form-label">De</label>
                <select
                  className="form-select"
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
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
                  className="btn btn-swap"
                  onClick={() => {
                    const temp = fromCurrency;
                    setFromCurrency(toCurrency);
                    setToCurrency(temp);
                  }}
                >
                  <i className="bi bi-arrow-left-right"></i>
                </button>
              </div>

              <div className="col-md-5">
                <label className="form-label">Para</label>
                <select
                  className="form-select"
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                >
                  {currencies.map((currency) => (
                    <option key={`to-${currency}`} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="conversion-result mb-3">
              <div className="result-display">
                <span className="result-amount">
                  {convertedAmount.toFixed(2)}
                </span>
                <span className="result-currency">{toCurrency}</span>
              </div>
              <div className="rate-display">
                <span>
                  1 {fromCurrency} = {exchangeRates[toCurrency]?.toFixed(6)}{" "}
                  {toCurrency}
                </span>
              </div>
            </div>

            <button type="submit" className="btn btn-execute w-100">
              EXECUTAR CONVERSÃO
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;
