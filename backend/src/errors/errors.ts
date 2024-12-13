export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export class AuthError extends AppError {
  constructor(message: string = "Invalid credentials") {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden request") {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Not found") {
    super(404, message);
  }
}
