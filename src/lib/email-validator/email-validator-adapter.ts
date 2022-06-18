import { EmailValidator } from "./email-validator.protocol";

class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
}
export { EmailValidatorAdapter };
