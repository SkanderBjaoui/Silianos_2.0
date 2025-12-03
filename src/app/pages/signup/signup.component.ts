import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule, Mail, Lock, User, Phone, UserPlus } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule, NavbarComponent, FooterComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  mailIcon = Mail;
  lockIcon = Lock;
  userIcon = User;
  phoneIcon = Phone;
  userPlusIcon = UserPlus;

  name = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';
  error = '';
  phoneError = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    this.error = '';
    this.loading = true;

    if (!this.name || !this.email || !this.password) {
      this.error = 'Veuillez remplir tous les champs obligatoires';
      this.loading = false;
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas';
      this.loading = false;
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Le mot de passe doit contenir au moins 6 caractères';
      this.loading = false;
      return;
    }

    // If phone provided, check whether it's already in use before attempting signup
    const phoneToCheck = (this.phone || '').trim();
    const proceedWithSignup = () => {
      this.authService.signup(this.email, this.password, this.name, phoneToCheck || undefined).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          const msg = err?.message || err?.error || (err?.error && err.error.message) || 'Une erreur est survenue';
          this.error = typeof msg === 'string' ? msg : 'Une erreur est survenue';

          // If backend indicates the phone is already used, show inline phone error and scroll to top
          const lowered = String(this.error).toLowerCase();
          if (phoneToCheck && (lowered.includes('phone') || lowered.includes('téléphone') || lowered.includes('numéro') || lowered.includes('already') || lowered.includes('duplicate') || lowered.includes('existe'))) {
            this.phoneError = 'Ce numéro de téléphone est déjà utilisé. Veuillez en choisir un autre.';
          }

          this.loading = false;
          // Scroll to top so the user sees the error box
          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
        }
      });
    };

    if (phoneToCheck) {
      this.authService.checkPhoneExists(phoneToCheck).subscribe({
          next: (exists) => {
            if (exists) {
              this.phoneError = 'Ce numéro de téléphone est déjà utilisé. Veuillez en choisir un autre.';
              this.error = 'Veuillez corriger les erreurs ci-dessous.';
              this.loading = false;
              // Scroll to top so the user sees the error box
              setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
              return;
            }
            proceedWithSignup();
          },
          error: () => {
            // If the check fails for any reason, fallback to attempting signup and let backend validate
            proceedWithSignup();
          }
        });
    } else {
      // No phone provided, proceed normally
      proceedWithSignup();
    }
  }
}


