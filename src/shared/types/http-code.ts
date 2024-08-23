export enum HttpStatusCode {
  // Informativos
  Continue = 100,
  SwitchingProtocols = 101,

  // Éxitos
  OK = 200,
  Created = 201,
  Accepted = 202,
  NoContent = 204,

  // Redirecciones
  MovedPermanently = 301,
  Found = 302,
  SeeOther = 303,
  NotModified = 304,

  // Errores del Cliente
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  Conflict = 409,


  // Errores del Servidor
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504
}