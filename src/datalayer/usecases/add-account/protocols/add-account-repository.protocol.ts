import { AddAccountRequest } from "../../../../domain/add-account/add-account-request.model";
import { AccountModel } from "../../../../domain/add-account/add-account.protocol";

export interface AddAccountRepository {
  add(account: AddAccountRequest): Promise<AccountModel>;
}
