import { HttpRequest, HttpResponse } from "../../protocols/HttpResponse";
import { Result } from "../../lib/result.base";
import { Controller } from "../../protocols/controller.protocol";
import { EmailValidator } from "../../protocols/email-validator.protocol";
import {AddAccount} from "../../protocols/add-account/add-account.protocol";

export default class SignupController implements Controller {
  constructor(private readonly emailValidator: EmailValidator, private readonly addAccount: AddAccount) {}
  handle(httpRequest: HttpRequest): Result<HttpResponse> {
    try {
      const requiredFields = [
        "email",
        "password",
        "password_confirmation",
        "username",
      ];
      requiredFields.forEach(requiredField => {
        if (!httpRequest.body[requiredField]) {
          throw Error(`Missing param: ${requiredField}`);
        }
      });
      const { email, password, password_confirmation, username } = httpRequest.body;
      if (!this.emailValidator.isValid(email)) {
        return Result.fail<HttpResponse>(`Email is invalid`);
      }
      if(password !== password_confirmation) {
        return Result.fail<HttpResponse>(`password and password_confirmation are different`);
      }
      this.addAccount.add({username,email,password});
      return Result.ok<HttpResponse>(undefined);
    } catch (error: Error | any) {
      return Result.fail<HttpResponse>(error.message);
    }
  }
}
