import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { NextFunction } from "express";

dotenv.config();

const AuthMiddleware = async (req: any, res: any, next: NextFunction) => {
  try {
    let decodedData;
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedData?.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default AuthMiddleware;
