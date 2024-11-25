import express from "express"; // Import express
import path from "path"; // Import path for handling file paths
import { fileURLToPath } from "url"; // Needed for __dirname in ES modules

// Set up __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the "dist" directory
app.use(express.static(path.join(__dirname, "dist")));

// Handle routing for single-page application (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
