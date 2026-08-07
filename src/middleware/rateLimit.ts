import { rateLimit } from "express-rate-limit";

type RateLimitMessage = {
  message: string;
};

export function createRateLimiter(limit: number, message: RateLimitMessage) {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message,
  });
}

export const apiRateLimiter = createRateLimiter(100, {
  message: "Demasiadas solicitudes. Intenta de nuevo más tarde.",
});

export const authRateLimiter = createRateLimiter(10, {
  message: "Demasiados intentos de autenticación. Intenta de nuevo más tarde.",
});
