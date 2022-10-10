import { Request, Response, NextFunction } from "express";

import { Todo, RequestBody, RequestParams } from "../models/todo.js";

const todos: Todo[] = [];

const getTodos = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    todos,
  });
};

const postTodo = (req: Request, res: Response, next: NextFunction) => {
  const body = req.body as RequestBody;

  const text = body.text;
  const newTodo: Todo = {
    id: new Date().toISOString(),
    text,
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
};

const putTodo = (req: Request, res: Response, next: NextFunction) => {
  const body = req.body as RequestBody;
  const params = req.params as RequestParams;

  const requestedTodoID = params.todoID;
  const updateText = body.text;
  const indexOfTodo = todos.findIndex((todo) => todo.id === requestedTodoID);

  if (indexOfTodo > -1) {
    todos[indexOfTodo].text = updateText;

    res.status(200).json({
      message: "Todo updated successfully.",
      todo: todos[indexOfTodo],
    });
  } else {
    res
      .status(404)
      .json({ message: "Todo not found. Please enter valid todo." });
  }
};

const deleteTodo = (req: Request, res: Response, next: NextFunction) => {
  const params = req.params as RequestParams;

  const requestedTodoID = params.todoID;
  const indexOfTodo = todos.findIndex((todo) => todo.id === requestedTodoID);

  if (indexOfTodo > -1) {
    todos.splice(indexOfTodo, 1);
    res.json({
      message: "Todo deleted successfully.",
      todos: todos,
    });
  } else {
    res.status(404).json({
      message:
        "Requested todo not found. Please enter valid todo for deletion.",
    });
  }
};

export { getTodos, postTodo, putTodo, deleteTodo };
