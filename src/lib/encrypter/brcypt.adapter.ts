import { Encrypt } from "./encrypt.protocol";
import bcrypt from "bcrypt";
import { Result } from "../result.base";

class BcryptAdapter implements Encrypt {
  constructor(private readonly salt: number) {}
  async encrypt(password: string): Promise<Result<string>> {
    const response = await bcrypt.hash(password, this.salt);
    return Promise.resolve(Result<string>.ok(response));
  }
}
export { BcryptAdapter };
