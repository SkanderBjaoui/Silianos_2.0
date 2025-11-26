import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LucideAngularModule, Check, ArrowLeft } from 'lucide-angular';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ServicesComponent } from '../../components/services/services.component';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, NavbarComponent, FooterComponent],
  templateUrl: './service-detail.component.html',
  styleUrl: './service-detail.component.css'
})
export class ServiceDetailComponent implements OnInit {
  checkIcon = Check;
  arrowLeftIcon = ArrowLeft;
  serviceId: string | null = null;
  service: any = null;

  services = [
    {
      id: 'omra-hajj',
      title: 'Omra & Hajj',
      description: 'Packages complets avec vol direct, hébergement premium et accompagnement religieux',
      fullDescription: 'Notre service Omra & Hajj offre une expérience spirituelle complète avec des packages soigneusement conçus pour répondre à tous vos besoins. Nous proposons des vols directs, des hébergements de qualité 4-5 étoiles situés à proximité des sites sacrés, et une supervision religieuse experte pour vous guider tout au long de votre pèlerinage.',
      image: 'assets/ahdj.png',
      features: ['Vol Direct', 'Hôtels 4-5 étoiles', 'Supervision Religieuse', 'Visites Guidées', 'Assistance 24/7', 'Transport Premium'],
      benefits: [
        'Accompagnement par des guides religieux expérimentés',
        'Hébergement dans les meilleurs hôtels proches de la Grande Mosquée',
        'Transport confortable et sécurisé',
        'Assistance complète avant, pendant et après le voyage'
      ],
      color: 'from-blue-500 to-cyan-600',
    },
    {
      id: 'visas',
      title: 'Visas Internationaux',
      description: 'Traitement rapide de vos demandes de visa pour diverses destinations',
      fullDescription: 'Nous facilitons l\'obtention de vos visas internationaux avec un service rapide et fiable. Notre équipe expérimentée s\'occupe de toutes les démarches administratives pour vous faire gagner du temps et éviter les tracas.',
      image: 'https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?w=800&q=80',
      features: ['EAU - 400 DT/mois', 'Qatar - 280 DT/mois', 'Égypte - 150 DT/mois', 'Oman - à partir de 350 DT', 'Traitement Express', 'Suivi Personnalisé'],
      benefits: [
        'Processus simplifié et guidé',
        'Taux de réussite élevé',
        'Support client dédié',
        'Mise à jour en temps réel sur l\'état de votre demande'
      ],
      color: 'from-blue-600 to-emerald-600',
    },
    {
      id: 'circuit-sud',
      title: 'Circuits Sud Tunisien',
      description: 'Découvrez les merveilles du sud avec confort et aventure',
      fullDescription: 'Explorez les merveilles du sud tunisien avec nos circuits soigneusement planifiés. De Matmata à Tozeur, en passant par Chebika, découvrez des paysages à couper le souffle et une culture riche.',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      features: ['Matmata', 'Tozeur', 'Chebika', 'Aventure 4x4', 'Hébergement Inclus', 'Guide Professionnel'],
      benefits: [
        'Découverte des sites historiques et naturels',
        'Aventures en 4x4 dans le désert',
        'Hébergement confortable inclus',
        'Guides locaux expérimentés'
      ],
      color: 'from-teal-600 to-emerald-700',
    },
    {
      id: 'voyage-mesure',
      title: 'Voyages sur Mesure',
      description: 'Créez votre voyage idéal avec notre équipe d\'experts',
      fullDescription: 'Créez le voyage de vos rêves avec notre service personnalisé. Notre équipe d\'experts travaille avec vous pour concevoir un itinéraire unique qui correspond parfaitement à vos goûts, votre budget et vos attentes.',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
      features: ['Itinéraire Personnalisé', 'Budget Flexible', 'Assistance Complète', 'Réservation Facile', 'Conseils d\'Experts', 'Support 24/7'],
      benefits: [
        'Itinéraire 100% personnalisé selon vos préférences',
        'Flexibilité totale dans le choix des destinations',
        'Accompagnement de A à Z',
        'Meilleur rapport qualité-prix garanti'
      ],
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.serviceId = this.route.snapshot.paramMap.get('id');
    this.service = this.services.find(s => s.id === this.serviceId);
  }
}

