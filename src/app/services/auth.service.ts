import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
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

  private users: User[] = [
    {
      id: '1',
      email: 'ahmed@example.com',
      name: 'Ahmed Ben Ali',
      phone: '+216 98 123 456',
      createdAt: '2025-01-01T00:00:00'
    },
    {
      id: '2',
      email: 'test@example.com',
      name: 'Test User',
      phone: '+216 12 345 678',
      createdAt: new Date().toISOString()
    }
  ];

  private paymentMethods: Map<string, PaymentMethod[]> = new Map();

  constructor() {
    // Load payment methods from localStorage
    this.loadPaymentMethods();
  }

  private getStoredUser(): User | null {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
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
    return new Observable(observer => {
      // Check if user already exists
      if (this.users.find(u => u.email === email)) {
        observer.error({ message: 'Cet email est déjà utilisé' });
        return;
      }

      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        phone,
        createdAt: new Date().toISOString()
      };

      this.users.push(newUser);
      this.currentUserSubject.next(newUser);
      this.saveUser(newUser);
      observer.next(newUser);
      observer.complete();
    });
  }

  login(email: string, password: string): Observable<User> {
    return new Observable(observer => {
      const user = this.users.find(u => u.email === email);
      
      if (!user) {
        observer.error({ message: 'Email ou mot de passe incorrect' });
        return;
      }

      // In a real app, verify password here
      this.currentUserSubject.next(user);
      this.saveUser(user);
      observer.next(user);
      observer.complete();
    });
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.saveUser(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
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

  updateUser(userId: string, updates: Partial<User>): void {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...updates };
      const currentUser = this.currentUserSubject.value;
      if (currentUser && currentUser.id === userId) {
        const updatedUser = { ...currentUser, ...updates };
        this.currentUserSubject.next(updatedUser);
        this.saveUser(updatedUser);
      }
    }
  }
}


