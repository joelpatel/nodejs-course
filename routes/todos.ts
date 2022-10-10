import { Router } from "express";

import {
  getTodos,
  postTodo,
  putTodo,
  deleteTodo,
} from "../controller/todos.js";

const router = Router();

router.get("/todos", getTodos);

router.post("/todo", postTodo);

router.put("/todo/:todoID", putTodo);

router.delete("/todo/:todoID", deleteTodo);

export default router;
