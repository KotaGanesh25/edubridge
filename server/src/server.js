require("dns").setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

require("dotenv").config();

const app = require("./app");
const connectDatabase = require("./config/database");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`EduBridge server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start EduBridge server");
    process.exit(1);
  }
};

startServer();