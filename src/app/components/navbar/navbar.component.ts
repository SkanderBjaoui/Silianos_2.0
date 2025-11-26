import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule, Menu, X, ChevronDown } from 'lucide-angular';

interface NavLink {
  href: string;
  anchor?: string;
  label: string;
}

interface NavDropdown {
  label: string;
  href: string;
  links: NavLink[];
  isOpen?: boolean;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isOpen = false;
  scrolled = false;
  openDropdowns: { [key: string]: boolean } = {};
  closeTimeouts: { [key: string]: any } = {};

  menuIcon = Menu;
  xIcon = X;
  chevronDownIcon = ChevronDown;

  // Grouped navigation structure
  navItems: (NavLink | NavDropdown)[] = [
    {
      label: 'Accueil',
      href: '/',
      links: [
        { href: '/', anchor: '#about', label: 'À Propos' },
        { href: '/', anchor: '#why-us', label: 'Pourquoi Nous' },
        { href: '/', anchor: '#pricing', label: 'Tarifs' },
        { href: '/', anchor: '#contact', label: 'Contact' },
      ]
    },
    {
      label: 'Services',
      href: '/services',
      links: [
        { href: '/services/omra-hajj', anchor: '', label: 'Omra & Hajj' },
        { href: '/services/visas', anchor: '', label: 'Visas Internationaux' },
        { href: '/services/circuit-sud', anchor: '', label: 'Circuits Sud Tunisien' },
        { href: '/services/voyage-mesure', anchor: '', label: 'Voyages sur Mesure' },
      ]
    },
    { href: '/booking', anchor: '', label: 'Réservation' },
    { href: '/gallery', anchor: '', label: 'Galerie' },
    { href: '/testimonials', anchor: '', label: 'Témoignages' },
    { href: '/blog', anchor: '', label: 'Blog' },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.handleScroll();
  }

  @HostListener('window:scroll', [])
  handleScroll() {
    this.scrolled = window.scrollY > 50;
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  openDropdown(label: string) {
    // Clear any pending close timeout
    if (this.closeTimeouts[label]) {
      clearTimeout(this.closeTimeouts[label]);
      delete this.closeTimeouts[label];
    }
    this.openDropdowns[label] = true;
  }

  closeDropdown(label: string) {
    // Add a delay before closing to allow mouse movement to dropdown
    this.closeTimeouts[label] = setTimeout(() => {
      this.openDropdowns[label] = false;
      delete this.closeTimeouts[label];
    }, 200); // Increased delay to allow mouse to move to dropdown
  }

  toggleDropdown(label: string, event: Event) {
    event.stopPropagation();
    this.openDropdowns[label] = !this.openDropdowns[label];
  }

  isDropdownOpen(label: string): boolean {
    return !!this.openDropdowns[label];
  }

  handleNavClick(link: NavLink, event: Event) {
    this.isOpen = false;
    // Close all dropdowns
    Object.keys(this.openDropdowns).forEach(key => {
      this.openDropdowns[key] = false;
    });
    
    if (link.anchor) {
      const sectionId = link.anchor.replace('#', '');
      
      // If we're on home page, scroll to section
      if (this.router.url === '/' || this.router.url === '') {
        event.preventDefault();
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
        event.preventDefault();
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

  isDropdown(item: NavLink | NavDropdown): item is NavDropdown {
    return 'links' in item;
  }

  isLink(item: NavLink | NavDropdown): item is NavLink {
    return 'href' in item && !('links' in item);
  }
}
