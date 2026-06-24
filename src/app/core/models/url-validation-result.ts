/** Result of validating and normalizing a user-supplied URL. */
export interface UrlValidationResult {
  readonly valid: boolean;
  readonly url: string;
  readonly error: string;
}
