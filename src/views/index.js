import axios from "axios";
import express from "express";
const router = express.Router();
import fs from "fs";
import path from "path";

router.use("/todos", (req, res) => {
  fs.readFile(
    path.join(__dirname, "templates/todo.html"),
    "utf-8",
    async (err, data) => {
      if (err) {
        return res.send("Load ui error");
      }

      let tableContent = ``;

      let todos;

      await axios
        .get("http://localhost:3000/api/v1/todos")
        .then((res) => {
          todos = res.data.data;
        })
        .catch((err) => {
          todos = [];
        });

      todos.map((todo, index) => {
        tableContent += `
          <tr id="task-${todo.id}" class="${todo.completed ? "completed" : ""}">
            <th scope="row">${index + 1}</th>
            <td>
              <input
                type="checkbox"
                style="margin-right:10px"
                onclick="updateTodoStatus(${todo.id})"
                ${todo.completed ? "checked" : ""}
              />
              ${todo.name}
            </td>
            <td>
              <button onclick={deleteTodo(event,${
                todo.id
              })} style="border-radius: 50px; background: #fff">
                Delete
              </button>
            </td>
          </tr>
        `;
      });

      res.send(data.replace("{{tableContent}}", tableContent));
    }
  );
});

module.exports = router;
