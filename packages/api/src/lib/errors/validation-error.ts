export interface ValidationErrorItem {
  path: (string | number)[];
  message: string;
}

export class ValidationError extends Error {
  public readonly statusCode: number;
  public readonly errors: ValidationErrorItem[];

  constructor(errors: ValidationErrorItem[]) {
    super("Validation error");
    this.statusCode = 400;
    this.errors = errors;
  }
}
