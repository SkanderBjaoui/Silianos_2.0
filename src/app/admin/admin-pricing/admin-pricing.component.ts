import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-admin-pricing',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './admin-pricing.component.html',
  styleUrl: './admin-pricing.component.css'
})
export class AdminPricingComponent {
  packages = [
    { id: '1', title: 'Visa EAU', price: '400', currency: 'DT' },
    { id: '2', title: 'Visa Qatar', price: '280', currency: 'DT' },
    { id: '3', title: 'Visa Égypte', price: '150', currency: 'DT' },
    { id: '4', title: 'Visa Oman', price: '350', currency: 'DT' },
    { id: '5', title: 'Omra 2025', price: '5200', currency: 'DT' },
    { id: '6', title: 'Circuit Sud', price: '380', currency: 'DT' },
  ];
}

