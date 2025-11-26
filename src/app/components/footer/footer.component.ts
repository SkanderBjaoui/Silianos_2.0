import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule, Plane, MapPin, Phone } from 'lucide-angular';

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

  constructor(private router: Router) {}

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
