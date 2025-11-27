/**
 * Service to handle Azure AI API calls.
 * 
 * @param {string} endpoint - The full URL of the Azure AI endpoint.
 * @param {string} apiKey - The API key for authentication.
 * @param {object} payload - The JSON body to send.
 * @returns {Promise<any>} - The JSON response from the API.
 */
export const callAzureAI = async (endpoint, apiKey, payload) => {
    if (!endpoint || !apiKey) {
        throw new Error("Endpoint and API Key are required.");
    }

    try {
        // We now call our own backend API (Azure Function)
        // This avoids CORS issues because the browser calls the same origin,
        // and the server-side function calls the external Azure AI service.
        const response = await fetch('/api/aiProxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                endpoint,
                apiKey,
                payload
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Azure AI Service Error:", error);
        throw error;
    }
};
