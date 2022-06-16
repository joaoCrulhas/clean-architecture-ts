import { HttpRequest, HttpResponse } from "../../protocols/HttpResponse";
import { Result } from "../../lib/result.base";
import { Controller } from "../../protocols/controller.protocol";
import { EmailValidator } from "../../protocols/email-validator.protocol";

export default class SignupController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}
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
      const { email } = httpRequest.body;
      if (!this.emailValidator.isValid(email)) {
        return Result.fail<HttpResponse>(`Email is invalid`);
      }
      return Result.ok<HttpResponse>(undefined);
    } catch (error: Error | any) {
      return Result.fail<HttpResponse>(error.message);
    }
  }
}
