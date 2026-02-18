const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const rateLimiter = require("./middleware/rateLimit.middleware");
const errorHandler = require("./middleware/error.middleware");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: { origin: process.env.CLIENT_URL }
});

app.use(cors());
app.use(express.json());
app.use(rateLimiter);

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/tasks", require("./routes/task.routes"));

app.use(errorHandler);

server.listen(process.env.PORT, () =>
  console.log("Server running on port", process.env.PORT)
);
