import { Component, OnInit, HostListener, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { LucideAngularModule, Menu, X, ChevronDown, User, LogOut, Layout, Calendar, CreditCard, Heart, Bell, HelpCircle } from 'lucide-angular';
import { AuthService, User as AuthUser } from '../../services/auth.service';
import { Subscription, filter } from 'rxjs';

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
export class NavbarComponent implements OnInit, OnDestroy, AfterViewInit {
  isOpen = false;
  scrolled = false;
  openDropdowns: { [key: string]: boolean } = {};
  closeTimeouts: { [key: string]: any } = {};
  currentUser: AuthUser | null = null;
  userMenuOpen = false;
  private userSubscription?: Subscription;
  private routerSubscription?: Subscription;

  menuIcon = Menu;
  xIcon = X;
  chevronDownIcon = ChevronDown;
  userIcon = User;
  logoutIcon = LogOut;
  layoutIcon = Layout;
  calendarIcon = Calendar;
  creditCardIcon = CreditCard;
  heartIcon = Heart;
  bellIcon = Bell;
  helpCircleIcon = HelpCircle;
  
  dashboardMenuOpen = false;
  
  @ViewChild('dropdownTrigger', { static: false }) dropdownTrigger?: ElementRef;
  @ViewChild('userMenuTrigger', { static: false }) userMenuTrigger?: ElementRef;

  // Grouped navigation structure
  navItems: (NavLink | NavDropdown)[] = [
    {
      label: 'Accueil',
      href: '/',
      links: [
        { href: '/', anchor: '#about', label: 'À Propos' },
        { href: '/', anchor: '#why-us', label: 'Pourquoi Nous' },
        { href: '/', anchor: '#services', label: 'Nos Services' },
        { href: '/', anchor: '#pricing', label: 'Tarifs' },
        { href: '/', anchor: '#contact', label: 'Contact' },
        { href: '/', anchor: '#social', label: 'Nos Réseaux' },
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

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.handleScroll();
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    // Subscribe to route changes to update navbar state
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Force change detection for navbar background
        this.handleScroll();
      });
  }

  ngAfterViewInit() {
    // Update dropdown positions on scroll and resize
    window.addEventListener('scroll', () => this.updateDropdownPositions());
    window.addEventListener('resize', () => this.updateDropdownPositions());
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
    // Restore body scroll
    document.body.style.overflow = '';
    // Remove event listeners
    window.removeEventListener('scroll', () => this.updateDropdownPositions());
    window.removeEventListener('resize', () => this.updateDropdownPositions());
  }

  updateDropdownPositions() {
    // Trigger change detection for dropdown positions
    // This will be handled by the getter methods
  }

  getDropdownPosition(label: string): { top: number; left: number } | null {
    if (!this.isDropdownOpen(label)) return null;
    
    const button = document.querySelector(`.dropdown-button[data-label="${label}"]`);
    if (!button) return null;
    
    const rect = button.getBoundingClientRect();
    return {
      top: rect.bottom + 8, // 8px for pt-2 spacing
      left: rect.left
    };
  }

  getUserMenuPosition(): { top: number; right: number } | null {
    if (!this.userMenuOpen || !this.currentUser) return null;
    
    const button = document.querySelector('.user-menu-container')?.querySelector('button');
    if (!button) return null;
    
    const rect = button.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    
    return {
      top: rect.bottom + 8, // 8px for mt-2 spacing
      right: viewportWidth - rect.right
    };
  }

  @HostListener('window:scroll', [])
  handleScroll() {
    this.scrolled = window.scrollY > 50;
  }

  shouldShowStickyBackground(): boolean {
    const currentRoute = this.router.url || '/';
    const stickyPages = ['/services', '/booking', '/gallery', '/testimonials', '/blog'];
    return this.scrolled || stickyPages.some(page => currentRoute.startsWith(page));
  }

  toggleMenu(event?: Event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    this.isOpen = !this.isOpen;
    // Prevent body scroll when menu is open
    if (this.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      this.dashboardMenuOpen = false;
    }
  }
  
  toggleDashboardMenu(event: Event) {
    event.stopPropagation();
    this.dashboardMenuOpen = !this.dashboardMenuOpen;
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

  handleDropdownClick(item: NavDropdown, event: Event) {
    const targetRoute = this.getDropdownRoute(item.label);
    if (!targetRoute) {
      return;
    }

    this.navigateToRoute(targetRoute, event);
  }

  handleRouteNav(route: string, event: Event) {
    if (!route) {
      return;
    }

    this.navigateToRoute(route, event);
  }

  private getDropdownRoute(label: string): string | null {
    if (label === 'Accueil') {
      return '/';
    }

    if (label === 'Services') {
      return '/services';
    }

    return null;
  }

  private navigateToRoute(targetRoute: string, event: Event) {
    event.preventDefault();
    this.isOpen = false;
    Object.keys(this.openDropdowns).forEach(key => {
      this.openDropdowns[key] = false;
    });

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    const currentRoute = this.router.url || '/';
    if (currentRoute === targetRoute) {
      scrollToTop();
    } else {
      this.router.navigate([targetRoute]).then(() => {
        setTimeout(scrollToTop, 100);
      });
    }
  }

  isDropdown(item: NavLink | NavDropdown): item is NavDropdown {
    return 'links' in item;
  }

  isLink(item: NavLink | NavDropdown): item is NavLink {
    return 'href' in item && !('links' in item);
  }

  scrollToTop(event: Event) {
    const currentRoute = this.router.url || '/';
    if (currentRoute === '/') {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // Navigate to home first, then scroll
      event.preventDefault();
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }, 100);
      });
    }
  }

  toggleUserMenu(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.userMenuOpen = !this.userMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.userMenuOpen) {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu-container')) {
        this.userMenuOpen = false;
      }
    }
  }

  logout() {
    this.authService.logout();
    this.userMenuOpen = false;
    this.router.navigate(['/']);
  }
}
