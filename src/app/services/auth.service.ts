import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, catchError, throwError, of } from 'rxjs';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  preferredCurrency?: string;
  createdAt: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  bankName?: string;
  accountNumber?: string;
  isDefault: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = 'http://localhost:3000/api';
  private guestCurrencyKey = 'guestPreferredCurrency';
  private preferredCurrencySubject = new BehaviorSubject<string>(this.getInitialCurrency());
  public preferredCurrency$ = this.preferredCurrencySubject.asObservable();

  private paymentMethods: Map<string, PaymentMethod[]> = new Map();

  constructor(private http: HttpClient) {
    // Load payment methods from localStorage
    this.loadPaymentMethods();
    // Immediately restore user from localStorage (optimistic restore)
    // Then verify token in background
    this.restoreSessionOptimistic();
  }

  private getInitialCurrency(): string {
    const storedUser = this.getStoredUser();
    const guestCurrency = this.getGuestPreferredCurrency();
    return storedUser?.preferredCurrency || guestCurrency || 'TND';
  }

  private normalizeUser(user: User | null): User | null {
    if (!user) {
      return null;
    }
    return {
      ...user,
      preferredCurrency: user.preferredCurrency || 'TND'
    };
  }

  private getStoredUser(): User | null {
    const stored = localStorage.getItem('currentUser');
    return stored ? this.normalizeUser(JSON.parse(stored)) : null;
  }

  private saveUser(user: User | null): void {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }

  private loadPaymentMethods(): void {
    const stored = localStorage.getItem('paymentMethods');
    if (stored) {
      this.paymentMethods = new Map(JSON.parse(stored));
    }
  }

  private savePaymentMethods(): void {
    const data = Array.from(this.paymentMethods.entries());
    localStorage.setItem('paymentMethods', JSON.stringify(data));
  }

  signup(email: string, password: string, name: string, phone?: string): Observable<User> {
    return this.http.post<{ token: string; user: User }>(`${this.apiUrl}/auth/user/register`, {
      email,
      password,
      name,
      phone
    }).pipe(
      map(response => {
        // Store token in localStorage (persists for 7 days)
        localStorage.setItem('authToken', response.token);
        
        // Store user in localStorage
        const normalized = this.normalizeUser(response.user)!;
        this.currentUserSubject.next(normalized);
        this.saveUser(normalized);
        this.preferredCurrencySubject.next(normalized.preferredCurrency || 'TND');
        return normalized;
      }),
      catchError(error => {
        const errorMessage = error.error?.error || 'Une erreur est survenue lors de l\'inscription';
        return throwError(() => ({ message: errorMessage }));
      })
    );
  }

  /**
   * Check whether a phone number is already registered.
   * Backend should expose an endpoint like: GET /auth/user/check-phone?phone=...
   * Returns true if the phone is already in use. On network/server error we return false
   * to avoid blocking signup when the check endpoint is not available.
   */
  checkPhoneExists(phone: string): Observable<boolean> {
    if (!phone) {
      return of(false);
    }

    const primary = `${this.apiUrl}/auth/user/check-phone?phone=${encodeURIComponent(phone)}`;
    const fallback = `${this.apiUrl}/users?phone=${encodeURIComponent(phone)}`;

    // Try the dedicated check endpoint first; if it fails, try a generic users endpoint and inspect results.
    return this.http.get<{ exists?: boolean }>(primary).pipe(
      map(resp => !!resp.exists),
      catchError(() => {
        // Fallback: try GET /users?phone=...
        return this.http.get<any>(fallback).pipe(
          map(resp => {
            // If backend returns an array of users or an object, detect existence.
            if (!resp) return false;
            if (Array.isArray(resp)) return resp.length > 0;
            if (typeof resp === 'object') {
              // Common shape: { exists: true } or { users: [...] }
              if (typeof resp.exists === 'boolean') return resp.exists;
              if (Array.isArray(resp.users)) return resp.users.length > 0;
              // If it's a single user object with phone property
              if (resp.phone) return true;
            }
            return false;
          }),
          catchError(() => of(false))
        );
      })
    );
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<{ token: string; user: User }>(`${this.apiUrl}/auth/user/login`, {
      email,
      password
    }).pipe(
      map(response => {
        // Store token in localStorage (persists for 7 days)
        localStorage.setItem('authToken', response.token);
        
        // Store user in localStorage
        const normalized = this.normalizeUser(response.user)!;
        this.currentUserSubject.next(normalized);
        this.saveUser(normalized);
        this.preferredCurrencySubject.next(normalized.preferredCurrency || 'TND');
        return normalized;
      }),
      catchError(error => {
        const errorMessage = error.error?.error || 'Email ou mot de passe incorrect';
        return throwError(() => ({ message: errorMessage }));
      })
    );
  }

  logout(): void {
    this.clearSession();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    // Check if we have a token and either a current user or stored user
    // This ensures authentication works even during async session restoration
    const hasUser = this.currentUserSubject.value !== null || this.getStoredUser() !== null;
    return token !== null && hasUser;
  }

  /**
   * Optimistically restore user session from localStorage
   * Then verify token with backend in background
   * This ensures user stays logged in during page refresh
   */
  private restoreSessionOptimistic(): void {
    const token = this.getToken();
    const storedUser = this.getStoredUser();
    
    if (!token) {
      // No token found, clear any stale user data
      this.currentUserSubject.next(null);
      this.saveUser(null);
      this.preferredCurrencySubject.next(this.getInitialCurrency());
      return;
    }

    // If we have a stored user, restore it immediately (optimistic)
    // This prevents logout during page refresh
    if (storedUser) {
      this.currentUserSubject.next(storedUser);
      this.preferredCurrencySubject.next(storedUser.preferredCurrency || 'TND');
    }

    // Verify token with backend in background
    // The backend will return a new token to refresh the 7-day timer
    // The auth interceptor will automatically add the Authorization header
    this.http.get<{ token?: string; user: User; type: string }>(`${this.apiUrl}/auth/verify`).subscribe({
      next: (response) => {
        if (response.type === 'user' && response.user) {
          // Token is valid, update user session with fresh data
          const normalized = this.normalizeUser(response.user)!;
          this.currentUserSubject.next(normalized);
          this.saveUser(normalized);
           this.preferredCurrencySubject.next(normalized.preferredCurrency || 'TND');
          
          // If backend returned a new token, update it to refresh the 7-day timer
          if (response.token) {
            localStorage.setItem('authToken', response.token);
          }
        } else {
          // Invalid token type or no user
          this.clearSession();
        }
      },
      error: (error) => {
        // Only clear session if token is actually invalid (401/403)
        // Don't clear on network errors - keep user logged in with stored data
        if (error.status === 401 || error.status === 403) {
          // Token is invalid or expired, clear session
          this.clearSession();
        }
        // For other errors (network, server errors), keep the session
        // The user can continue using the app with cached data
      }
    });
  }

  /**
   * Clear session and remove all stored data
   */
  private clearSession(): void {
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
    this.saveUser(null);
    this.preferredCurrencySubject.next(this.getInitialCurrency());
  }

  getGuestPreferredCurrency(): string | null {
    return localStorage.getItem(this.guestCurrencyKey);
  }

  setGuestPreferredCurrency(currency: string): void {
    localStorage.setItem(this.guestCurrencyKey, currency);
    this.preferredCurrencySubject.next(currency);
  }

  getEffectiveCurrency(): string {
    return this.currentUserSubject.value?.preferredCurrency || this.getGuestPreferredCurrency() || 'TND';
  }

  // Payment Methods
  getPaymentMethods(userId: string): PaymentMethod[] {
    return this.paymentMethods.get(userId) || [];
  }

  addPaymentMethod(userId: string, method: Omit<PaymentMethod, 'id'>): PaymentMethod {
    const methods = this.getPaymentMethods(userId);
    
    // If this is the first method or marked as default, set it as default
    if (method.isDefault || methods.length === 0) {
      methods.forEach(m => m.isDefault = false);
    }

    const newMethod: PaymentMethod = {
      ...method,
      id: Date.now().toString()
    };

    methods.push(newMethod);
    this.paymentMethods.set(userId, methods);
    this.savePaymentMethods();
    return newMethod;
  }

  removePaymentMethod(userId: string, methodId: string): void {
    const methods = this.getPaymentMethods(userId);
    const filtered = methods.filter(m => m.id !== methodId);
    this.paymentMethods.set(userId, filtered);
    this.savePaymentMethods();
  }

  setDefaultPaymentMethod(userId: string, methodId: string): void {
    const methods = this.getPaymentMethods(userId);
    methods.forEach(m => {
      m.isDefault = m.id === methodId;
    });
    this.paymentMethods.set(userId, methods);
    this.savePaymentMethods();
  }

  updateUser(userId: string, updates: { name?: string; email?: string; phone?: string; preferredCurrency?: string }): Observable<User> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => ({ message: 'No authentication token' }));
    }

    return this.http.put<{ user: User }>(`${this.apiUrl}/auth/user/profile`, updates, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      map(response => {
        const updatedUser = this.normalizeUser(response.user)!;
        this.currentUserSubject.next(updatedUser);
        this.saveUser(updatedUser);
        // Clear guest preference when user saves theirs
        if (updates.preferredCurrency) {
          localStorage.removeItem(this.guestCurrencyKey);
        }
        this.preferredCurrencySubject.next(updatedUser.preferredCurrency || this.getInitialCurrency());
        return updatedUser;
      }),
      catchError(error => {
        const errorMessage = error.error?.error || 'Erreur lors de la mise à jour du profil';
        return throwError(() => ({ message: errorMessage }));
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}


