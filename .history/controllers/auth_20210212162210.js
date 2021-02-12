import { User } from "../models/user.model";
import { Roles } from "../models/roles.model";
import createError from "http-errors";
import Encrypt from "../helpers/encrypt";
import {
  authSchema,
  emailSchema,
  passwordSchema,
  randomMailchema,
  changePasswordSchema,
  userEditSchema,
} from "../helpers/validateForm";
import Token from "../helpers/token";
const { hashPassword, comparePassword } = Encrypt;
import client from "../config/client";
const { clientUrl } = client;
const { createToken, verifyToken } = Token;
import Mail from "../helpers/mailer";

export default class Auth {
  static async register(request, response, next) {
    try {
      const result = await authSchema.validateAsync(request.body);
      // const emailExist = await User.findOne({ email: result.email });
      // const usernameExist = await User.findOne({ username: result.username });
      // const role = await Roles.findOne({ name: "user" });
      // if (emailExist) {
      //   throw createError.BadRequest(`${result.email} is already in use`);
      // }
      // if (usernameExist) {
      //   throw createError.BadRequest(`${result.username} is already in use`);
      // }
      // if (!role) {
      //   throw createError.BadRequest(`An Error occured please contact support`);
      // }
      result.password = hashPassword(result.password);
      // result.role = role._id;
      let user = new User(result);
      let data = await user.save();
      // let token = createToken(data._id);
      // let link = `${clientUrl}confirm-account/${token}`;
      // const options = {
      //   mail: result.email,
      //   subject: "Welcome to Good Deeds!, confirm your email",
      //   email: "../email/welcome.html",
      //   variables: { name: result.username, link: link },
      // };
      // await Mail(options);
      return response
        .status(200)
        .send(data);
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  }
  static async login(request, response, next) {
    try {
      let emailVerify = { email: request.body.email };
      const result = await emailSchema.validateAsync(emailVerify);
      const user = await User.findOne({ email: result.email })
      if (!user) {
        throw createError.BadRequest(`Email/password not valid`);
      }
      if (user.blocked) {
        throw createError.BadRequest(
          `Account with email: ${result.email} has been blocked, contact Administrator`
        );
      }
      const passwordMatch = comparePassword(
        request.body.password,
        user.password
      );
      if (passwordMatch) {
        const token = createToken(user);
        return response.status(200).send(token);
      } else {
        throw createError.BadRequest("Email/password not valid");
      }
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  }
}
