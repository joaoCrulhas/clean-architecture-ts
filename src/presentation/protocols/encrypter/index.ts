import { Result } from "../../lib/result.base";

interface Encrypt {
  encrypt(password: string): Result<string>;
}
export { Encrypt };
