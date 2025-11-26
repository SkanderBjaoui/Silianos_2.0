import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.css'
})
export class PricingComponent {
  packages = [
    {
      title: 'Visa EAU',
      price: '400',
      currency: 'DT',
      description: 'Visa Emirates avec traitement rapide',
      image: 'https://images.pexels.com/photos/618079/pexels-photo-618079.jpeg?auto=compress&cs=tinysrgb&w=800&q=80',
      features: ['Traitement Express', 'Assistance Administrative', 'Dossier Complet', 'Suivi Personnalisé'],
      badge: 'Populaire',
      gradient: 'from-blue-500 to-emerald-500',
    },
    {
      title: 'Visa Qatar',
      price: '280',
      currency: 'DT',
      description: 'Accédez au Qatar facilement',
      image: 'https://images.pexels.com/photos/3069345/pexels-photo-3069345.jpeg?auto=compress&cs=tinysrgb&w=800&q=80',
      features: ['Procédure Simplifiée', 'Documents Guidés', 'Support 24/7', 'Garantie de Service'],
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Visa Égypte',
      price: '150',
      currency: 'DT',
      description: 'Découvrez les pyramides',
      image: 'assets/egypt.jpg',
      features: ['Prix Imbattable', 'Service Rapide', 'Accompagnement', 'Validation Garantie'],
      gradient: 'from-blue-600 to-cyan-500',
    },
    {
      title: 'Visa Oman',
      price: '350',
      currency: 'DT',
      description: 'Visa Oman professionnel',
      image: 'https://images.goway.com/production/styles/hero_s1_3xl/s3/hero_image/AdobeStock_197282114.jpeg.webp?VersionId=CRAa_XbuTXztEuzDBOACAiCLzVLGrHMn&itok=Vrz6My3t',
      features: ['Homme: 350 DT', 'Femme: 550 DT', 'Traitement VIP', 'Assistance Complète'],
      gradient: 'from-teal-500 to-emerald-600',
    },
    {
      title: 'Omra 2025',
      price: '5200',
      currency: 'DT',
      period: 'À partir de',
      description: 'Package Omra complet',
      image: 'https://images.pexels.com/photos/26436662/pexels-photo-26436662.jpeg?auto=compress&cs=tinysrgb&w=800&q=80',
      features: ['Vol Direct', 'Hôtels Premium', 'Supervision Religieuse', 'Visites Guidées'],
      badge: 'Premium',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Circuit Sud',
      price: '380',
      currency: 'DT',
      description: 'Aventure dans le sud tunisien',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      features: ['Transport Confortable', 'Pension Complète', 'Aventure 4x4', 'Guide Professionnel'],
      gradient: 'from-blue-600 to-slate-700',
    },
  ];
}
