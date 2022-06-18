import { HttpRequest, HttpResponse } from "../../protocols/HttpResponse";
import { Result } from "../../../lib/result.base";
import { Controller } from "../../protocols/controller.protocol";
import { EmailValidator } from "../../protocols/email-validator.protocol";
import { AddAccount } from "../../../domain/add-account/add-account.protocol";

export default class SignupController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}
  async handle(httpRequest: HttpRequest): Promise<Result<HttpResponse>> {
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
      const { email, password, password_confirmation, username } =
        httpRequest.body;
      if (!this.emailValidator.isValid(email)) {
        return Result.fail<HttpResponse>(`Email is invalid`);
      }
      if (password !== password_confirmation) {
        return Result.fail<HttpResponse>(
          `password and password_confirmation are different`
        );
      }
      const account = await this.addAccount.add({ username, email, password });
      const response: HttpResponse = {
        statusCode: 200,
        body: account,
      };
      return new Promise(resolve => {
        resolve(Result.ok<HttpResponse>(response));
      });
    } catch (error: Error | any) {
      return Result.fail<HttpResponse>(error.message);
    }
  }
}
