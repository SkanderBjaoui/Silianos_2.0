import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule, Mail, Lock, User, Phone, LogIn, UserPlus, ArrowRight, Eye, EyeOff } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CountrySelectorComponent, Country } from '../../components/country-selector/country-selector.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule, NavbarComponent, FooterComponent, CountrySelectorComponent],
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
  eyeIcon = Eye;
  eyeOffIcon = EyeOff;

  showPassword = false;
  showConfirmPassword = false;
  showLoginPassword = false;

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
  signupPhoneNumber = ''; // Phone number without country code
  signupPassword = '';
  signupConfirmPassword = '';
  selectedCountry: Country | null = null;

  // Validation errors
  nameError = '';
  emailError = '';
  phoneError = '';
  passwordError = '';
  confirmPasswordError = '';

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
    // Initialize default country (Tunisia)
    this.selectedCountry = {
      code: 'TN',
      name: 'Tunisia',
      dialCode: '+216',
      flag: '🇹🇳',
      phoneLength: 8
    };

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


  onCountrySelected(country: Country) {
    this.selectedCountry = country;
    this.validatePhone();
  }

  validateName() {
    this.nameError = '';
    if (!this.signupName.trim()) {
      return;
    }
    if (this.signupName.trim().length < 2) {
      this.nameError = 'Le nom doit contenir au moins 2 caractères';
    } else if (this.signupName.trim().length > 50) {
      this.nameError = 'Le nom ne peut pas dépasser 50 caractères';
    } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(this.signupName.trim())) {
      this.nameError = 'Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes';
    }
  }

  validateEmail() {
    this.emailError = '';
    if (!this.signupEmail.trim()) {
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.signupEmail.trim())) {
      this.emailError = 'Veuillez entrer une adresse email valide';
    }
  }

  validatePhone() {
    this.phoneError = '';
    if (!this.signupPhoneNumber.trim()) {
      return;
    }
    if (!this.selectedCountry) {
      this.phoneError = 'Veuillez sélectionner un pays';
      return;
    }
    const phoneNumber = this.signupPhoneNumber.replace(/\s/g, '');
    if (!/^\d+$/.test(phoneNumber)) {
      this.phoneError = 'Le numéro de téléphone ne peut contenir que des chiffres';
      return;
    }
    if (this.selectedCountry.phoneLength && phoneNumber.length !== this.selectedCountry.phoneLength) {
      this.phoneError = `Le numéro de téléphone doit contenir ${this.selectedCountry.phoneLength} chiffres pour ${this.selectedCountry.name}`;
    } else if (phoneNumber.length < 6) {
      this.phoneError = 'Le numéro de téléphone est trop court';
    } else if (phoneNumber.length > 15) {
      this.phoneError = 'Le numéro de téléphone est trop long';
    }
  }

  validatePassword() {
    this.passwordError = '';
    if (!this.signupPassword) {
      return;
    }
    if (this.signupPassword.length < 8) {
      this.passwordError = 'Le mot de passe doit contenir au moins 8 caractères';
    } else if (!/(?=.*[a-z])/.test(this.signupPassword)) {
      this.passwordError = 'Le mot de passe doit contenir au moins une lettre minuscule';
    } else if (!/(?=.*[A-Z])/.test(this.signupPassword)) {
      this.passwordError = 'Le mot de passe doit contenir au moins une lettre majuscule';
    } else if (!/(?=.*\d)/.test(this.signupPassword)) {
      this.passwordError = 'Le mot de passe doit contenir au moins un chiffre';
    }
  }

  validateConfirmPassword() {
    this.confirmPasswordError = '';
    if (!this.signupConfirmPassword) {
      return;
    }
    if (this.signupPassword !== this.signupConfirmPassword) {
      this.confirmPasswordError = 'Les mots de passe ne correspondent pas';
    }
  }

  onSignup() {
    // Clear previous errors
    this.error = '';
    this.validateName();
    this.validateEmail();
    this.validatePhone();
    this.validatePassword();
    this.validateConfirmPassword();

    // Check if there are any validation errors
    if (this.nameError || this.emailError || this.phoneError || this.passwordError || this.confirmPasswordError) {
      return;
    }

    if (!this.signupName || !this.signupEmail || !this.signupPassword) {
      this.error = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    if (this.signupPassword !== this.signupConfirmPassword) {
      this.confirmPasswordError = 'Les mots de passe ne correspondent pas';
      return;
    }

    this.loading = true;

    // Format phone number with country code
    const fullPhone = this.selectedCountry && this.signupPhoneNumber
      ? `${this.selectedCountry.dialCode}${this.signupPhoneNumber.replace(/\s/g, '')}`
      : undefined;

    this.authService.signup(this.signupEmail.trim(), this.signupPassword, this.signupName.trim(), fullPhone).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.message || 'Une erreur est survenue';
        this.loading = false;
      }
    });
  }

  onLogin() {
    this.error = '';
    this.emailError = '';
    
    // Validate email
    if (!this.loginEmail.trim()) {
      this.emailError = 'Veuillez entrer votre email';
      return;
    }
    this.validateLoginEmail();

    if (this.emailError || !this.loginPassword) {
      if (!this.loginPassword) {
        this.error = 'Veuillez entrer votre mot de passe';
      }
      return;
    }

    this.loading = true;

    this.authService.login(this.loginEmail.trim(), this.loginPassword).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.message || 'Une erreur est survenue';
        this.loading = false;
      }
    });
  }

  validateLoginEmail() {
    this.emailError = '';
    if (!this.loginEmail.trim()) {
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.loginEmail.trim())) {
      this.emailError = 'Veuillez entrer une adresse email valide';
    }
  }
}

