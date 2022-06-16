import SignupController from "./index";

const makeSut = () => {
  return new SignupController();
}

describe("Signup Controller", () => {
  test("Should return 400 if no username  is not provided", () => {
    const sut = makeSut();
    const httpRequest = {
      body: {
        email: "das@gmail.com",
        password: "password",
        password_confirmation: "password",
      },
    };
    const response = sut.handle(httpRequest);
    expect(response.isFailure).toBe(true);
    expect(response.isSuccess).toBe(false);
    expect(response.error).toEqual("Missing param: username");
  });
  test("Should return 400 if no password  is not provided", () => {
    const sut = makeSut();
    const httpRequest = {
      body: {
        email: "das@gmail.com",
        username: "name",
        password_confirmation: "password",
      },
    };
    const response = sut.handle(httpRequest);
    expect(response.isFailure).toBe(true);
    expect(response.isSuccess).toBe(false);
    expect(response.error).toEqual("Missing param: password");
  });
  test("Should return 400 if no password_confirmation is not provided", () => {
    const sut = makeSut();
    const httpRequest = {
      body: {
        email: "das@gmail.com",
        username: "name",
        password: "password",
      },
    };
    const response = sut.handle(httpRequest);
    expect(response.isFailure).toBe(true);
    expect(response.isSuccess).toBe(false);
    expect(response.error).toEqual("Missing param: password_confirmation");
  });
  test("Should return 400 if no email is not provided", () => {
    const sut = makeSut();
    const httpRequest = {
      body: {
        username: "name",
        password: "password",
        password_confirmation: "password",
      },
    };
    const response = sut.handle(httpRequest);
    expect(response.isFailure).toBe(true);
    expect(response.isSuccess).toBe(false);
    expect(response.error).toEqual("Missing param: email");
  });

  test("Should return 400 if an invalid email is provided", () => {
    const sut = makeSut();
    const httpRequest = {
      body: {
        email: "dsadsad",
        username: "name",
        password: "password",
        password_confirmation: "password",
      },
    };
    const response = sut.handle(httpRequest);
    expect(response.isFailure).toBe(true);
    expect(response.isSuccess).toBe(false);
    expect(response.error).toEqual("Missing param: email");
  });
});
