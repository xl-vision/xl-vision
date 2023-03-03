export  class ValidateError extends Error {
  errors: Array<Error>;

  constructor(errors: Array<Error>) {
    super();
    this.errors = errors;
  }
}


export  class CombinedValidateError<T extends Record<string, any>> extends Error {
  errors: Partial<Record<keyof T, ValidateError>>

  constructor(errors: Record<keyof T, ValidateError>) {
    super();
    this.errors = errors;
  }
}
