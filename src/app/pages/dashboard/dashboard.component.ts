import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { LucideAngularModule, Calendar, CreditCard, Plus, X, Check, Clock, DollarSign, User, LogOut, Layout, Heart, Bell, HelpCircle } from 'lucide-angular';
import { AuthService, User as AuthUser, PaymentMethod } from '../../services/auth.service';
import { DataService, Booking } from '../../services/data.service';
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
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      if (user) {
        this.loadData();
      } else {
        this.router.navigate(['/login']);
      }
    });
    
    // Handle fragment navigation
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const fragment = window.location.hash.replace('#', '');
        if (fragment && ['overview', 'reservations', 'payments', 'profile', 'favorites', 'notifications', 'support'].includes(fragment)) {
          this.activeSection = fragment;
        }
      });
    
    // Check initial fragment
    const fragment = window.location.hash.replace('#', '');
    if (fragment && ['overview', 'reservations', 'payments', 'profile', 'favorites', 'notifications', 'support'].includes(fragment)) {
      this.activeSection = fragment;
    }
  }

  loadData() {
    if (!this.user) return;
    
    this.bookings = this.dataService.getBookings(this.user.id);
    this.paymentMethods = this.authService.getPaymentMethods(this.user.id);
    this.loadFavorites();
    this.loadNotifications();
    this.initEditProfile();
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
        message: 'Merci de nous avoir rejoint! Explorez nos services et réservez votre prochain voyage.',
        date: new Date().toISOString(),
        read: false
      }
    ];
  }

  updateProfile() {
    if (!this.user) return;
    
    this.authService.updateUser(this.user.id, {
      name: this.editProfile.name,
      email: this.editProfile.email,
      phone: this.editProfile.phone
    });
    
    // Reload user data
    this.user = this.authService.getCurrentUser();
    
    alert('Profil mis à jour avec succès!');
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
    if (confirm(`Confirmer le paiement de ${this.selectedBooking.totalAmount}€ pour la réservation ${this.selectedBooking.id}?`)) {
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

