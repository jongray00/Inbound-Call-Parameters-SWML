const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;

app.use(bodyParser.json());

app.post('/swml-inbound', async (req, res) => {
  // Start the process to determine 'from' and 'to' values
  determineFromAndTo(req, res);
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

  // Add connection and hangup actions
  swmlObject.sections.main.push({ connect: { "to": to, "from": "+15207834422" } });
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

    // Create the SWML script with 'to', 'from', and 'date'
    const swmlScript = createSWML(`+${from}`, to, date);

    // Send the SWML script as a JSON response
    res.json(swmlScript);
  } else {
    // If 'from' or 'to' is missing, return an error
    res.status(400).json({ error: 'Missing "from" or "to" in request body' });
  }
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
