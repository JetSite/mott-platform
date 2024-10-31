export interface ValidationErrorItem {
  path: (string | number)[];
  message: string;
}

export class ValidationError extends Error {
  public statusCode: number;
  public errors: ValidationErrorItem[];

  constructor(errors: ValidationErrorItem[]) {
    super("Ошибка валидации");
    this.statusCode = 400;
    this.errors = errors;
  }
}
