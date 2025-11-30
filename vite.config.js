import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom middleware to mimic the Azure Function proxy locally
const azureAiProxyPlugin = () => {
  return {
    name: 'azure-ai-proxy',
    configureServer(server) {
      server.middlewares.use('/api/aiProxy', async (req, res, next) => {
        if (req.method !== 'POST') {
          next();
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });

        req.on('end', async () => {
          try {
            const { endpoint, apiKey, payload } = JSON.parse(body);

            if (!endpoint || !apiKey || !payload) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "Missing endpoint, apiKey, or payload" }));
              return;
            }

            const headers = {
              'Content-Type': 'application/json',
              'Ocp-Apim-Subscription-Key': apiKey,
              'api-key': apiKey,
              'Authorization': `Bearer ${apiKey}`
            };

            const response = await fetch(endpoint, {
              method: 'POST',
              headers: headers,
              body: JSON.stringify(payload)
            });

            const responseData = await response.text();

            res.statusCode = response.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(responseData);

          } catch (error) {
            console.error("Proxy Error:", error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Internal Proxy Error", details: error.message }));
          }
        });
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), azureAiProxyPlugin()],
})
