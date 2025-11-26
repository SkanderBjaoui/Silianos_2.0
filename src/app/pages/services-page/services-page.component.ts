import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, MapPin, Plane, Globe, Calendar } from 'lucide-angular';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, NavbarComponent, FooterComponent],
  templateUrl: './services-page.component.html',
  styleUrl: './services-page.component.css'
})
export class ServicesPageComponent {
  services = [
    {
      id: 'omra-hajj',
      icon: MapPin,
      title: 'Omra & Hajj',
      description: 'Packages complets avec vol direct, hébergement premium et accompagnement religieux',
      image: 'assets/ahdj.png',
      features: ['Vol Direct', 'Hôtels 4-5 étoiles', 'Supervision Religieuse', 'Visites Guidées'],
      color: 'from-blue-500 to-cyan-600',
    },
    {
      id: 'visas',
      icon: Plane,
      title: 'Visas Internationaux',
      description: 'Traitement rapide de vos demandes de visa pour diverses destinations',
      image: 'https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?w=800&q=80',
      features: ['EAU - 400 DT/mois', 'Qatar - 280 DT/mois', 'Égypte - 150 DT/mois', 'Oman - à partir de 350 DT'],
      color: 'from-blue-600 to-emerald-600',
    },
    {
      id: 'circuit-sud',
      icon: Globe,
      title: 'Circuits Sud Tunisien',
      description: 'Découvrez les merveilles du sud avec confort et aventure',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      features: ['Matmata', 'Tozeur', 'Chebika', 'Aventure 4x4'],
      color: 'from-teal-600 to-emerald-700',
    },
    {
      id: 'voyage-mesure',
      icon: Calendar,
      title: 'Voyages sur Mesure',
      description: 'Créez votre voyage idéal avec notre équipe d\'experts',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
      features: ['Itinéraire Personnalisé', 'Budget Flexible', 'Assistance Complète', 'Réservation Facile'],
      color: 'from-emerald-500 to-teal-600',
    },
  ];
}

