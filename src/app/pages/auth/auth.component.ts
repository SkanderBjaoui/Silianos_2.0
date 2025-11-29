import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule, Mail, Lock, User, Phone, LogIn, UserPlus, ArrowRight } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule, NavbarComponent, FooterComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit, AfterViewChecked {
  mailIcon = Mail;
  lockIcon = Lock;
  userIcon = User;
  phoneIcon = Phone;
  loginIcon = LogIn;
  userPlusIcon = UserPlus;
  arrowRightIcon = ArrowRight;

  isLoginMode = true;
  error = '';
  loading = false;

  // Login form
  loginEmail = '';
  loginPassword = '';

  // Signup form
  signupName = '';
  signupEmail = '';
  signupPhone = '';
  signupPassword = '';
  signupConfirmPassword = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // Check route to determine initial mode
    if (this.router.url.includes('/signup')) {
      this.isLoginMode = false;
    }
    
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit() {
    // Update mode based on route changes
    this.router.events.subscribe(() => {
      if (this.router.url.includes('/signup')) {
        this.isLoginMode = false;
      } else if (this.router.url.includes('/login')) {
        this.isLoginMode = true;
      }
    });
  }

  switchMode() {
    this.error = '';
    this.isLoginMode = !this.isLoginMode;
    
    // Update route
    if (this.isLoginMode) {
      this.router.navigate(['/login'], { replaceUrl: true });
    } else {
      this.router.navigate(['/signup'], { replaceUrl: true });
    }
    
    // Sync heights after mode switch
    setTimeout(() => this.syncHeights(), 100);
  }

  ngAfterViewChecked() {
    // Use requestAnimationFrame to avoid excessive calls
    requestAnimationFrame(() => this.syncHeights());
  }

  private syncHeights() {
    // Boxes are now fixed to viewport height, no need to sync
    // This method is kept for potential future use
  }

  onLogin() {
    this.error = '';
    this.loading = true;

    if (!this.loginEmail || !this.loginPassword) {
      this.error = 'Veuillez remplir tous les champs';
      this.loading = false;
      return;
    }

    this.authService.login(this.loginEmail, this.loginPassword).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.message || 'Une erreur est survenue';
        this.loading = false;
      }
    });
  }

  onSignup() {
    this.error = '';
    this.loading = true;

    if (!this.signupName || !this.signupEmail || !this.signupPassword) {
      this.error = 'Veuillez remplir tous les champs obligatoires';
      this.loading = false;
      return;
    }

    if (this.signupPassword !== this.signupConfirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas';
      this.loading = false;
      return;
    }

    if (this.signupPassword.length < 6) {
      this.error = 'Le mot de passe doit contenir au moins 6 caractères';
      this.loading = false;
      return;
    }

    this.authService.signup(this.signupEmail, this.signupPassword, this.signupName, this.signupPhone || undefined).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.message || 'Une erreur est survenue';
        this.loading = false;
      }
    });
  }
}

