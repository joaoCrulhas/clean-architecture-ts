import { EmailValidator } from "../../presentation/protocols/email-validator.protocol";
import { EmailValidatorAdapter } from "./email-validator-adapter";

describe("EmailValidator adapter", () => {
  test("should return false if validator returns false", () => {
    const sut = new EmailValidatorAdapter();
    const response = sut.isValid("valid_mail@");
    expect(response).toBe(false);
    console.log(response);
  });
  test("should return false if validator returns false", () => {
    const sut = new EmailValidatorAdapter();
    const response = sut.isValid("valid_mail@gmail.com");
    expect(response).toBe(true);
  });
  test("should call validator with correct arguments", () => {
    const sut = new EmailValidatorAdapter();
    const emailValidatorSpy = jest.spyOn(sut, "isValid");
    sut.isValid("valid_mail@gmail.com");
    expect(emailValidatorSpy).toHaveBeenCalled();
    expect(emailValidatorSpy).toHaveBeenCalledWith("valid_mail@gmail.com");
  });
});
