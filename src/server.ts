import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "./data-source";
import { Routes } from "./routes";
import { errorHandler } from "./middlewares/error";

dotenv.config();

const port = process.env.PORT || 5000;

AppDataSource.initialize()
  .then(async () => {
    // create express app
    const app = express();
    // app.use(express.json());

    app.use(cors());

    // Middlewares
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
          try {
            const controller = new (route.controller as new () => any)();
            const result = await controller[route.action](req, res, next);

            if (result !== null && result !== undefined) {
              res.json(result);
            } else {
              res.status(204).send(); // Respond with a 204 No Content status
            }
          } catch (error) {
            next(error); // Pass the error to the next error handler
          }
        },
      );
    });

    app.use(errorHandler);

    // setup express app here
    // ...

    // start express server
    app.listen(port);
    console.log(`App started on port ${port}`);
  })
  .catch((error) => console.log(error));
