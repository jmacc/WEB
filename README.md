# Azure AI Consumer App

This is a simple React application designed to consume Azure AI endpoints.

## Features
- **Configurable Endpoint**: Enter your Azure AI endpoint URL.
- **Secure Key Input**: Input your API Key (masked).
- **JSON Payload**: Send any JSON body required by your specific AI model.
- **Visual Feedback**: Loading states and formatted JSON responses.

## Local Development

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```
3.  Open the URL shown in the terminal (usually `http://localhost:5173`).

## Deployment to Azure Static Web Apps

This project is ready to be deployed to Azure Static Web Apps.

### Prerequisites
- A GitHub account.
- An Azure account.

### Steps

1.  **Push to GitHub**:
    - Initialize a git repository in this folder (if not already done).
    - Commit all files.
    - Create a new repository on GitHub and push this code.

2.  **Create Static Web App in Azure**:
    - Go to the [Azure Portal](https://portal.azure.com).
    - Search for **Static Web Apps** and click **Create**.
    - **Subscription**: Select your subscription.
    - **Resource Group**: Create new or select existing.
    - **Name**: Give your app a name (e.g., `azure-ai-consumer`).
    - **Plan Type**: Free (for hobby/personal projects).
    - **Deployment details**: Select **GitHub**.
    - **Authorize**: Click to authorize Azure to access your GitHub repositories.
    - **Organization/Repository/Branch**: Select the repo you just created.
    - **Build Presets**: Select **React**.
    - **App location**: `/` (or `/WEB` if you pushed the parent folder).
    - **Output location**: `dist`.
    - Click **Review + create** -> **Create**.

3.  **Done!**: Azure will automatically build and deploy your app. You will get a public URL.

## Usage Note
Since this is a client-side application, your API Key is sent from the browser. This is acceptable for learning and prototypes, but for production apps, consider using an Azure Function as a proxy to hide your keys.
