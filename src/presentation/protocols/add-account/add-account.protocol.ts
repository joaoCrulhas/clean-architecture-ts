import { AddAccountRequest } from "./add-account-request.model";

type AccountModel = {
  id: string;
  username: string;
  email: string;
  timestamp: Date;
};

interface AddAccount {
  add(account: AddAccountRequest): AccountModel;
}

export { AddAccount, AccountModel };
