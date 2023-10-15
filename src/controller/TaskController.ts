import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Task } from "../entity/task";
import * as dotenv from "dotenv";

dotenv.config();

export class TaskController {
  private taskRepository = AppDataSource.getRepository(Task);

  async getTasks(request: Request, response: Response, next: NextFunction) {
    return await this.taskRepository.find();
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const { title, description, doneTime, notificationTime, isCompleted } =
      req.body;

    try {
      const newTask = this.taskRepository.create({
        title,
        description,
        doneTime,
        notificationTime,
        isCompleted,
      });

      const _task = await this.taskRepository.save(newTask);

      return res.status(200).json(_task);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { title, description, doneTime, notificationTime, isCompleted } =
      req.body;
    const { id } = req.params;

    try {
      const taskExist = await this.taskRepository.findOne({ where: { id } });

      if (!taskExist)
        return res.status(404).json({ message: "Record not found" });

      taskExist.title = title;
      taskExist.description = description;
      taskExist.doneTime = doneTime;
      taskExist.notificationTime = notificationTime;
      taskExist.isCompleted = isCompleted;

      const saved = await this.taskRepository.save(taskExist);
      res.status(200).json(saved);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getTask(request: Request, response: Response, next: NextFunction) {
    const { id } = request.params;

    const task = await this.taskRepository.findOne({
      where: { id },
    });

    if (!task)
      return response.status(404).json({ message: "Record not found" });

    return response.status(200).json(task);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const { id } = request.params;
    try {
      const taskExist = await this.taskRepository.findOne({
        where: { id },
      });

      if (!taskExist)
        return response.status(404).json({ message: "Record not found" });

      await this.taskRepository.remove(taskExist);
      return response.status(200).json({ message: "Task deleted" });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  }
}
