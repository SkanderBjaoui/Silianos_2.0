import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule, Plane, MapPin, Phone } from 'lucide-angular';
import { DataService, Service } from '../../services/data.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  planeIcon = Plane;
  mapPinIcon = MapPin;
  phoneIcon = Phone;
  currentYear = new Date().getFullYear();
  footerServices: Service[] = [];

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getServices().subscribe(services => {
      const active = (services || []).filter(s => s.status === 'active');
      const shuffled = active.sort(() => Math.random() - 0.5);
      this.footerServices = shuffled.slice(0, 4);
    });
  }

  scrollToSection(sectionId: string, event: Event) {
    event.preventDefault();
    
    // If we're on home page, scroll to section
    if (this.router.url === '/' || this.router.url === '') {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const navbarHeight = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      // Navigate to home first, then scroll
      this.router.navigate(['/'], { fragment: sectionId }).then(() => {
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            const navbarHeight = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      });
    }
  }
}
