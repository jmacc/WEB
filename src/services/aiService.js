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

    const headers = {
        'Content-Type': 'application/json',
        // Common header for Azure Cognitive Services
        'Ocp-Apim-Subscription-Key': apiKey,
        // Common header for Azure OpenAI (fallback/alternative)
        'api-key': apiKey
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
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
