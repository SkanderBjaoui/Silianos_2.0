import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LucideAngularModule, Search, ChevronDown, X } from 'lucide-angular';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { DataService, Service } from '../../services/data.service';
import { AuthService, User as AuthUser } from '../../services/auth.service';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule, NavbarComponent, FooterComponent],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit, OnDestroy {
  searchIcon = Search;
  chevronDownIcon = ChevronDown;
  xIcon = X;

  currentUser: AuthUser | null = null;
  private userSub?: Subscription;
  private currencySub?: Subscription;

  services: Service[] = [];
  filteredServices: (Service & { displayPrice: number })[] = [];
  loadingServices = false;
  servicesError: string | null = null;

  selectedCurrency = 'TND';

  // Filters
  searchTerm = '';
  minPrice?: number;
  maxPrice?: number;
  selectedCountry: string = 'all';
  availableCountries: string[] = [];

  showReservationModal = false;
  selectedService: Service | null = null;
  reservationSuccess = false;
  reservationLoading = false;

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

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Sync displayed currency with global preference (user or guest)
    this.selectedCurrency = this.authService.getEffectiveCurrency();
    this.currencySub = this.authService.preferredCurrency$.subscribe(code => {
      this.selectedCurrency = code;
      this.applyFilters();
    });

    // Preload currency rates once
    this.currencyService.loadRates().subscribe(() => {
      this.loadServices();
    });
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
    this.currencySub?.unsubscribe();
  }

  loadServices() {
    this.loadingServices = true;
    this.servicesError = null;
    this.dataService.getServices().subscribe({
      next: (services) => {
        this.services = services.filter(s => s.status === 'active');
        this.availableCountries = Array.from(
          new Set(this.services.map(s => s.country).filter((c): c is string => !!c))
        ).sort();
        this.applyFilters();
        this.loadingServices = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des services :', error);
        this.servicesError = 'Impossible de charger les services pour le moment.';
        this.loadingServices = false;
      }
    });
  }

  applyFilters() {
    const term = this.searchTerm.toLowerCase().trim();
    const min = this.minPrice ?? 0;
    const max = this.maxPrice ?? Number.MAX_SAFE_INTEGER;

    this.filteredServices = this.services
      .map(service => {
        const displayPrice = this.currencyService.convert(
          service.price,
          service.currency,
          this.selectedCurrency
        );
        return { ...service, displayPrice };
      })
      .filter(service => {
        if (term) {
          const haystack = `${service.title} ${service.description} ${(service.features || []).join(' ')}`.toLowerCase();
          if (!haystack.includes(term)) {
            return false;
          }
        }

        if (this.selectedCountry !== 'all' && service.country !== this.selectedCountry) {
          return false;
        }

        if (service.displayPrice < min || service.displayPrice > max) {
          return false;
        }

        return true;
      });
  }

  openReservationModal(service: Service) {
    if (!this.currentUser) {
      this.router.navigate(['/login'], {
        queryParams: {
          redirectTo: `/services/${service.id}`,
          reserve: 1,
          currency: this.selectedCurrency
        }
      });
      return;
    }

    // Authenticated users are redirected to the service detail page with reserve flag
    this.router.navigate(['/services', service.id], {
      queryParams: {
        reserve: 1,
        currency: this.selectedCurrency
      }
    });
  }

  closeReservationModal() {
    this.showReservationModal = false;
    this.selectedService = null;
    this.reservationLoading = false;
  }

  isReservationValid(): boolean {
    return false;
  }

  submitReservation() {
    return;
  }
}

