const bcrypt = require("bcryptjs");

async function generateHash() {
  const plainPassword = "admin123"; // đổi mật khẩu nếu muốn

  const hash = await bcrypt.hash(plainPassword, 10);

  console.log("====================================");
  console.log("PASSWORD GỐC:", plainPassword);
  console.log("HASH ĐỂ COPY VÀO DATABASE:");
  console.log(hash);
  console.log("====================================");
}

generateHash();
