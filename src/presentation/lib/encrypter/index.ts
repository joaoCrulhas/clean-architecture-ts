import {Encrypt} from "../../protocols/encrypter";
import {Result} from "../result.base";

export class EncrypterStub implements Encrypt {
    encrypt(password: string): Result<string> {
        if (!password) {
            return Result<string>.fail("password not provided");
        }
        return Result<string>.ok("hashed_password");
    }
}