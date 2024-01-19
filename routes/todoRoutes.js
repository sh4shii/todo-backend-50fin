const express = require("express");
const {
  getAllTodos,
  addTodo,
  updateTodo,
  getTodoById,
  deleteTodo,
} = require("../controllers/todoController");
const validateTokenHandler = require("../middleware/validateTokenHandler");

const router = express.Router();

router.use(validateTokenHandler);

router.get("/", getAllTodos);
router.get("/:id", getTodoById);
router.post("/add", addTodo);
router.put("/update/:id", updateTodo);
router.delete("/:id", deleteTodo);

module.exports = router;
