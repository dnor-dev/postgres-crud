import express from "express";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());

const port = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req: any, res: any) => {
  res.status(200).json("Go to the posts route oga!");
});

// Middlewares
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    limit: "30mb",
    extended: true,
  }),
);

app.listen(port, () => console.log(`App is running on port ${port}`));
