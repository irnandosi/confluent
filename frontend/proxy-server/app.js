// app.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const KSQLDB_URL = process.env.KSQLDB_URL || 'http://ksqldb:8088';

app.use(cors());

app.get('/sales', async (req, res) => {
  try {
    const response = await axios.post(
      `${KSQLDB_URL}/query`,
      {
        ksql: 'SELECT * FROM hourly_sales;',
        streamProperties: {}
      },
      {
        headers: {
          'Content-Type': 'application/vnd.ksql.v1+json; charset=utf-8'
        }
      }
    );

    const data = response.data;
    const rows = [];

    for (const item of data) {
      if (item.row) {
        const [product_name, hour, total] = item.row.columns;
        rows.push({ product_name, hour, total });
      }
    }

    res.json(rows);
  } catch (err) {
    console.error('Error querying ksqlDB:', err.message);
    res.status(500).json({ error: 'Failed to fetch sales data' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
