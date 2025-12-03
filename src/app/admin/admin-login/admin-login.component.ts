import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Lock, Mail } from 'lucide-angular';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  lockIcon = Lock;
  mailIcon = Mail;
  private apiUrl = 'http://localhost:3000/api';
  
  loginForm = {
    username: '',
    password: ''
  };
  
  error = '';
  loading = false;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  onSubmit() {
    this.error = '';
    this.loading = true;

    this.http.post<{ token: string; user: any }>(`${this.apiUrl}/auth/admin/login`, {
      username: this.loginForm.username,
      password: this.loginForm.password
    }).subscribe({
      next: (response) => {
        // Store admin token
        localStorage.setItem('adminToken', response.token);
        localStorage.setItem('adminLoggedIn', 'true');
        
        setTimeout(() => {
          this.router.navigate(['/admin']);
          this.loading = false;
        }, 500);
      },
      error: (error) => {
        this.error = error.error?.error || 'Email ou mot de passe incorrect';
        this.loading = false;
      }
    });
  }
}

