import { EmailValidator } from "../../protocols/email-validator.protocol";

class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
}
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
});
