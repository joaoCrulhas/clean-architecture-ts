import { Result } from "../../lib/result.base";

interface Encrypt {
  encrypt(password: string): Promise<Result<string>>;
}
export { Encrypt };
