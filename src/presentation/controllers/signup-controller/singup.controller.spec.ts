import SignupController from "./index";
import { EmailValidator } from "../../protocols/email-validator.protocol";
import {
  AddAccount,
  AccountModel,
} from "../../protocols/add-account/add-account.protocol";

class EmailValidatorStub implements EmailValidator {
  isValid(email: string): boolean {
    return true;
  }
}
class AddAccountStub implements AddAccount {
  add(account: any): AccountModel {
    return {
      id: "fakeId",
      timestamp: new Date(),
      email: account.email,
      username: account.username,
    };
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
    test("Should throw an exception if EmailValidator@isValid throw an error", () => {
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
      const response = sut.handle(httpRequest);
      expect(response.isFailure).toBe(true);
      expect(response.isSuccess).toBe(false);
      expect(response.error).toBe("Server error");
    });
    test("should return an error if password and password_confirmation are different", () => {
      const { sut } = makeSut();
      const httpRequest = {
        body: {
          email: "correct_email@gmail.com",
          username: "name",
          password: "password",
          password_confirmation: "password_error",
        },
      };
      const response = sut.handle(httpRequest);
      expect(response.isFailure).toEqual(true);
      expect(response.isSuccess).toEqual(false);
      expect(response.error).toEqual(
        "password and password_confirmation are different"
      );
    });
    test("should call addAccount at least once", () => {
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
      sut.handle(httpRequest);
      expect(addAccountSpy).toHaveBeenCalled();
    });
    test("should call addAccount with correct values", () => {
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
      sut.handle(httpRequest);
      expect(addAccountSpy).toHaveBeenCalledWith({
        email: "correct_email@gmail.com",
        username: "name",
        password: "password",
      });
    });
    test("should return an error if addAccount throws an error", () => {
      const { sut, addAccount } = makeSut();
      jest.spyOn(addAccount, "add").mockImplementation(() => {
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
      const response = sut.handle(httpRequest);
      console.log(response);
      expect(response.isFailure).toBe(true);
      expect(response.isSuccess).toBe(false);
      expect(response.error).toEqual("Error to addAccount");
    });
  });
});
