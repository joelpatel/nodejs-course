export interface Todo {
  id: string;
  text: string;
}

export type RequestBody = {
  text: string;
};

export type RequestParams = {
  todoID: string;
};
