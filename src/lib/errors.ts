export class AuthenticationError extends Error {
  statusCode: number;
  constructor(message: string = "Unauthenticated") {
    super(message);
    this.name = "AuthorizationError";
    this.statusCode = 401;
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = "Unauthorizated") {
    super(message);
    this.name = "Unauthorized Error";
  }
}

export class UnexpectedError extends Error {
  constructor(message: string = "Unexpected") {
    super(message);
    this.name = "Unexpected Error";
  }
}

export type ActionError<R extends { statusCode: number }> = {
  ok: false;
  error: R;
};

export type ActionResult<T> = { ok: true; statusCode: number; data: T };

export function err<const R extends number, E extends { statusCode: R }>(
  e: E
): ActionError<E> {
  return { ok: false, error: e };
}

export function ok<T>(statusCode: number, data: T): ActionResult<T> {
  return { ok: true, statusCode, data };
}
