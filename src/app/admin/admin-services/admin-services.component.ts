import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Plus, Trash2 } from 'lucide-angular';
import { DataService, Service } from '../../services/data.service';
import { ConfirmService } from '../../shared/confirm.service';
import { CURRENCY_OPTIONS } from '../../shared/currency-options';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './admin-services.component.html',
  styleUrl: './admin-services.component.css'
})
export class AdminServicesComponent implements OnInit {
  plusIcon = Plus;
  trashIcon = Trash2;

  services: Service[] = [];
  editedService: Service | null = null;
  isCreateMode = false;
  loading = false;
  availableCurrencies = CURRENCY_OPTIONS;

  filterQuery: string = '';
  statusFilter: string = '';

  get filteredServices(): Service[] {
    const q = this.filterQuery.trim().toLowerCase();
    return this.services.filter(s => {
      if (this.statusFilter && s.status !== this.statusFilter) return false;
      if (!q) return true;
      return (
        (s.title || '').toLowerCase().includes(q) ||
        (s.country || '').toLowerCase().includes(q) ||
        (s.description || '').toLowerCase().includes(q)
      );
    });
  }

  // All countries for admin selection
  allCountries: string[] = [
    'Tunisie', 'Algérie', 'Maroc', 'Libye', 'Égypte',
    'Arabie Saoudite', 'Émirats Arabes Unis', 'Qatar', 'Koweït', 'Bahreïn', 'Oman',
    'Turquie', 'France', 'Italie', 'Espagne', 'Allemagne', 'Belgique', 'Suisse',
    'Royaume-Uni', 'États-Unis', 'Canada', 'Malaisie', 'Indonésie', 'Jordanie',
    'Liban', 'Pakistan', 'Inde', 'Bangladesh', 'Sénégal', 'Côte d\'Ivoire',
    'Nigeria', 'Afrique du Sud'
  ];

  countrySearch = '';
  
  editForm: {
    title: string;
    description: string;
    image: string;
    about: string;
    price: number;
    currency: string;
    country: string;
    durationDays: number | null;
    benefits: string;
    features: string;
    status: 'active' | 'inactive';
  } = this.getEmptyForm();

  constructor(private dataService: DataService, private confirmService: ConfirmService) {}

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.loading = true;
    this.dataService.getServices().subscribe({
      next: (services) => {
        this.services = services;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des services :', err);
        this.loading = false;
        alert('Erreur lors du chargement des services');
      }
    });
  }

  openCreateModal() {
    this.isCreateMode = true;
    this.editedService = null;
    this.editForm = this.getEmptyForm();
  }

  openEditModal(service: Service) {
    this.isCreateMode = false;
    this.editedService = service;
    this.editForm = {
      title: service.title,
      description: service.description || '',
      image: service.image || '',
      about: service.about || '',
      price: service.price,
      currency: service.currency || 'TND',
      country: service.country || '',
      durationDays: service.durationDays ?? null,
      benefits: (service.benefits || []).join(', '),
      features: (service.features || []).join(', '),
      status: service.status
    };
  }

  closeModal() {
    this.editedService = null;
    this.isCreateMode = false;
    this.editForm = this.getEmptyForm();
  }

  saveService() {
    if (!this.editForm.title.trim() || !this.editForm.description.trim()) {
      alert('Veuillez remplir au moins le titre et la description');
      return;
    }

    if (!this.editForm.price || this.editForm.price <= 0) {
      alert('Veuillez saisir un prix valide');
      return;
    }

    if (this.editForm.durationDays !== null && this.editForm.durationDays <= 0) {
      alert('Veuillez saisir une durée maximale valide (en jours)');
      return;
    }

    const serviceData: Omit<Service, 'id'> = {
      title: this.editForm.title.trim(),
      description: this.editForm.description.trim(),
      image: this.editForm.image.trim() || undefined,
      about: this.editForm.about.trim() || undefined,
      price: this.editForm.price,
      currency: this.editForm.currency || 'TND',
      country: this.editForm.country.trim() || undefined,
      startDate: undefined,
      endDate: undefined,
      durationDays: this.editForm.durationDays ?? undefined,
      status: this.editForm.status,
      benefits: this.splitCommaList(this.editForm.benefits),
      features: this.splitCommaList(this.editForm.features)
    };

    if (this.isCreateMode) {
      this.dataService.addService(serviceData).subscribe({
        next: () => {
          this.loadServices();
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur lors de la création du service :', err);
          // Show more details when available
          const status = (err && err.status) ? ` (${err.status})` : '';
          const backendMessage = err && err.error ? (typeof err.error === 'string' ? err.error : JSON.stringify(err.error)) : '';
          alert(`Erreur lors de la création du service${status}: ${backendMessage || err.message || 'Erreur inconnue'}`);
        }
      });
    } else if (this.editedService) {
      this.dataService.updateService({
        ...this.editedService,
        ...serviceData
      }).subscribe({
        next: () => {
          this.loadServices();
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du service :', err);
          const status = (err && err.status) ? ` (${err.status})` : '';
          const backendMessage = err && err.error ? (typeof err.error === 'string' ? err.error : JSON.stringify(err.error)) : '';
          alert(`Erreur lors de la mise à jour du service${status}: ${backendMessage || err.message || 'Erreur inconnue'}`);
        }
      });
    }
  }

  async deleteService(id: string) {
    const ok = await this.confirmService.confirm('Êtes-vous sûr de vouloir supprimer ce service?');
    if (!ok) return;

    this.dataService.deleteService(id).subscribe({
      next: () => {
        this.loadServices();
      },
      error: (err) => {
        console.error('Erreur lors de la suppression du service :', err);
        alert('Erreur lors de la suppression du service');
      }
    });
  }

  private getEmptyForm() {
    return {
      title: '',
      description: '',
      image: '',
      about: '',
      price: 0,
      currency: 'TND',
      country: '',
      durationDays: null,
      benefits: '',
      features: '',
      status: 'active' as 'active' | 'inactive'
    };
  }

  private splitCommaList(value: string): string[] {
    return value
      .split(',')
      .map(item => item.trim())
      .filter(item => !!item);
  }

  get filteredAdminCountries(): string[] {
    const term = this.countrySearch.toLowerCase().trim();
    if (!term) {
      return this.allCountries;
    }
    return this.allCountries.filter(c => c.toLowerCase().includes(term));
  }
}
