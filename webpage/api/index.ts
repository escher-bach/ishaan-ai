// server/index.ts
import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import serverless from "serverless-http";
import { registerRoutes } from "./routes.ts";
import { setupVite, serveStatic, log } from "./vite.ts"; // Also update if needed
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware to log responses for API routes
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json.bind(res);
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson(bodyJson, ...args);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "...";
      }
      log(logLine);
    }
  });

  next();
});

// Asynchronous initialization to register routes, middleware, and static assets
const initializeApp = async () => {
  try {
    console.log("Before registering routes");
    await registerRoutes(app);
    console.log("After registering routes");

    // const apiRoutes = app
    // console.log("Registered API routes:", apiRoutes);

    // Error handling middleware
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      log(`Error: ${message} (status: ${status})`);
    });

    if (app.get("env") === "development") {
      const server = createServer(app);
      await setupVite(app, server);
      if (!process.env.VERCEL) {
        const port = 5000;
        const host = "localhost";
        server.listen(port, host, () => {
          log(`Server running at http://${host}:${port}`);
        });
      }
    } else {
      serveStatic(app);
    }
  } catch (error) {
    console.error("Server failed to start:", error);
  }
};

initializeApp();

// For Vercel deployments, export the serverless handler.
export default process.env.VERCEL ? serverless(app) : app;