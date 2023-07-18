import express from "express";
const router = express.Router();

import userModule from "./modules/user.module";
router.use("/users", userModule);

import todoModule from "./modules/todo.module";
router.use("/todos", todoModule);

module.exports = router;
