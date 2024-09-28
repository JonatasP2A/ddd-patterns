export type NotificationErrorProps = {
  message: string;
  context: string;
};

export default class Notification {
  private errors: NotificationErrorProps[] = [];

  addError(error: NotificationErrorProps): void {
    this.errors.push(error);
  }

  getErrors(): NotificationErrorProps[] {
    return this.errors;
  }

  messages(context?: string): string {
    let filteredErrors = this.errors;

    if (context) {
      filteredErrors = this.errors.filter((error) => error.context === context);
    }

    return filteredErrors
      .map((error) => `${error.context}: ${error.message}`)
      .join(", ");
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }
}
