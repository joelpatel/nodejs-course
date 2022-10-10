// [{ title: "todo#1" }, { title: "todo#2" }]
const todos = [];
const getTodos = (req, res, next) => {
    res.status(200).json({
        todos,
    });
};
const postTodo = (req, res, next) => {
    const text = req.body.text;
    const newTodo = {
        id: new Date().toISOString(),
        text,
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
};
export { getTodos, postTodo };
