import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  
  loginForm = {
    email: '',
    password: ''
  };
  
  error = '';
  loading = false;

  constructor(private router: Router) {}

  onSubmit() {
    this.error = '';
    this.loading = true;

    // Temporary authentication (will be replaced with backend)
    if (this.loginForm.email === 'admin@silianos.com' && this.loginForm.password === 'admin123') {
      localStorage.setItem('adminLoggedIn', 'true');
      setTimeout(() => {
        this.router.navigate(['/admin']);
        this.loading = false;
      }, 500);
    } else {
      this.error = 'Email ou mot de passe incorrect';
      this.loading = false;
    }
  }
}

