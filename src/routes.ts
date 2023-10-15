import { UserController } from "./controller/UserController";

export const Routes = [
  {
    method: "get",
    route: "/api/users",
    controller: UserController,
    action: "getUsers",
  },
  {
    method: "post",
    route: "/api/auth/signup",
    controller: UserController,
    action: "signup",
  },
  {
    method: "post",
    route: "/api/auth/signin",
    controller: UserController,
    action: "signin",
  },
  {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove",
  },
];
