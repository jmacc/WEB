const { app } = require('@azure/functions');

app.http('aiProxy', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed a request.`);

        try {
            // robustly handle body parsing
            let body;
            try {
                body = await request.json();
            } catch (parseError) {
                return {
                    status: 400,
                    body: JSON.stringify({ error: "Invalid JSON body", details: parseError.message })
                };
            }

            const { endpoint, apiKey, payload } = body;

            if (!endpoint || !apiKey || !payload) {
                return {
                    status: 400,
                    body: JSON.stringify({ error: "Missing endpoint, apiKey, or payload" })
                };
            }

            // Headers for the upstream Azure AI service
            const headers = {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': apiKey, // Cognitive Services
                'api-key': apiKey, // Azure OpenAI
                'Authorization': `Bearer ${apiKey}`, // Azure Machine Learning
                'Prediction-Key': apiKey // Azure Custom Vision
            };

            // Use native fetch (Node 18+)
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            });

            // Handle non-JSON responses from upstream
            let responseData;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                responseData = await response.json();
            } else {
                responseData = { text: await response.text() };
            }

            if (!response.ok) {
                return {
                    status: response.status,
                    body: JSON.stringify({
                        error: "Upstream API Error",
                        details: responseData
                    })
                };
            }

            return {
                status: 200,
                body: JSON.stringify(responseData)
            };

        } catch (error) {
            context.log.error("Error in proxy:", error);
            return {
                status: 500,
                body: JSON.stringify({
                    error: "Internal Server Error",
                    message: error.message,
                    stack: error.stack
                })
            };
        }
    }
});
