import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Plus, Trash2, Edit } from 'lucide-angular';
import { DataService, PricingPackage } from '../../services/data.service';
import { CURRENCY_OPTIONS } from '../../shared/currency-options';

@Component({
  selector: 'app-admin-pricing',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './admin-pricing.component.html',
  styleUrl: './admin-pricing.component.css'
})
export class AdminPricingComponent implements OnInit {
  plusIcon = Plus;
  trashIcon = Trash2;
  editIcon = Edit;

  packages: PricingPackage[] = [];
  editedPackage: PricingPackage | null = null;
  isCreateMode = false;
  loading = false;
  showModal = false;
  showCurrencyDropdown = false;
  
  getSelectedCurrency() {
    return this.availableCurrencies.find(c => c.code === this.editForm.currency) || this.availableCurrencies[0];
  }
  
  selectCurrency(currency: { code: string; name: string; flag: string }) {
    this.editForm.currency = currency.code;
    this.showCurrencyDropdown = false;
  }

  // Available currencies shared with the client experience
  availableCurrencies = CURRENCY_OPTIONS;

  editForm: {
    title: string;
    description: string;
    price: number;
    currency: string;
    startDate: string;
    endDate: string;
    image: string;
    badge: string;
    features: string;
    isActive: boolean;
  } = this.getEmptyForm();

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadPackages();
  }

  loadPackages() {
    this.loading = true;
    this.dataService.getPricingPackages().subscribe({
      next: (packages) => {
        this.packages = packages;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des forfaits :', err);
        this.loading = false;
        alert('Erreur lors du chargement des tarifs');
      }
    });
  }

  openCreateModal() {
    this.isCreateMode = true;
    this.editedPackage = null;
    this.editForm = this.getEmptyForm();
    this.showModal = true;
  }

  openEditModal(pkg: PricingPackage) {
    this.isCreateMode = false;
    this.editedPackage = pkg;
    this.editForm = {
      title: pkg.title,
      description: pkg.description || '',
      price: pkg.price,
      currency: pkg.currency,
      startDate: pkg.startDate || '',
      endDate: pkg.endDate || '',
      image: pkg.image || '',
      badge: pkg.badge || '',
      features: (pkg.features || []).join(', '),
      isActive: pkg.isActive
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editedPackage = null;
    this.isCreateMode = false;
    this.showCurrencyDropdown = false;
    this.editForm = this.getEmptyForm();
  }

  savePackage() {
    if (!this.editForm.title.trim() || !this.editForm.price || this.editForm.price <= 0) {
      alert('Veuillez remplir au moins le titre et un prix valide');
      return;
    }

    if (!this.editForm.startDate || !this.editForm.endDate) {
      alert('Veuillez sélectionner une date de début et une date de fin');
      return;
    }

    if (new Date(this.editForm.startDate) > new Date(this.editForm.endDate)) {
      alert('La date de début doit être avant la date de fin');
      return;
    }

    const packageData: Omit<PricingPackage, 'id'> = {
      title: this.editForm.title.trim(),
      description: this.editForm.description.trim() || undefined,
      price: this.editForm.price,
      currency: this.editForm.currency || 'TND',
      period: undefined,
      startDate: this.editForm.startDate,
      endDate: this.editForm.endDate,
      image: this.editForm.image.trim() || undefined,
      badge: this.editForm.badge.trim() || undefined,
      features: this.splitCommaList(this.editForm.features),
      isActive: this.editForm.isActive
    };

    if (this.isCreateMode) {
      this.dataService.addPricingPackage(packageData).subscribe({
        next: () => {
          this.loadPackages();
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur lors de la création du forfait :', err);
          alert('Erreur lors de la création du tarif');
        }
      });
    } else if (this.editedPackage) {
      this.dataService.updatePricingPackage({
        ...this.editedPackage,
        ...packageData
      }).subscribe({
        next: () => {
          this.loadPackages();
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du forfait :', err);
          alert('Erreur lors de la mise à jour du tarif');
        }
      });
    }
  }

  deletePackage(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce tarif?')) {
      this.dataService.deletePricingPackage(id).subscribe({
        next: () => {
          this.loadPackages();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du forfait :', err);
          alert('Erreur lors de la suppression du tarif');
        }
      });
    }
  }

  private getEmptyForm() {
    return {
      title: '',
      description: '',
      price: 0,
      currency: 'TND',
      startDate: '',
      endDate: '',
      image: '',
      badge: '',
      features: '',
      isActive: true
    };
  }

  private splitCommaList(value: string): string[] {
    return value
      .split(',')
      .map(item => item.trim())
      .filter(item => !!item);
  }
}
