# README for Running the SWML Inbound Call Handling Application

## Overview

This application is designed to handle inbound calls using SignalWire's SignalWire Markup Language (SWML). It dynamically generates an SWML script that responds to incoming calls by announcing the 'To', 'From', and 'Date' values of the call. The application leverages Node.js for server-side operations, Ngrok for exposing the local server to the internet, and SignalWire's API for call management.

## Prerequisites
1. **Node.js**: Ensure you have Node.js installed on your machine. You can download it from [Node.js official website](https://nodejs.org/).
2. **Ngrok**: You need Ngrok for exposing your local server to the internet. Download it from [Ngrok official website](https://ngrok.com/).
3. **SignalWire Account**: Sign up for a SignalWire account if you don't already have one. You will need it to configure your inbound number settings.

## Application Description

### What the Application Does

1. **Handles Inbound Calls**: When an inbound call is received, the application captures the 'To' and 'From' values from the call data.
2. **Generates SWML Script**: It creates an SWML script that announces the 'To', 'From', and 'Date' values of the call. This script is dynamically generated based on the call details.
3. **External API Call**: The application demonstrates how to send the captured call data to an external API using the fetch function.
4. **Logging and Notifications**: The application can be extended to log call details to an external logging service or send SMS notifications using external APIs.

### Key Features

- **Dynamic SWML Script Generation**: The application generates SWML scripts dynamically based on incoming call data.
- **External API Integration**: It includes functionality to send call details to external APIs, enabling integration with other services.
- **Easy Configuration**: The application is designed to be easily configurable with SignalWire and Ngrok for seamless deployment.

## Setup Instructions

1. **Clone the Repository**

   Clone this repository to your local machine.

   ```bash
   gh repo clone jongray00/Inbound-Call-Parameters-SWML
   cd Inbound-Call-Parameters-SWML
   ```


   ##Install Dependencies

Install the necessary dependencies using npm.

```bash
npm install
```

## Create the SWML Script Application

Save the following code in a file named swml-inbound.js.

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const port = 8080;

app.use(bodyParser.json());

app.post('/swml-inbound', async (req, res) => {
    // Start the process to determine 'from' and 'to' values
    await determineFromAndTo(req, res);
});

// Function to create the SWML script
function createSWML(from, to, date) {
    // Create the SWML object with the 'main' section
    const swmlObject = {
        version: "1.0.0",
        sections: {
            main: []
        }
    };

    // Add 'say' actions for 'to', 'from', and 'date'
    swmlObject.sections.main.push({ play: `say:To: ${to}` });
    swmlObject.sections.main.push({ play: `say:From: ${from}` });
    swmlObject.sections.main.push({ play: `say:Date: ${date}` });

    // Add hangup action
    swmlObject.sections.main.push("hangup");

    // Return the SWML script as a JSON object
    return swmlObject;
}

// Function to determine 'from' and 'to' values
async function determineFromAndTo(req, res) {
    if (req.body.call && req.body.call.from && req.body.call.to) {
        const from = req.body.call.from;
        const to = req.body.call.to;
        const date = new Date().toISOString(); // Current date and time

        console.log(`Received call from: ${from} to: ${to}`);

        // Example of how to use the 'to', 'from', and 'date' values for an external API call using fetch
        await sendExternalApiCall(from, to, date);

        // Create the SWML script with 'to', 'from', and 'date'
        const swmlScript = createSWML(`+${from}`, to, date);

        // Send the SWML script as a JSON response
        res.json(swmlScript);
    } else {
        // If 'from' or 'to' is missing, return an error
        res.status(400).json({ error: 'Missing "from" or "to" in request body' });
    }
}

// Function to send an external API call using fetch
async function sendExternalApiCall(from, to, date) {
    const apiUrl = 'https://externalapi.example.com/call-details';
    const payload = {
        from,
        to,
        date
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        console.log('External API call response:', responseData);
    } catch (error) {
        console.error('Error making external API call:', error);
    }
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
```
Run the Application

Start the application using Node.js.

```bash
node swml-inbound.js
```
Expose Your Local Server Using Ngrok


Open a new terminal window and start Ngrok to expose your local server to the internet.

```bash
ngrok http 8080
```

Copy the HTTPS forwarding URL provided by Ngrok (e.g., https://abcd1234.ngrok.io).

## Configure SignalWire to Use the External SWML Script

Log in to your SignalWire Dashboard.
Navigate to the "Phone Numbers" section.
Select or purchase the phone number you want to configure.
In the settings for your phone number, check the option "Use External URL for SWML Script handler".
Enter the Ngrok URL you copied earlier, followed by the endpoint /swml-inbound. For example: https://abcd1234.ngrok.io/swml-inbound.
Save the settings.
Test the Application

Make a call to the SignalWire phone number you configured. The SWML script should respond by announcing the 'To', 'From', and 'Date' values of the call.

Using 'to', 'from', and 'date' for Other Functions
You can extend the functionality of the SWML script by using the to, from, and date values for other actions within the script. Here are some examples:

### Logging Call Details:

You can log the call details to an external logging service or database, or use for an external API call.

```javascript
async function logCallDetails(from, to, date) {
    const apiUrl = 'https://loggingapi.example.com/log';
    const payload = {
        from,
        to,
        date
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        console.log('Log call details response:', responseData);
    } catch (error) {
        console.error('Error logging call details:', error);
    }
}

// Inside determineFromAndTo function
await logCallDetails(from, to, date);
```

