import { Encrypt } from "../../presentation/protocols/encrypter";
import { Result } from "../result.base";

export class EncrypterStub implements Encrypt {
  async encrypt(password: string): Promise<Result<string>> {
    if (!password) {
      return Promise.reject(Result<string>.fail("password not provided"));
    }
    return Promise.resolve(Result<string>.ok("hashed_password"));
  }
}
