const express = require("express");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 8080;

// Serve React build folder
app.use(express.static(path.join(__dirname, "build")));

// Handle React routing, serve index.html for all other requests
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
