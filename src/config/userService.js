const { sql, poolPromise } = require("./db");

async function getAllUsers() {
  const pool = await poolPromise;
  if (!pool) {
    throw new Error("Không thể kết nối đến database.");
  }
  const result = await pool.request().query("SELECT * FROM tblMovie");
  return result.recordset;
}

async function getMovieByTen(ten) {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("ten", sql.NVarChar, ten)
    .query("SELECT * FROM tblMovie WHERE tenphim = @ten");
  return result.recordset[0];
}

async function getUserById(id) {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("Id", sql.Int, id)
    .query("SELECT * FROM Users WHERE Id = @Id");
  return result.recordset[0];
}

async function addUser(name, email, age) {
  const pool = await poolPromise;
  await pool
    .request()
    .input("Name", sql.NVarChar, name)
    .input("Email", sql.NVarChar, email)
    .input("Age", sql.Int, age)
    .query("INSERT INTO Users (Name, Email, Age) VALUES (@Name, @Email, @Age)");
}

async function updateUser(id, name, email, age) {
  const pool = await poolPromise;
  await pool
    .request()
    .input("Id", sql.Int, id)
    .input("Name", sql.NVarChar, name)
    .input("Email", sql.NVarChar, email)
    .input("Age", sql.Int, age)
    .query("UPDATE Users SET Name=@Name, Email=@Email, Age=@Age WHERE Id=@Id");
}

async function deleteUser(id) {
  const pool = await poolPromise;
  await pool
    .request()
    .input("Id", sql.Int, id)
    .query("DELETE FROM Users WHERE Id=@Id");
}

module.exports = {
  getMovieByTen,
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
};
