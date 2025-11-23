export interface ITokenService {
  sign(payload: object, options?: object): string;
  verify<T extends object = any>(token: string, options?: object): T;
}

export const TOKEN_SERVICE = Symbol('ITokenService');
