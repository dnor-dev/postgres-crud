import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

export class UserController {
  private userRepository = AppDataSource.getRepository(User);

  async getUsers(request: Request, response: Response, next: NextFunction) {
    try {
      return await this.userRepository.find();
    } catch (error) {
      return response.status(500).json({ message: "Something went wrong." });
    }
  }

  async signup(req: Request, res: Response, next: NextFunction) {
    const { email, password, confirmPassword } = req.body;

    try {
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });
      const saltRounds = 10;
      const hash = bcrypt.hashSync(password, saltRounds);

      if (existingUser)
        return res.status(500).json({ message: "User already exists" });

      if (password !== confirmPassword)
        return res.status(500).json({ message: "Passwords do not match" });

      const newUser = this.userRepository.create({
        email,
        password: hash,
      });

      const _user = await this.userRepository.save(newUser);

      const token = jwt.sign(
        { email: newUser.email, id: _user.id },
        process.env.JWT_SECRET,
        { expiresIn: "30d" },
      );

      return res.status(200).json({ _user, token });
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong." });
    }
  }

  async signin(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    try {
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });

      if (!existingUser)
        return res.status(404).json({ message: "User not found" });

      const isPasswordCorrect = bcrypt.compareSync(
        password,
        existingUser.password,
      );

      if (!isPasswordCorrect)
        return res.status(400).json({ message: "Invalid Credentials." });

      const token = jwt.sign(
        { email: existingUser.email, id: existingUser.id },
        process.env.JWT_SECRET,
        { expiresIn: "30d" },
      );

      res.status(200).json({ token });
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong." });
    }
  }
}
