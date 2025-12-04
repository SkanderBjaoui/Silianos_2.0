import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Only attach Authorization header for requests targeting the backend API
  // Avoid adding the header to third-party requests (like currency APIs) which may fail CORS preflight
  const apiBase = (window as any).API_BASE || 'https://silianos-backend.onrender.com';

  const isApiRequest = (() => {
    try {
      // If the request is absolute and starts with our API base
      if (req.url.startsWith(apiBase)) return true;
    } catch (e) {
      // ignore
    }
    // Also allow relative /api routes
    if (req.url.startsWith('/api') || req.url.includes('/api/')) return true;
    return false;
  })();

  if (token && isApiRequest) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};

