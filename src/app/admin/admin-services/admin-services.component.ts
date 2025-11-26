import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './admin-services.component.html',
  styleUrl: './admin-services.component.css'
})
export class AdminServicesComponent {
  services = [
    { id: 'omra-hajj', title: 'Omra & Hajj', status: 'active' },
    { id: 'visas', title: 'Visas Internationaux', status: 'active' },
    { id: 'circuit-sud', title: 'Circuits Sud Tunisien', status: 'active' },
    { id: 'voyage-mesure', title: 'Voyages sur Mesure', status: 'active' },
  ];
}

