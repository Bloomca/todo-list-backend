class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export class AuthError extends AppError {
  constructor(message: string = "Invalid credentials") {
    super(401, message);
  }
}
