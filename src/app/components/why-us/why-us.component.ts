import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Shield, Clock, Headphones, DollarSign, Star, CheckCircle } from 'lucide-angular';

@Component({
  selector: 'app-why-us',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './why-us.component.html',
  styleUrl: './why-us.component.css'
})
export class WhyUsComponent {
  reasons = [
    {
      icon: Shield,
      title: 'Sécurité Garantie',
      description: 'Vos documents et paiements sont sécurisés',
      gradient: 'from-blue-600 to-cyan-600',
    },
    {
      icon: Clock,
      title: 'Service Rapide',
      description: 'Traitement express de vos demandes',
      gradient: 'from-emerald-600 to-teal-600',
    },
    {
      icon: Headphones,
      title: 'Support 24/7',
      description: 'Une équipe disponible à tout moment',
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      icon: DollarSign,
      title: 'Prix Compétitifs',
      description: 'Les meilleurs tarifs du marché',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      icon: Star,
      title: 'Qualité Premium',
      description: 'Hôtels et services de première classe',
      gradient: 'from-blue-600 to-emerald-600',
    },
    {
      icon: CheckCircle,
      title: 'Accompagnement Complet',
      description: 'De la réservation au retour',
      gradient: 'from-emerald-600 to-teal-700',
    },
  ];
}
