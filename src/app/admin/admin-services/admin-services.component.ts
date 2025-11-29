import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

type ServiceStatus = 'active' | 'inactive';

interface AdminService {
  id: string;
  title: string;
  description: string;
  status: ServiceStatus;
  image: string;
  about: string;
  benefits: string[];
  features: string[];
}

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './admin-services.component.html',
  styleUrl: './admin-services.component.css'
})
export class AdminServicesComponent {
  services: AdminService[] = [
    {
      id: 'omra-hajj',
      title: 'Omra & Hajj',
      description: 'Packages complets pour Omra & Hajj.',
      status: 'active',
      image: 'assets/ahdj.png',
      about: 'Accompagnement spirituel complet et logistique premium pour Omra & Hajj.',
      benefits: [
        'Guides spécialisés',
        'Hôtels proches des lieux saints',
        'Support 24/7'
      ],
      features: [
        'Vols directs',
        'Hébergement premium',
        'Visites guidées'
      ]
    },
    {
      id: 'visas',
      title: 'Visas Internationaux',
      description: 'Accompagnement complet pour l’obtention de visas.',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?w=800&q=80',
      about: 'Prise en charge administrative rapide pour tous types de visas internationaux.',
      benefits: [
        'Équipe dédiée',
        'Notifications statut',
        'Traitement accéléré'
      ],
      features: [
        'Dossier complet',
        'Traductions certifiées',
        'Suivi personnalisé'
      ]
    },
    {
      id: 'circuit-sud',
      title: 'Circuits Sud Tunisien',
      description: 'Circuits immersifs dans le sud tunisien.',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      about: 'Découverte authentique du sud tunisien avec guides locaux et expériences immersives.',
      benefits: [
        'Guides locaux',
        'Expériences culturelles',
        'Logistique incluse'
      ],
      features: [
        'Hébergement charmant',
        'Transport confortable',
        'Programme modulable'
      ]
    },
    {
      id: 'voyage-mesure',
      title: 'Voyages sur Mesure',
      description: 'Voyages personnalisés selon les besoins clients.',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
      about: 'Création de séjours entièrement personnalisés selon les envies et le budget.',
      benefits: [
        'Conseiller dédié',
        'Budget maîtrisé',
        'Flexibilité totale'
      ],
      features: [
        'Sélection d’hôtels',
        'Activités personnalisées',
        'Support premium'
      ]
    }
  ];

  editedService: AdminService | null = null;
  editForm: {
    title: string;
    description: string;
    image: string;
    about: string;
    benefits: string;
    features: string;
    status: ServiceStatus;
  } = this.getEmptyForm();

  openEditModal(service: AdminService) {
    this.editedService = service;
    this.editForm = {
      title: service.title,
      description: service.description,
      image: service.image,
      about: service.about,
      benefits: service.benefits.join(', '),
      features: service.features.join(', '),
      status: service.status
    };
  }

  closeModal() {
    this.editedService = null;
    this.editForm = this.getEmptyForm();
  }

  saveService() {
    if (!this.editedService) {
      return;
    }

    this.services = this.services.map(service =>
      service.id === this.editedService?.id
        ? {
            ...service,
            title: this.editForm.title.trim(),
            description: this.editForm.description.trim(),
            image: this.editForm.image.trim(),
            about: this.editForm.about.trim(),
            benefits: this.splitCommaList(this.editForm.benefits),
            features: this.splitCommaList(this.editForm.features),
            status: this.editForm.status
          }
        : service
    );

    this.closeModal();
  }

  private getEmptyForm() {
    return {
      title: '',
      description: '',
      image: '',
      about: '',
      benefits: '',
      features: '',
      status: 'active' as ServiceStatus
    };
  }

  private splitCommaList(value: string): string[] {
    return value
      .split(',')
      .map(item => item.trim())
      .filter(item => !!item);
  }
}

