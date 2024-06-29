import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { Account, User } from "../modals/user.modals.js";
import { userSigninSchema, userSignupSchema } from "../schema/userSchema.js";
import { errorHandler } from "../utils/error.js";

export const test = async (req, res, next) => {
  res.json({
    message: "hii there",
  });
};

export const signup = async (req, res, next) => {
  try {
    const userDetails = req.body;

    const { success } = userSignupSchema.safeParse(userDetails);

    if (!success) {
      return next(errorHandler(403, "Incorrect Inputs"));
    }

    const user = await User.findOne({ username: userDetails.username });

    if (user) {
      return next(errorHandler(401, "Username already exist"));
    }

    const newUser = new User(userDetails);
    const hashedPass = bcrypt.hashSync(newUser.password, 10);
    newUser.password = hashedPass;
    const balance = Math.floor(Math.random() * 10000 + 1);
    await newUser.save();

    const intialBalance = new Account({
      balance,
      userId: newUser._id,
    });

    await intialBalance.save();

    const payload = {
      userId: newUser.id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.status(200).json({
      message: "new user created successfully",
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const userDetails = req.body;

    const { success } = userSigninSchema.safeParse(userDetails);

    if (!success) return next(errorHandler(401, "Inputs incorrect"));

    const userExist = await User.findOne({ username: userDetails.username });

    if (!userExist) return next(errorHandler(404, "User Not found"));

    const validPass = bcrypt.compareSync(
      userDetails.password,
      userExist.password
    );

    if (!validPass) return next(errorHandler(402, "Password Incorrect"));

    //userid for signing token to it
    const payload = {
      userId: userExist._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.status(200).json({
      token: token,
    });
  } catch (error) {
    next(error);
  }
};
