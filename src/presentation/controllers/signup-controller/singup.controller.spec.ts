import SignupController from "./index";

describe("Signup Controller", () => {
  test("Should return 400 if no name is provided", () => {
    const sut = new SignupController();
    const httpRequest = {
      body: {
        password: "password",
        password_confirmation: "password",
      },
    };
    const response = sut.handle(httpRequest);
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual(new Error("Missing param: name"));
  });
});
