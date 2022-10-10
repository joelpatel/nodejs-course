import { Request, Response, NextFunction } from "express";

import { Todo } from "../models/todo.js";

// [{ title: "todo#1" }, { title: "todo#2" }]
const todos: Todo[] = [];

const getTodos = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    todos,
  });
};

const postTodo = (req: Request, res: Response, next: NextFunction) => {
  const text = req.body.text;

  const newTodo: Todo = {
    id: new Date().toISOString(),
    text,
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
};

export { getTodos, postTodo };
