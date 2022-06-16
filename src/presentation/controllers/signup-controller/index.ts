import { HttpRequest, HttpResponse } from "../../protocols/HttpResponse";
import { Result } from "../../lib/result.base";
import { Controller } from "../../protocols/controller.protocol";

export default class SignupController implements Controller {
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
      return Result.ok<HttpResponse>(undefined);
    } catch (error: Error | any) {
      return Result.fail<HttpResponse>(error.message);
    }
  }
}
