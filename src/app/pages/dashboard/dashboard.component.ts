import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { LucideAngularModule, Calendar, CreditCard, Plus, X, Check, Clock, DollarSign, User, LogOut, Layout, Heart, Bell, HelpCircle } from 'lucide-angular';
import { AuthService, User as AuthUser, PaymentMethod } from '../../services/auth.service';
import { DataService, Booking } from '../../services/data.service';
import { CurrencyService } from '../../services/currency.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  calendarIcon = Calendar;
  creditCardIcon = CreditCard;
  plusIcon = Plus;
  xIcon = X;
  checkIcon = Check;
  clockIcon = Clock;
  dollarIcon = DollarSign;
  userIcon = User;
  logoutIcon = LogOut;
  layoutIcon = Layout;
  heartIcon = Heart;
  bellIcon = Bell;
  helpCircleIcon = HelpCircle;

  activeSection = 'overview';
  user: AuthUser | null = null;
  bookings: Booking[] = [];
  paymentMethods: PaymentMethod[] = [];
  favorites: any[] = [];
  notifications: any[] = [];
  testimonialsCount = 0;
  // Revenue computed from approved services (in TND)
  revenueTND: number = 0;

  // Form for adding a testimonial from the user
  testimonialForm: {
    rating: number;
    comment: string;
  } = {
    rating: 5,
    comment: ''
  };
  // Simple in-component toast notifications
  toasts: { id: string; message: string; type?: 'success' | 'error' }[] = [];

  // After user submits testimonial, mark pending to show message
  testimonialPending = false;
  
  showPaymentModal = false;
  showAddPaymentModal = false;
  selectedBooking: Booking | null = null;
  
  editProfile = {
    name: '',
    email: '',
    phone: ''
  };
  
  newPaymentMethod: {
    type: 'card' | 'bank';
    cardNumber?: string;
    cardHolder?: string;
    expiryDate?: string;
    bankName?: string;
    accountNumber?: string;
    isDefault: boolean;
  } = {
    type: 'card',
    isDefault: false
  };

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    private currencyService: CurrencyService
  ) {}

  ngOnInit() {
    // Check authentication status first
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Subscribe to user changes
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      if (user) {
        this.loadData();
      } else {
        // Only redirect if we're sure there's no token and no user
        // Give session restoration a moment to complete
        setTimeout(() => {
          if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/login']);
          }
        }, 100);
      }
    });
    
    // Handle fragment navigation
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const fragment = window.location.hash.replace('#', '');
        if (fragment && ['overview', 'reservations', 'payments', 'profile', 'addTestimonial', 'notifications', 'support'].includes(fragment)) {
          if (fragment === 'notifications') {
            this.openNotifications();
          } else {
            this.activeSection = fragment;
          }
        }
      });
    
    // Check initial fragment
    const fragment = window.location.hash.replace('#', '');
    if (fragment && ['overview', 'reservations', 'payments', 'profile', 'addTestimonial', 'notifications', 'support'].includes(fragment)) {
      if (fragment === 'notifications') {
        this.openNotifications();
      } else {
        this.activeSection = fragment;
      }
    }
  }

  loadData() {
    if (!this.user) return;
    
    this.dataService.getBookings(this.user.id).subscribe(bookings => {
      this.bookings = bookings;
      // Compute revenue once bookings are loaded
      this.computeRevenueFromBookings();
      this.updateNotificationsFromBookings(bookings);
    });
    this.paymentMethods = this.authService.getPaymentMethods(this.user.id);
    this.loadFavorites();
    // Load testimonials count (global) and check for testimonials approvals for this user
    this.dataService.getTestimonials().subscribe(t => {
      // Only count testimonials submitted by the logged-in user and that are verified
      this.testimonialsCount = (t || []).filter(x => !!x.verified && x.customerName === this.user?.name).length;
      this.updateNotificationsFromTestimonials(t || []);
    });
    this.loadNotifications();
    this.initEditProfile();
  }

  computeRevenueFromBookings() {
    // Sum bookings that are considered "approved services".
    // We'll include bookings with status 'confirmed' or 'completed' and paymentStatus 'paid' or 'approved'.
    const approved = this.bookings.filter(b => (b.status === 'confirmed' || b.status === 'completed') && (b.paymentStatus === 'paid' || b.paymentStatus === 'approved' || !b.paymentStatus));

    // Ensure rates are loaded (uses fallback rates if API unavailable)
    this.currencyService.loadRates().subscribe(() => {
      this.revenueTND = approved.reduce((sum, b) => {
        const amount = Number(b.totalAmount ?? b.priceSnapshot) || 0;
        const currency = (b.currency || (b as any).packageCurrency || 'TND').toString().toUpperCase();
        // Use CurrencyService to convert from booking currency to TND
        const converted = this.currencyService.convert(amount, currency, 'TND');
        return sum + converted;
      }, 0);
    });
  }

  updateNotificationsFromBookings(bookings: Booking[]) {
    if (!this.user) return;
    const key = `notifiedBookings_${this.user.id}`;
    const stored = localStorage.getItem(key);
    const notified: string[] = stored ? JSON.parse(stored) : [];
    const newNotifs: any[] = [];
    bookings.forEach(b => {
      if ((b.status === 'confirmed' || b.status === 'completed') && !notified.includes(b.id)) {
        // use localized status label to keep messages in French
        const localized = this.getStatusLabel(b.status).toLowerCase();
        newNotifs.push({
          id: `b_${b.id}`,
          title: 'Réservation mise à jour',
          message: `Votre réservation pour ${b.serviceType} a été ${localized}.`,
          date: new Date().toISOString(),
          read: false
        });
        notified.push(b.id);
      }
    });
    if (newNotifs.length) {
      this.notifications = [...newNotifs, ...this.notifications];
      localStorage.setItem(`notifications_${this.user.id}`, JSON.stringify(this.notifications));
      localStorage.setItem(key, JSON.stringify(notified));
    }
  }

  updateNotificationsFromTestimonials(testimonials: any[]) {
    if (!this.user) return;
    const key = `notifiedTestimonials_${this.user.id}`;
    const stored = localStorage.getItem(key);
    const notified: string[] = stored ? JSON.parse(stored) : [];
    const newNotifs: any[] = [];
    testimonials.forEach(t => {
      if (t.verified && (t.customerName === this.user?.name) && !notified.includes(t.id)) {
        newNotifs.push({
          id: `t_${t.id}`,
          title: 'Témoignage publié',
          message: 'Votre témoignage a été approuvé et publié.',
          date: new Date().toISOString(),
          read: false
        });
        notified.push(t.id);
      }
    });
    if (newNotifs.length) {
      this.notifications = [...newNotifs, ...this.notifications];
      localStorage.setItem(`notifications_${this.user.id}`, JSON.stringify(this.notifications));
      localStorage.setItem(key, JSON.stringify(notified));
    }
  }

  submitTestimonial() {
    if (!this.user) {
      alert('Veuillez vous connecter pour laisser un témoignage');
      return;
    }
    if (!this.testimonialForm.comment.trim()) {
      alert('Veuillez saisir un commentaire');
      return;
    }

    const payload = {
      customerName: this.user.name,
      rating: this.testimonialForm.rating,
      comment: this.testimonialForm.comment.trim(),
      service: 'Site'
    };

    this.dataService.addTestimonial(payload).subscribe({
      next: (res) => {
        // show a toast instead of alert
        this.showToast('Témoignage envoyé — En attente de validation', 'success');
        this.testimonialForm = { rating: 5, comment: '' };
        this.testimonialPending = true;
        // refresh count (only counts verified ones) — no immediate change expected
        this.dataService.getTestimonials().subscribe(t => this.testimonialsCount = (t || []).filter(x => !!x.verified).length);
      },
      error: (err) => {
        console.error('Erreur lors de l\'envoi du témoignage :', err);
        this.showToast('Erreur lors de l\'envoi du témoignage', 'error');
      }
    });
  }

  private showToast(message: string, type: 'success' | 'error' = 'success') {
    const id = Date.now().toString();
    this.toasts.push({ id, message, type });
    // auto-remove after 4s
    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t.id !== id);
    }, 4000);
  }

  dismissToast(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  initEditProfile() {
    if (this.user) {
      this.editProfile = {
        name: this.user.name,
        email: this.user.email,
        phone: this.user.phone || ''
      };
    }
  }

  loadFavorites() {
    // Load favorites from localStorage or service
    const stored = localStorage.getItem(`favorites_${this.user?.id}`);
    this.favorites = stored ? JSON.parse(stored) : [];
  }

  loadNotifications() {
    // Load notifications from localStorage or service
    const stored = localStorage.getItem(`notifications_${this.user?.id}`);
    this.notifications = stored ? JSON.parse(stored) : [
      {
        id: '1',
        title: 'Bienvenue sur Silianos Voyage',
        message: 'Merci de nous avoir rejoints ! Explorez nos services et réservez votre prochain voyage.',
        date: new Date().toISOString(),
        read: false
      }
    ];
  }

  get unreadNotificationsCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  openNotifications() {
    this.activeSection = 'notifications';
    // Mark all notifications as read when opening, and persist
    if (!this.user) return;
    let changed = false;
    this.notifications = this.notifications.map(n => {
      if (!n.read) {
        changed = true;
        return { ...n, read: true };
      }
      return n;
    });
    if (changed) {
      localStorage.setItem(`notifications_${this.user.id}`, JSON.stringify(this.notifications));
    }
  }

  updateProfile() {
    if (!this.user) return;
    
    this.authService.updateUser(this.user.id, {
      name: this.editProfile.name,
      email: this.editProfile.email,
      phone: this.editProfile.phone
    }).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        alert('Profil mis à jour avec succès!');
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du profil :', err);
        alert(err.message || 'Erreur lors de la mise à jour du profil');
      }
    });
  }

  cancelEdit() {
    this.initEditProfile();
  }

  removeFavorite(id: string) {
    this.favorites = this.favorites.filter(f => f.id !== id);
    localStorage.setItem(`favorites_${this.user?.id}`, JSON.stringify(this.favorites));
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
      completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    };
    return colors[status] || colors['pending'];
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      pending: 'En attente',
      confirmed: 'Confirmé',
      cancelled: 'Annulé',
      completed: 'Terminé'
    };
    return labels[status] || status;
  }

  getPaymentStatusColor(status?: string): string {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      approved: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      paid: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      failed: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[status || 'pending'] || colors['pending'];
  }

  getPaymentStatusLabel(status?: string): string {
    const labels: { [key: string]: string } = {
      pending: 'En attente',
      approved: 'Approuvé - Paiement requis',
      paid: 'Payé',
      failed: 'Échoué'
    };
    return labels[status || 'pending'] || 'En attente';
  }

  canPay(booking: Booking): boolean {
    return booking.status === 'confirmed' && booking.paymentStatus === 'approved';
  }

  openPaymentModal(booking: Booking) {
    if (!this.canPay(booking)) return;
    
    this.selectedBooking = booking;
    this.showPaymentModal = true;
    
    // If no payment methods, suggest adding one
    if (this.paymentMethods.length === 0) {
      this.showAddPaymentModal = true;
      this.showPaymentModal = false;
    }
  }

  closePaymentModal() {
    this.showPaymentModal = false;
    this.selectedBooking = null;
  }

  openAddPaymentModal() {
    this.newPaymentMethod = {
      type: 'card',
      isDefault: this.paymentMethods.length === 0
    };
    this.showAddPaymentModal = true;
  }

  closeAddPaymentModal() {
    this.showAddPaymentModal = false;
    this.newPaymentMethod = {
      type: 'card',
      isDefault: false
    };
  }

  addPaymentMethod() {
    if (!this.user) return;

    // Validation
    if (this.newPaymentMethod.type === 'card') {
      if (!this.newPaymentMethod.cardNumber || !this.newPaymentMethod.cardHolder || !this.newPaymentMethod.expiryDate) {
        alert('Veuillez remplir tous les champs de la carte');
        return;
      }
    } else {
      if (!this.newPaymentMethod.bankName || !this.newPaymentMethod.accountNumber) {
        alert('Veuillez remplir tous les champs bancaires');
        return;
      }
    }

    this.authService.addPaymentMethod(this.user.id, this.newPaymentMethod);
    this.loadData();
    this.closeAddPaymentModal();
    
    // If we were trying to pay, reopen payment modal
    if (this.selectedBooking) {
      this.showPaymentModal = true;
    }
  }

  removePaymentMethod(methodId: string) {
    if (!this.user) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer ce moyen de paiement?')) {
      this.authService.removePaymentMethod(this.user.id, methodId);
      this.loadData();
    }
  }

  setDefaultPaymentMethod(methodId: string) {
    if (!this.user) return;
    this.authService.setDefaultPaymentMethod(this.user.id, methodId);
    this.loadData();
  }

  processPayment() {
    if (!this.selectedBooking || !this.user) return;

    const defaultMethod = this.paymentMethods.find(m => m.isDefault);
    if (!defaultMethod) {
      alert('Veuillez sélectionner un moyen de paiement par défaut');
      return;
    }

    // Simulate payment processing
    if (confirm(`Confirmer le paiement de ${this.selectedBooking.totalAmount} ${this.selectedBooking.currency || 'TND'} pour la réservation ${this.selectedBooking.id}?`)) {
      this.dataService.updateBookingPaymentStatus(this.selectedBooking.id, 'paid');
      this.loadData();
      this.closePaymentModal();
      alert('Paiement effectué avec succès!');
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  maskCardNumber(cardNumber?: string): string {
    if (!cardNumber) return '';
    return '**** **** **** ' + cardNumber.slice(-4);
  }
}

