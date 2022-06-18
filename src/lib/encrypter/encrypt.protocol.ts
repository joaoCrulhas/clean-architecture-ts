import { Result } from "../result.base";

interface Encrypt {
  encrypt(password: string): Promise<Result<string>>;
}
export { Encrypt };
