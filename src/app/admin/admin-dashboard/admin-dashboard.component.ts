import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { LucideAngularModule, LogOut, LayoutDashboard, Calendar, Package, DollarSign, MessageSquare, Star, Menu, X, FileText } from 'lucide-angular';
import { DataService } from '../../services/data.service';

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
    { path: '/admin/pricing', label: 'Tarifs', icon: DollarSign },
    { path: '/admin/testimonials', label: 'Témoignages', icon: Star },
    { path: '/admin/messages', label: 'Messages', icon: MessageSquare },
    { path: '/admin/blog', label: 'Blog', icon: FileText },
  ];

  constructor(
    private router: Router,
    private dataService: DataService
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
    this.stats.bookings = this.dataService.getBookings().length;
    this.stats.messages = this.dataService.getContactMessages().filter(m => m.status === 'new').length;
    this.stats.testimonials = this.dataService.getTestimonials().length;
    // Calculate revenue from confirmed bookings (mock calculation)
    this.stats.revenue = this.dataService.getBookings()
      .filter(b => b.status === 'confirmed' || b.status === 'completed')
      .length * 1000; // Mock revenue
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    localStorage.removeItem('adminLoggedIn');
    this.router.navigate(['/admin/login']);
  }
}

