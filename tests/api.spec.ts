const { test, expect, request } = require('@playwright/test');

const loginPayload = {
  userEmail: "henryrichard123@gmail.com",
  userPassword: "Henry123@"
};

test.beforeAll(async () => {
  const apiContext = await request.newContext();

  const loginResponse = await apiContext.post(
    "https://rahulshettyacademy.com/api/ecom/auth/login",
    {
      data: loginPayload
    }
  );

  expect(loginResponse.ok()).toBeTruthy();

  const loginResponseJson = await loginResponse.json();
  console.log(loginResponseJson);

  const token = loginResponseJson.token;

  console.log(token);
});

test("Sample Test", async () => {
  console.log("Sample Test");
});