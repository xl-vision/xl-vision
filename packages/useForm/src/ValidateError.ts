import { ErrorMap } from './FormStore';

export default class ValidateError<T> extends Error {
  errors: Partial<Record<keyof T, ErrorMap>> | ErrorMap;

  constructor(errors: Partial<Record<keyof T, ErrorMap>> | ErrorMap) {
    super();
    this.errors = errors;
  }
}
