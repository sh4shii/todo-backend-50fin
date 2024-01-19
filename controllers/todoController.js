const asyncHandler = require("express-async-handler");
const Todo = require("../models/todoModel");

const getAllTodos = asyncHandler(async (req, res, next) => {
  try {
    const todos = await Todo.find({ user_id: req.user._id });

    if (!todos) {
      return res.status(404).json({ error: "No Todos Found" });
    }
    return res.status(200).json({ todos });
  } catch (err) {
    console.log("Error fetching todos:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const getTodoById = asyncHandler(async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    return res.status(200).json({ todo });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const addTodo = asyncHandler(async (req, res, next) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: "All fields are mandatory" });
  }

  try {
    const todo = await Todo.create({
      title,
      description,
      user_id: req.user._id,
    });
    // console.log("till here working");
    if (todo) {
      console.log(`Todo created with title ${title}`);
      return res
        .status(201)
        .json({ _id: todo._id, title: todo.title, desc: todo.description });
    } else {
      return res.status(400).json({ message: "Todo data is not valid" });
    }
  } catch (err) {
    console.error("Error creating todo:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const updateTodo = asyncHandler(async (req, res, next) => {
  const todoId = req.params.id;
  const { title, description } = req.body;
  try {
    const todo = await Todo.findById(todoId);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    if (todo.user_id.toString() !== req.user._id) {
      res.status(403).json({
        message: "You don't have the permission to update other user todos",
      });
    }
    if (!title || !description) {
      return res.status(400).json({ error: "All fields are mandatory" });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(todoId, req.body, {
      new: true,
    });
    res.status(200).json(updatedTodo);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const deleteTodo = asyncHandler(async (req, res, next) => {
  const todoId = req.params.id;

  try {
    const todo = await Todo.findById(todoId);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    if (todo.user_id.toString() !== req.user._id) {
      res.status(403).json({
        message: "You don't have the permission to delete other user todos",
      });
    }

    const result = await Todo.deleteOne({ _id: todoId });
    if (result) {
      return res.status(204).end();
    } else {
      return res.status(404).json({ success: false, error: "Todo not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = { getAllTodos, addTodo, updateTodo, getTodoById, deleteTodo };
