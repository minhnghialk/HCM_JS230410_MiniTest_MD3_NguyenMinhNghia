import express from "express";
const router = express.Router();

function removeVietnameseAccent(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

let users = [];

router.get("/", (req, res) => {
  if (req.query.id) {
    let result = users.find((user) => user.id == req.query.id);
    if (result) {
      return res.status(200).json({
        message: "OK! get user have id: " + req.query.id,
        data: result,
      });
    } else {
      return res.status(200).json({
        message: "Get failed, không có user nào tương ứng id: " + req.query.id,
      });
    }
  }

  if (req.query.search) {
    let result = [];

    users.map((user) => {
      if (
        removeVietnameseAccent(user.name + user.age)
          .toLowerCase()
          .includes(removeVietnameseAccent(req.query.search).toLowerCase())
      ) {
        result.push(user);
      }
    });

    return res.status(200).json({
      message: "OK! Result",
      data: result,
    });
  }

  return res.status(200).json({
    message: "OK! get all users",
    data: users,
  });
});

router.post("/", (req, res) => {
  if (req.body) {
    users.push(req.body);
    res.status(200).json({
      message: "OK!",
      data: users,
    });
  }
});

router.delete("/:userId", (req, res) => {
  if (req.params.userId) {
    users = users.filter((user) => user.id != req.params.userId);
    return res.status(200).json({
      message: "Xóa thành công users có id là: " + req.params.userId,
      data: users,
    });
  }
  res.status(500).json({
    message: "Vui lòng truyền param userId",
  });
});

router.put("/:userId", (req, res) => {
  if (!req.params.userId) {
    return res.status(500).json({
      message: "Vui lòng truyền userId bạn muốn update",
    });
  }
  let flag = false;
  users = users.map((user) => {
    if (user.id == req.params.userId) {
      flag = true;
      return {
        ...req.body,
        id: user.id,
      };
    }
    return user;
  });
  if (flag) {
    return res.status(200).json({
      message:
        "Cập nhật thành công thông tin của user có id là: " + req.params.userId,
      data: {
        ...req.body,
        id: req.params.userId,
      },
    });
  } else {
    return res.status(500).json({
      message: "Không tìm thấy user có id là: " + req.params.userId,
    });
  }
});

router.patch("/:userId", (req, res) => {
  let userPatch;
  if (req.params.userId) {
    let flag = false;
    users = users.map((user) => {
      if (user.id == req.params.userId) {
        flag = true;
        userPatch = {
          ...user,
          ...req.body,
        };
        return {
          ...user,
          ...req.body,
        };
      }
      return user;
    });
    if (!flag) {
      return res.status(500).json({
        message: `user có id là: ${req.params.userId} không tồn tại!`,
      });
    }

    return res.status(200).json({
      message: "Patch thành công cho user có id là: " + req.params.userId,
      data: userPatch,
    });
  }

  return res.status(500).json({
    message: "Vui lòng truyền prams userId",
  });
});

module.exports = router;
