import SignupController from "./index";

describe("Signup Controller", () => {
  test("Should return 400 if no username  is not provided", () => {
    const sut = new SignupController();
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
    const sut = new SignupController();
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
    const sut = new SignupController();
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
    const sut = new SignupController();
    const httpRequest = {
      body: {
        username: "name",
        password: "das@gmail.com",
        password_confirmation: "password",
      },
    };
    const response = sut.handle(httpRequest);
    expect(response.isFailure).toBe(true);
    expect(response.isSuccess).toBe(false);
    expect(response.error).toEqual("Missing param: email");
  });
});
