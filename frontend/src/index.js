import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetch('http://your-api/sales') // Ganti dengan URL REST API kamu
      .then((res) => res.json())
      .then((data) => setSales(data))
      .catch((err) => console.error('Failed to fetch sales:', err));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Hourly Sales</h1>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Product</th>
            <th>Hour</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((row, index) => (
            <tr key={index}>
              <td>{row.product_name}</td>
              <td>{row.hour}</td>
              <td>{row.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
