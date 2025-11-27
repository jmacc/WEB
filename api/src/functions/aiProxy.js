const { app } = require('@azure/functions');

app.http('aiProxy', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed a request.`);

        try {
            const body = await request.json();
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
                'Ocp-Apim-Subscription-Key': apiKey,
                'api-key': apiKey
            };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            });

            const responseData = await response.json();

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
                    message: error.message
                })
            };
        }
    }
});
