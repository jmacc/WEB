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
            console.log(`[Proxy] Requesting: ${endpoint}`);
            console.log(`[Proxy] Headers:`, JSON.stringify(headers, null, 2));
            console.log(`[Proxy] Payload:`, JSON.stringify(payload, null, 2));

            const response = await fetch(endpoint, {
              method: 'POST',
              headers: headers,
              body: JSON.stringify(payload)
            });

            const responseText = await response.text();
            console.log(`[Proxy] Upstream Status: ${response.status}`);
            console.log(`[Proxy] Upstream Body: ${responseText}`);

            if (!response.ok) {
              console.error(`[Proxy] Upstream Error Body: ${responseText}`);
            }

            res.statusCode = response.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(responseText);

          } catch (error) {
            console.error("[Proxy] Internal Error:", error);
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
