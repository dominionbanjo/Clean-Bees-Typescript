import { StatusCodes } from "http-status-codes";
import User from "../models/userModel";
import { comparePassword, hashPassword } from "../utils/passwordUtil";
import { createJWT } from "../utils/tokenUtil";
import { UnauthenticatedError, BadRequestError } from "../errors/customError";
import { Request, Response } from "express";

export const register = async (req: Request, res: Response): Promise<void> => {
  if (req.body.password) {
    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;
    const user = await User.create(req.body);
    res.status(StatusCodes.CREATED).json({ msg: "user created successfully" });
  } else {
    throw new BadRequestError("Please provide all fields");
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  if (req.body.email) {
    const user = await User.findOne({ email: req.body.email });
    const validUser: boolean | null =
      user && (await comparePassword(req.body.password, user.password));
    if (!validUser) throw new UnauthenticatedError("invalid credentials");

    const token = createJWT({
      userId: user?._id as string,
      name: user?.firstName as string,
      role: user?.role as string,
    });
    const oneDay = 1000 * 60 * 60 * 24;

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
      secure: process.env.NODE_ENV === "production",
      signed: true,
    });
    res.status(StatusCodes.OK).json({ msg: "user logged in" });
  } else {
    throw new BadRequestError("Please provide all fields");
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out" });
};
