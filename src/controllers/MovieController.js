const path = require("path");
//const { connectDB } = require("../config/db");
const {
  getAllUsers,
  // addUser,
  // getUserById,
  // updateUser,
  // deleteUser,
} = require("../config/userService");

class movieController {
  async trangchu(req, res) {
    try {
      const users = await getAllUsers();
      res.render("home", { users: users }); // Đảm bảo tên biến là 'users'
    } catch (error) {
      console.error("❌ Lỗi khi lấy users:", error);
      res.status(500).send("Lỗi server");
    }
  }

  async hienthi(req, res) {
    try {
      const users = await getAllUsers();
      res.render("home", { users: users }); // Đảm bảo tên biến là 'users'
    } catch (error) {
      console.error("❌ Lỗi khi lấy users:", error);
      res.status(500).send("Lỗi server");
    }
  }
}

module.exports = new movieController();
