import {
  AccountModel,
  AddAccount,
} from "../../../presentation/protocols/add-account/add-account.protocol";
import { AddAccountRequest } from "../../../presentation/protocols/add-account/add-account-request.model";
import { Encrypt } from "../../../presentation/protocols/encrypter";

class DbAccount implements AddAccount {
  constructor(private readonly encrypt: Encrypt) {}
  async add(account: AddAccountRequest): Promise<AccountModel> {
    await this.encrypt.encrypt(account.password);
    return {
      id: "id",
      username: "username",
      timestamp: new Date(),
      email: "email",
    };
  }
}

export { DbAccount };
