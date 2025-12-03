import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { LucideAngularModule, LogOut, LayoutDashboard, Calendar, Package, DollarSign, MessageSquare, Star, Menu, X, FileText, Image as ImageIcon } from 'lucide-angular';
import { DataService } from '../../services/data.service';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, LucideAngularModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  logOutIcon = LogOut;
  dashboardIcon = LayoutDashboard;
  calendarIcon = Calendar;
  packageIcon = Package;
  dollarSignIcon = DollarSign;
  messageSquareIcon = MessageSquare;
  starIcon = Star;
  menuIcon = Menu;
  xIcon = X;

  sidebarOpen = false;
  stats = {
    bookings: 0,
    messages: 0,
    testimonials: 0,
    revenue: 0
  };

  menuItems = [
    { path: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
    { path: '/admin/bookings', label: 'Réservations', icon: Calendar },
    { path: '/admin/services', label: 'Services', icon: Package },
    { path: '/admin/testimonials', label: 'Témoignages', icon: Star },
    { path: '/admin/messages', label: 'Messages', icon: MessageSquare },
    { path: '/admin/blog', label: 'Blog', icon: FileText },
    { path: '/admin/gallery', label: 'Galerie', icon: ImageIcon },
  ];

  constructor(
    private router: Router,
    private dataService: DataService
    , private currencyService: CurrencyService
  ) {}

  ngOnInit() {
    // Check if user is logged in
    if (!localStorage.getItem('adminLoggedIn')) {
      this.router.navigate(['/admin/login']);
      return;
    }

    this.loadStats();
  }

  loadStats() {
    this.dataService.getBookings().subscribe(bookings => {
      this.stats.bookings = bookings.length;
      const rates: { [key: string]: number } = { TND: 1, EUR: 3.4, USD: 3.1 };
      const approved = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed');
      // Load rates (merge with fallbacks) and compute revenue using CurrencyService
      this.currencyService.loadRates().subscribe(() => {
        const revenue = approved.reduce((sum, b) => {
          const amt = Number(b.totalAmount ?? b.priceSnapshot) || 0;
          const currency = (b.currency || (b as any).packageCurrency || 'TND').toString().toUpperCase();
          const converted = this.currencyService.convert(amt, currency, 'TND');
          return sum + converted;
        }, 0);
        this.stats.revenue = Math.round(revenue);
      });
    });

    this.dataService.getContactMessages().subscribe(messages => {
      this.stats.messages = messages.filter(m => m.status === 'new').length;
    });

    this.dataService.getTestimonials().subscribe(testimonials => {
      this.stats.testimonials = testimonials.length;
    });
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    localStorage.removeItem('adminLoggedIn');
    this.router.navigate(['/admin/login']);
  }
}

