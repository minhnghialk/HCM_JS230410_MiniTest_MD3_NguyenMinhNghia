import express from "express";
const router = express.Router();
import fs from "fs";
import path from "path";
import multiparty from "multiparty";

router.get("/", (req, res) => {
  fs.readFile(path.join(__dirname, "todo.json"), "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({
        message: "Lấy todos thất bại!",
      });
    }
    return res.status(200).json({
      message: "Lấy todos thành công!",
      data: JSON.parse(data),
    });
  });
});

router.delete("/:todoId", (req, res) => {
  if (req.params.todoId) {
    fs.readFile(path.join(__dirname, "todo.json"), "utf-8", (err, data) => {
      if (err) {
        return res.status(500).json({
          message: "Lấy todos thất bại!",
        });
      }
      let todos = JSON.parse(data);
      let todoDelete = todos.find((todo) => todo.id == req.params.todoId);
      todos = todos.filter((todo) => todo.id != req.params.todoId);

      fs.writeFile(
        path.join(__dirname, "todo.json"),
        JSON.stringify(todos),
        (err) => {
          if (err) {
            return res.status(500).json({
              message: "Lưu file thất bại!",
            });
          }
          res.sendStatus(200);
        }
      );
    });
  } else {
    return res.status(500).json({
      message: "Vui lòng truyền todoId!",
    });
  }
});

router.post("/", (req, res) => {
  let form = new multiparty.Form();

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).send("Lỗi đọc form!");
    }

    let newTodo = {
      id: Date.now(),
      name: fields.name[0],
      completed: false,
    };

    fs.readFile(path.join(__dirname, "todo.json"), "utf-8", (err, data) => {
      if (err) {
        return res.status(500).json({
          message: "Đọc dữ liệu thất bại!",
        });
      }

      let oldData = JSON.parse(data);
      oldData.push(newTodo);

      fs.writeFile(
        path.join(__dirname, "todo.json"),
        JSON.stringify(oldData),
        (err) => {
          if (err) {
            return res.status(500).json({
              message: "Ghi file thất bại!",
            });
          }
          return res.redirect("/todos");
        }
      );
    });
  });
});

router.delete("/", (req, res) => {
  fs.writeFile(path.join(__dirname, "todo.json"), "[]", (err) => {
    if (err) {
      return res.status(500).json({
        message: "Xoá tất cả các tasks thất bại!",
      });
    }
    res.sendStatus(200);
  });
});

router.put("/:todoId", (req, res) => {
  if (req.params.todoId) {
    fs.readFile(path.join(__dirname, "todo.json"), "utf-8", (err, data) => {
      if (err) {
        return res.status(500).json({
          message: "Lấy todos thất bại!",
        });
      }
      let todos = JSON.parse(data);
      let todoToUpdate = todos.find((todo) => todo.id == req.params.todoId);

      if (!todoToUpdate) {
        return res.status(404).json({
          message: "Không tìm thấy task!",
        });
      }

      todoToUpdate.completed = !todoToUpdate.completed;

      fs.writeFile(
        path.join(__dirname, "todo.json"),
        JSON.stringify(todos),
        (err) => {
          if (err) {
            return res.status(500).json({
              message: "Lưu file thất bại!",
            });
          }
          res.sendStatus(200);
        }
      );
    });
  } else {
    return res.status(500).json({
      message: "Vui lòng truyền todoId!",
    });
  }
});

module.exports = router;
