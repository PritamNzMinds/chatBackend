import bcrypt from "bcryptjs";

export const hashPasswordGenerator = (password) => {
  try {
    const salt = 10;
    const hashedpassword = bcrypt.hashSync(password, salt);
    return hashedpassword;
  } catch (error) {
    return sendError(res, "Internal Server Error", error, 500);
  }
};

export const comparePassword = (password, hashedpassword) => {
  return bcrypt.compare(password, hashedpassword);
};