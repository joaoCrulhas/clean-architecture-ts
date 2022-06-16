import SignupController from "./index";
import { EmailValidator } from "../../protocols/email-validator.protocol";

class EmailValidatorStub implements EmailValidator {
  isValid(email: string): boolean {
    return true;
  }
}
interface SutTypes {
  sut: SignupController;
  emailValidator: EmailValidator;
}
const makeSut = (): SutTypes => {
  const emailValidator = new EmailValidatorStub();
  const sut = new SignupController(emailValidator);
  return {
    sut,
    emailValidator,
  };
};

describe("Signup Controller", () => {
  test("Should return 400 if no username  is not provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "das@gmail.com",
        password: "password",
        password_confirmation: "password",
      },
    };
    const response = sut.handle(httpRequest);
    expect(response.isFailure).toBe(true);
    expect(response.isSuccess).toBe(false);
    expect(response.error).toEqual("Missing param: username");
  });
  test("Should return 400 if no password  is not provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "das@gmail.com",
        username: "name",
        password_confirmation: "password",
      },
    };
    const response = sut.handle(httpRequest);
    expect(response.isFailure).toBe(true);
    expect(response.isSuccess).toBe(false);
    expect(response.error).toEqual("Missing param: password");
  });
  test("Should return 400 if no password_confirmation is not provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "das@gmail.com",
        username: "name",
        password: "password",
      },
    };
    const response = sut.handle(httpRequest);
    expect(response.isFailure).toBe(true);
    expect(response.isSuccess).toBe(false);
    expect(response.error).toEqual("Missing param: password_confirmation");
  });
  test("Should return 400 if no email is not provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        username: "name",
        password: "password",
        password_confirmation: "password",
      },
    };
    const response = sut.handle(httpRequest);
    expect(response.isFailure).toBe(true);
    expect(response.isSuccess).toBe(false);
    expect(response.error).toEqual("Missing param: email");
  });

  test("Should return 400 if an invalid email is provided", () => {
    const { sut, emailValidator } = makeSut();
    jest.spyOn(emailValidator, "isValid").mockReturnValueOnce(false);
    const httpRequest = {
      body: {
        email: "dsadsad",
        username: "name",
        password: "password",
        password_confirmation: "password",
      },
    };
    const response = sut.handle(httpRequest);
    expect(response.isFailure).toBe(true);
    expect(response.isSuccess).toBe(false);
    expect(response.error).toEqual("Email is invalid");
  });

  test("Should call emailValidator@isValid with correct argument", () => {
    const { sut, emailValidator } = makeSut();
    const emailValidatorSpy = jest.spyOn(emailValidator, "isValid");
    const httpRequest = {
      body: {
        email: "correct_email@gmail.com",
        username: "name",
        password: "password",
        password_confirmation: "password",
      },
    };
    sut.handle(httpRequest);
    expect(emailValidatorSpy).toHaveBeenCalled();
    expect(emailValidatorSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });
});
