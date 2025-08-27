import {
  comparePassword,
  hashPasswordGenerator,
} from "../helper/passwordGenerator.js";
import { sendError, sendSuccess } from "../helper/response.js";
import { User, userSchemaValidation } from "../model/user.model.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    console.log(req.body);
    const { error } = userSchemaValidation.validate(req.body);
    if (error) {
      return sendError(res, error.message, null, 400);
    }

    const { name, email, phone, password } = req.body;

    const user = await User.findOne({ email });
    console.log(user);
    if (user) {
      return sendError(res, "User already registered", null, 400);
    }

    const hashPassword = hashPasswordGenerator(password);
    const newUser = new User({
      name,
      email,
      phone,
      password: hashPassword,
    });
    const data = await newUser.save();
    console.log(data);
    return sendSuccess(res, "User registration successfully done", data, 200);
  } catch (error) {
    console.log(error);
    sendError(res, "Internal server error", error, 500);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, "All fields are required", null, 400);
    }
    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, "No account found with this email ", null, 400);
    }
    const isPassword = comparePassword(password, user.password);
    if (!isPassword) {
      return sendError(res, "The password you entered is incorrect", null, 400);
    }
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, phone: user.phone },
      process.env.SECRET_KEY,
      { expiresIn: "14m" }
    );
    return sendSuccess(res, "Login sucess", { id: user._id, name: user.name, email: user.email, phone: user.phone, token:token }, 200);
  } catch (error) {
    return sendError(res, "Internal server error", error, 500);
  }
};
