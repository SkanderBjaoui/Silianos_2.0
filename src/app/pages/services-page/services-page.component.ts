import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { DataService, Service } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { CurrencyService } from '../../services/currency.service';

interface ServiceDisplay {
  id: string;
  title: string;
  description: string;
  image: string;
  features: string[];
  price: number;
  currency: string;
  displayPrice: number;
  startDate?: string;
  endDate?: string;
}

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, NavbarComponent, FooterComponent],
  templateUrl: './services-page.component.html',
  styleUrl: './services-page.component.css'
})
export class ServicesPageComponent implements OnInit {
  services: ServiceDisplay[] = [];
  loading = false;
  selectedCurrency = 'TND';

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private currencyService: CurrencyService
  ) {}

  ngOnInit() {
    this.selectedCurrency = this.authService.getEffectiveCurrency();
    this.authService.preferredCurrency$.subscribe(code => {
      this.selectedCurrency = code;
      this.updateDisplayPrices();
    });
    this.loadServices();
  }

  loadServices() {
    this.loading = true;
    this.dataService.getServices().subscribe({
      next: (dbServices: Service[]) => {
        // Filter only active services and map to display format
        this.services = dbServices
          .filter(service => service.status === 'active')
          .map(service => ({
            id: service.id,
            title: service.title,
            description: service.description,
            image: service.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
            features: service.features || [],
            price: service.price,
            currency: service.currency || 'TND',
            displayPrice: service.price,
            startDate: service.startDate,
            endDate: service.endDate
          }));
        this.updateDisplayPrices();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des services :', err);
        this.loading = false;
        // Keep empty array on error - will show empty state
        this.services = [];
      }
    });
  }

  private updateDisplayPrices() {
    if (!this.services.length) {
      return;
    }

    const toCurrency = this.selectedCurrency || 'TND';

    this.currencyService.loadRates().subscribe(() => {
      this.services = this.services.map(service => {
        const fromCurrency = service.currency || 'TND';
        const converted = this.currencyService.convert(
          service.price,
          fromCurrency,
          toCurrency
        );
        return {
          ...service,
          displayPrice: converted
        };
      });
    });
  }
}

