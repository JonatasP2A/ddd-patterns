import Notification from "./notification";

describe("Unit Test notification", () => {
  it("should create errors", () => {
    const notification = new Notification();
    const error = {
      message: "error message",
      context: "customer",
    }
    notification.addError(error);

    const error2 = {
      message: "error message 2",
      context: "customer",
    }
    notification.addError(error2);

    const error3 = {
      message: "error message 3",
      context: "order",
    }
    notification.addError(error3);

    expect(notification.messages("customer")).toBe(
      "customer: error message, customer: error message 2"
    );
  })

  it("should create and list all errors", () => {
    const notification = new Notification();
    const error = {
      message: "error message",
      context: "customer",
    }
    notification.addError(error);

    const error2 = {
      message: "error message 2",
      context: "customer",
    }
    notification.addError(error2);

    const error3 = {
      message: "error message 3",
      context: "order",
    }
    notification.addError(error3);

    expect(notification.messages()).toBe(
      "customer: error message, customer: error message 2, order: error message 3"
    );
  })

  it("should check if notification has at least one error", () => {
    const notification = new Notification();
    const error = {
      message: "error message",
      context: "customer",
    }
    notification.addError(error);

    expect(notification.hasErrors()).toBe(true);
  });

  it("should get all errors props", () => {
    const notification = new Notification();
    const error = {
      message: "error message",
      context: "customer",
    }
    notification.addError(error);

    expect(notification.getErrors()).toEqual([error]);
  })
});