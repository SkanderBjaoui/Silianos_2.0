import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LucideAngularModule, Check, ArrowLeft, Mail, Phone, Users, Calendar } from 'lucide-angular';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { DataService, Service } from '../../services/data.service';
import { AuthService, User as AuthUser } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { CurrencyService } from '../../services/currency.service';

interface ServiceDetailDisplay {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  image: string;
  features: string[];
  benefits?: string[];
  price: number;
  currency: string;
    startDate?: string;
  endDate?: string;
    durationDays?: number;
}

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule, NavbarComponent, FooterComponent],
  templateUrl: './service-detail.component.html',
  styleUrl: './service-detail.component.css'
})
export class ServiceDetailComponent implements OnInit, OnDestroy {
  checkIcon = Check;
  arrowLeftIcon = ArrowLeft;
  mailIcon = Mail;
  phoneIcon = Phone;
  usersIcon = Users;
  calendarIcon = Calendar;
  serviceId: string | null = null;
  service: ServiceDetailDisplay | null = null;
  loading = false;
  notFound = false;
  showReservationModal = false;
  selectedCurrency = 'TND';
  displayPrice = 0;
  reservationLoading = false;
  reservationSuccess = false;
  pendingReserve = false;
  currentUser: AuthUser | null = null;
  reservationForm = {
    customerName: '',
    email: '',
    phone: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    numberOfTravelers: 1,
    notes: ''
  };

  private routeSub?: Subscription;
  private userSub?: Subscription;
  private currencySub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private authService: AuthService,
    private currencyService: CurrencyService
  ) {}

  ngOnInit() {
    this.userSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Initialize and reactively update selected currency from global preference
    this.selectedCurrency = this.authService.getEffectiveCurrency();
    this.currencySub = this.authService.preferredCurrency$.subscribe(code => {
      this.selectedCurrency = code;
      this.updateDisplayPrice();
    });

    this.routeSub = this.route.paramMap.subscribe(params => {
      this.serviceId = params.get('id');
      this.pendingReserve = this.route.snapshot.queryParamMap.get('reserve') === '1';
      if (this.serviceId) {
        this.loadService(this.serviceId);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  loadService(id: string) {
    this.loading = true;
    this.notFound = false;
    
    this.dataService.getService(id).subscribe({
      next: (dbService: Service) => {
        if (dbService.status === 'active') {
          this.service = {
            id: dbService.id,
            title: dbService.title,
            description: dbService.description,
            fullDescription: dbService.about,
            image: dbService.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
            features: dbService.features || [],
            benefits: dbService.benefits || [],
            price: dbService.price,
            currency: dbService.currency || 'TND',
            startDate: dbService.startDate,
            endDate: dbService.endDate,
            durationDays: dbService.durationDays
          };
          this.updateDisplayPrice();
          if (this.pendingReserve) {
            setTimeout(() => {
              this.openReservationModal();
            }, 300);
            this.pendingReserve = false;
          }
        } else {
          this.notFound = true;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement du service :', err);
        this.notFound = true;
        this.loading = false;
      }
    });
  }

  private updateDisplayPrice() {
    if (!this.service) {
      this.displayPrice = 0;
      return;
    }

    const fromCurrency = this.service.currency || 'TND';
    const toCurrency = this.selectedCurrency || fromCurrency;

    // Ensure rates are loaded at least once; conversion will be no-op until they are ready
    this.currencyService.loadRates().subscribe(() => {
      this.displayPrice = this.currencyService.convert(
        this.service!.price,
        fromCurrency,
        toCurrency
      );
    });
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
    this.userSub?.unsubscribe();
    this.currencySub?.unsubscribe();
  }

  openReservationModal() {
    if (!this.service) {
      return;
    }

    // If user is not logged in, redirect to login instead of opening modal
    if (!this.currentUser) {
      const servicePath = `/services/${this.service.id}`;
      this.router.navigate(['/login'], {
        queryParams: {
          redirectTo: servicePath,
          reserve: 1,
          currency: this.selectedCurrency
        }
      });
      return;
    }
    this.showReservationModal = true;
    this.reservationSuccess = false;
    this.reservationLoading = false;
    this.reservationForm = {
      customerName: this.currentUser?.name || '',
      email: this.currentUser?.email || '',
      phone: this.currentUser?.phone || '',
      destination: this.service.title,
      departureDate: '',
      returnDate: '',
      numberOfTravelers: 1,
      notes: ''
    };
  }

  closeReservationModal() {
    this.showReservationModal = false;
    this.reservationLoading = false;
  }

  isReservationValid(): boolean {
    return !!(
      this.reservationForm.customerName &&
      this.reservationForm.email &&
      this.reservationForm.phone &&
      this.reservationForm.departureDate &&
      this.service
    );
  }

  getMaxReturnDate(): string | null {
    if (!this.service?.durationDays || !this.reservationForm.departureDate) {
      return null;
    }
    // Use UTC-based calculation to avoid timezone/off-by-one issues
    const [year, month, day] = this.reservationForm.departureDate.split('-').map(Number);
    const startUtc = Date.UTC(year, (month ?? 1) - 1, day ?? 1);
    const durationMs = this.service.durationDays * 24 * 60 * 60 * 1000;
    const endUtc = startUtc + durationMs;
    const endDate = new Date(endUtc);
    return endDate.toISOString().split('T')[0];
  }

  onDepartureDateChange() {
    const max = this.getMaxReturnDate();
    if (max) {
      this.reservationForm.returnDate = max;
    } else {
      this.reservationForm.returnDate = '';
    }
  }

  onReturnDateChange() {
    const max = this.getMaxReturnDate();
    const departure = this.reservationForm.departureDate;
    const ret = this.reservationForm.returnDate;

    if (!ret) {
      return;
    }

    // Enforce return >= departure when a departure date exists
    if (departure && ret < departure) {
      this.reservationForm.returnDate = departure;
      return;
    }

    // Enforce max duration if defined
    if (max && ret > max) {
      this.reservationForm.returnDate = max;
    }
  }

  submitReservation() {
    if (!this.service || !this.isReservationValid()) {
      return;
    }

    this.reservationLoading = true;
    const travelers = Number(this.reservationForm.numberOfTravelers) || 1;
    const unitPrice = this.currencyService.convert(
      this.service.price,
      this.service.currency,
      this.selectedCurrency
    );
    const totalAmount = unitPrice * travelers;

    this.dataService.addBooking({
      userId: this.currentUser?.id,
      serviceId: this.service.id,
      customerName: this.reservationForm.customerName,
      email: this.reservationForm.email,
      phone: this.reservationForm.phone,
      serviceType: this.service.title,
      destination: this.reservationForm.destination || undefined,
      departureDate: this.reservationForm.departureDate,
      returnDate: this.reservationForm.returnDate || undefined,
      numberOfTravelers: travelers,
      notes: this.reservationForm.notes || undefined,
      totalAmount,
      currency: this.selectedCurrency,
      pricingPackageId: undefined,
      packageCurrency: undefined,
      priceSnapshot: this.service.price
    }).subscribe({
      next: () => {
        this.reservationLoading = false;
        this.reservationSuccess = true;
        setTimeout(() => {
          this.closeReservationModal();
          this.router.navigate(['/dashboard'], { fragment: 'reservations' });
        }, 1500);
      },
      error: (err) => {
        console.error('Erreur lors de la création de la réservation :', err);
        this.reservationLoading = false;
        alert('Impossible de finaliser la réservation pour le moment.');
      }
    });
  }

}

