const express = require("express");
const app = express();

// Simple route
app.get("/", (req, res) => {
  res.send("<h1>Hello from Azure App Service 🚀</h1><p>This is my Node.js app.</p>");
});

// Use the port from environment variable (important for Azure)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
