const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const KSQLDB_URL = process.env.KSQLDB_URL || 'http://ksqldb-route-confluent.apps.ocpdemo.imid.local:8088'; // Default internal svc

app.use(cors({
  origin: '*', // Atur ke domain frontend kalau perlu
  methods: ['GET'],
  allowedHeaders: ['Content-Type']
}));

// Contoh query: Aggregated hourly sales per product
app.get('/sales', async (req, res) => {
  const ksqlQuery = {
    ksql: `
      SELECT product_name, FLOOR(EXTRACT(HOUR FROM purchased_at)) AS hour, SUM(quantity) AS total
      FROM purchases_stream
      WINDOW TUMBLING (SIZE 1 HOUR)
      GROUP BY product_name, FLOOR(EXTRACT(HOUR FROM purchased_at))
      EMIT CHANGES
      LIMIT 100;
    `,
    streamsProperties: {}
  };

  try {
    const response = await fetch(`${KSQLDB_URL}/query-stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/vnd.ksql.v1+json' },
      body: JSON.stringify(ksqlQuery)
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true }).trim();

      chunk.split('\n').forEach(line => {
        try {
          const data = JSON.parse(line);
          if (data.row) {
            const [product_name, hour, total] = data.row.columns;
            result.push({ product_name, hour, total });
          }
        } catch (e) {
          // Skip malformed JSON lines
        }
      });
    }

    res.json(result);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Failed to query ksqlDB' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server running on port ${PORT}`);
});
