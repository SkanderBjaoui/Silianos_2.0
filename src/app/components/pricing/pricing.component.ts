import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TypewriterDirective } from '../../directives/typewriter.directive';
import { DataService, PricingPackage } from '../../services/data.service';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, RouterModule, TypewriterDirective],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.css'
})
export class PricingComponent implements OnInit {
  packages: PricingPackage[] = [];
  loading = false;
  error: string | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadPackages();
  }

  loadPackages() {
    this.loading = true;
    this.dataService.getPricingPackages().subscribe({
      next: (packages) => {
        this.packages = packages.filter(pkg => pkg.isActive !== false);
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des forfaits :', err);
        this.error = 'Impossible de charger les tarifs pour le moment.';
        this.loading = false;
      }
    });
  }
}
