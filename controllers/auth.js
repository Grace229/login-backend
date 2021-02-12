import { User } from "../models/user.model";
import createError from "http-errors";
import Encrypt from "../helpers/encrypt";
import {
  emailSchema,
} from "../helpers/validateForm";
import Token from "../helpers/token";
const { hashPassword, comparePassword } = Encrypt;
const { createToken } = Token;

export default class Auth {
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
        return response.status(200).json({
        user: user,
          token: token
        });
      } else {
        throw createError.BadRequest("Email/password not valid");
      }
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  }
}
