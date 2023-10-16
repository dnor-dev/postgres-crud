import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "./data-source";
import { Routes } from "./routes";
import { errorHandler } from "./middlewares/error";
import helmet from "helmet";
import * as morgan from "morgan";

dotenv.config();

const port = process.env.PORT || 5000;

AppDataSource.initialize()
  .then(async () => {
    // create express app
    const app = express();
    app.use(express.json());

    app.use(cors());

    // Middlewares
    app.use(morgan("dev"));
    app.use(bodyParser.json());
    app.use(
      bodyParser.urlencoded({
        extended: true,
      }),
    );

    // register express routes from defined application routes
    Routes.forEach((route) => {
      app[route.method](
        route.route,
        async (req: Request, res: Response, next: NextFunction) => {
          const middlewares = route.middleware || []; // Get the middleware(s) for this route

          // Apply each middleware sequentially
          const applyMiddleware = (index: number) => {
            if (index < middlewares.length) {
              middlewares[index](req, res, (err) => {
                if (err) {
                  next(err); // Pass any errors to the error handler
                }
                applyMiddleware(index + 1); // Apply the next middleware
              });
            } else {
              continueRouteHandling();
            }
          };

          // Continue with route handling after middleware(s)
          const continueRouteHandling = () => {
            const controllerInstance = new (route.controller as any)();
            const result = controllerInstance[route.action](req, res, next);

            if (result instanceof Promise) {
              result
                .then((response) => {
                  if (response !== null && response !== undefined) {
                    res.send(response);
                  } else {
                    res.status(500);
                  }
                })
                .catch((error) => next(error));
            } else if (result !== null && result !== undefined) {
              res.json(result);
            }
          };

          // Start applying middleware(s)
          applyMiddleware(0);
        },
      );
    });

    app.use(errorHandler);

    // setup express app here
    // ...

    // start express server
    app.listen(port);
    app.use(helmet());
    app.use(helmet.xssFilter());
    console.log(`App started on port ${port}`);
  })
  .catch((error) => console.log(error));
