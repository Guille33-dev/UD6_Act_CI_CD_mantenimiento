const express = require("express");
const authorRoutes = require("./routes/authorRoutes");
const bookRoutes = require("./routes/bookRoutes");
const memberRoutes = require("./routes/memberRoutes");
const authRoutes = require("./routes/authRoutes");
const healthRoutes = require("./routes/healthRoutes");
const { requestLogger } = require("./middlewares/requestLogger");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.get("/", (req, res) => {
  res.json({
    message: "API Biblioteca - Actividad Entregable UD6",
    endpoints: ["/auth", "/authors", "/books", "/members", "/health"]
  });
});

app.use("/auth", authRoutes);
app.use(healthRoutes);
app.use("/authors", authorRoutes);
app.use("/books", bookRoutes);
app.use("/members", memberRoutes);
app.use(errorHandler);

module.exports = app;
