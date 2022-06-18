import SignupController from "./index";
import {
  AddAccount,
  AccountModel,
} from "../../../domain/add-account/add-account.protocol";
import { AddAccountRequest } from "../../../domain/add-account/add-account-request.model";
import {EmailValidator} from "../../../lib/email-validator/email-validator.protocol";

class EmailValidatorStub implements EmailValidator {
  isValid(email: string): boolean {
    return true;
  }
}
class AddAccountStub implements AddAccount {
  add(account: AddAccountRequest): Promise<AccountModel> {
    return Promise.resolve({
      id: "fakeId",
      timestamp: new Date(),
      email: account.email,
      username: account.username,
    });
  }
}

interface SutTypes {
  sut: SignupController;
  emailValidator: EmailValidator;
  addAccount: AddAccount;
}
const makeSut = (): SutTypes => {
  const emailValidator = new EmailValidatorStub();
  const addAccount = new AddAccountStub();
  const sut = new SignupController(emailValidator, addAccount);
  return {
    addAccount,
    emailValidator,
    sut,
  };
};

describe("Signup Controller", () => {
  describe("Signup Controller@handler", () => {
    test("Should return 400 if no username  is not provided", async () => {
      const { sut } = makeSut();
      const httpRequest = {
        body: {
          email: "das@gmail.com",
          password: "password",
          password_confirmation: "password",
        },
      };
      const response = await sut.handle(httpRequest);
      expect(response.isFailure).toBe(true);
      expect(response.isSuccess).toBe(false);
      expect(response.error).toEqual("Missing param: username");
    });
    test("Should return 400 if no password  is not provided", async () => {
      const { sut } = makeSut();
      const httpRequest = {
        body: {
          email: "das@gmail.com",
          username: "name",
          password_confirmation: "password",
        },
      };
      const response = await sut.handle(httpRequest);
      expect(response.isFailure).toBe(true);
      expect(response.isSuccess).toBe(false);
      expect(response.error).toEqual("Missing param: password");
    });
    test("Should return 400 if no password_confirmation is not provided", async () => {
      const { sut } = makeSut();
      const httpRequest = {
        body: {
          email: "das@gmail.com",
          username: "name",
          password: "password",
        },
      };
      const response = await sut.handle(httpRequest);
      expect(response.isFailure).toBe(true);
      expect(response.isSuccess).toBe(false);
      expect(response.error).toEqual("Missing param: password_confirmation");
    });
    test("Should return 400 if no email is not provided", async () => {
      const { sut } = makeSut();
      const httpRequest = {
        body: {
          username: "name",
          password: "password",
          password_confirmation: "password",
        },
      };
      const response = await sut.handle(httpRequest);
      expect(response.isFailure).toBe(true);
      expect(response.isSuccess).toBe(false);
      expect(response.error).toEqual("Missing param: email");
    });
    test("Should return 400 if an invalid email is provided", async () => {
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
      const response = await sut.handle(httpRequest);
      expect(response.isFailure).toBe(true);
      expect(response.isSuccess).toBe(false);
      expect(response.error).toEqual("Email is invalid");
    });
    test("Should call emailValidator@isValid with correct argument", async () => {
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
      await sut.handle(httpRequest);
      expect(emailValidatorSpy).toHaveBeenCalled();
      expect(emailValidatorSpy).toHaveBeenCalledWith(httpRequest.body.email);
    });
    test("Should throw an exception if EmailValidator@isValid throw an error", async () => {
      const { sut, emailValidator } = makeSut();
      jest.spyOn(emailValidator, "isValid").mockImplementation(() => {
        throw new Error("Server error");
      });
      const httpRequest = {
        body: {
          email: "correct_email@gmail.com",
          username: "name",
          password: "password",
          password_confirmation: "password",
        },
      };
      const response = await sut.handle(httpRequest);
      expect(response.isFailure).toBe(true);
      expect(response.isSuccess).toBe(false);
      expect(response.error).toBe("Server error");
    });
    test("should return an error if password and password_confirmation are different", async () => {
      const { sut } = makeSut();
      const httpRequest = {
        body: {
          email: "correct_email@gmail.com",
          username: "name",
          password: "password",
          password_confirmation: "password_error",
        },
      };
      const response = await sut.handle(httpRequest);
      expect(response.isFailure).toEqual(true);
      expect(response.isSuccess).toEqual(false);
      expect(response.error).toEqual(
        "password and password_confirmation are different"
      );
    });
    test("should call addAccount at least once", async () => {
      const { sut, addAccount } = makeSut();
      const addAccountSpy = jest.spyOn(addAccount, "add");
      const httpRequest = {
        body: {
          email: "correct_email@gmail.com",
          username: "name",
          password: "password",
          password_confirmation: "password",
        },
      };
      await sut.handle(httpRequest);
      expect(addAccountSpy).toHaveBeenCalled();
    });
    test("should call addAccount with correct values", async () => {
      const { sut, addAccount } = makeSut();
      const addAccountSpy = jest.spyOn(addAccount, "add");
      const httpRequest = {
        body: {
          email: "correct_email@gmail.com",
          username: "name",
          password: "password",
          password_confirmation: "password",
        },
      };
      await sut.handle(httpRequest);
      expect(addAccountSpy).toHaveBeenCalledWith({
        email: "correct_email@gmail.com",
        username: "name",
        password: "password",
      });
    });
    test("should return an error if addAccount throws an error", async () => {
      const { sut, addAccount } = makeSut();
      jest.spyOn(addAccount, "add").mockImplementationOnce(() => {
        throw Error("Error to addAccount");
      });
      const httpRequest = {
        body: {
          email: "correct_email@gmail.com",
          username: "name",
          password: "password",
          password_confirmation: "password",
        },
      };
      const response = await sut.handle(httpRequest);
      expect(response.isFailure).toBe(true);
      expect(response.isSuccess).toBe(false);
      expect(response.error).toEqual("Error to addAccount");
    });
    test("should return an account model if the correct values are provided", async () => {
      const { sut } = makeSut();
      const httpRequest = {
        body: {
          email: "correct_email@gmail.com",
          username: "name",
          password: "password",
          password_confirmation: "password",
        },
      };
      const response = await sut.handle(httpRequest);
      expect(response.isSuccess).toBe(true);
      expect(response.getValue()).toEqual({
        statusCode: 200,
        body: {
          id: "fakeId",
          timestamp: response.getValue()?.body.timestamp,
          email: "correct_email@gmail.com",
          username: "name",
        },
      });
      console.log(response);
    });
  });
});
