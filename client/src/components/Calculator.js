import React, { useState, useEffect } from "react";
import axios from "axios";
import "../index.css";

const getEmoji = (expression) => {
  const cleaned = expression.replace(/[()]/g, ""); // remove parentheses
  const operators = (cleaned.match(/[+\-*/%]/g) || []).length;
  const numbers = (cleaned.match(/\d+/g) || []).length;

  const complexity = operators + numbers;

  if (complexity <= 3) return "😡"; // Very basic
  if (complexity <= 5) return "😠"; // Basic
  if (complexity <= 7) return "🙂"; // Moderate
  if (complexity <= 9) return "😄"; // Complex
  return "😃"; // Very complex
};

const Calculator = () => {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [lastExpression, setLastExpression] = useState("");
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/history");
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching history", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleCalculate = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/calculate", {
        expression,
      });
      setResult(res.data.result);
      setLastExpression(expression);
      setExpression("");
      fetchHistory();
    } catch (err) {
      console.error(err);
      setResult("Error");
    }
  };

  const handleClearHistory = async () => {
    try {
      await axios.delete("http://localhost:5000/api/history");
      setHistory([]);
      setResult(""); // 🧽 Clear the result
      setLastExpression(""); // 🧽 Clear the last expression
    } catch (err) {
      console.error("Error clearing history", err);
    }
  };

  return (
    <div className="main-container">
      <div className="calculator-box">
        <h2 className="calculator-heading">🧮 Simply Calculate</h2>

        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="Enter expression (e.g. 5 + 5)"
          className="input-field"
        />

        <button onClick={handleCalculate} className="calculate-btn">
          Calculate
        </button>

        <h3 className="result">
          Result: {result} {result && getEmoji(lastExpression)}
        </h3>

        <div className="history-box">
          <h3 className="history-title">🕒 Calculation History</h3>

          {history.length === 0 ? (
            <p className="no-history-text">No calculations yet.</p>
          ) : (
            <>
              <ul className="history-list">
                {history.map((item) => (
                  <li key={item._id} className="history-item">
                    <div>
                      <strong className="expression">{item.expression}</strong>{" "}
                      = {item.result} {getEmoji(item.expression)}
                    </div>
                    <small className="timestamp">
                      {new Date(item.createdAt).toLocaleString()}
                    </small>
                  </li>
                ))}
              </ul>
              <button onClick={handleClearHistory} className="clear-btn">
                Clear History
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
