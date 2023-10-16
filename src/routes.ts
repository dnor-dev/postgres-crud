import { UserController } from "./controller/UserController";
import { TaskController } from "./controller/TaskController";
import AuthMiddleware from "./middlewares/auth";

export const Routes = [
  {
    method: "get",
    route: "/api/users",
    controller: UserController,
    action: "getUsers" /*List of users */,
    middleware: [AuthMiddleware],
  },
  {
    method: "post",
    route: "/api/auth/signup",
    controller: UserController,
    action: "signup" /*Create User */,
  },
  {
    method: "post",
    route: "/api/auth/signin",
    controller: UserController,
    action: "signin" /*User Login*/,
  },

  {
    method: "post",
    route: "/api/task",
    controller: TaskController,
    action: "create" /*Create Task*/,
    middleware: [AuthMiddleware],
  },
  {
    method: "put",
    route: "/api/task/:id",
    controller: TaskController,
    action: "update" /*Update Task*/,
    middleware: [AuthMiddleware],
  },
  {
    method: "get",
    route: "/api/task/:id",
    controller: TaskController,
    action: "getTask" /*Get Task*/,
    middleware: [AuthMiddleware],
  },
  {
    method: "delete",
    route: "/api/task/:id",
    controller: TaskController,
    action: "remove" /*Remove task*/,
    middleware: [AuthMiddleware],
  },
  {
    method: "get",
    route: "/api/task",
    controller: TaskController,
    action: "getTasks" /*All tasks*/,
    middleware: [AuthMiddleware],
  },
];
