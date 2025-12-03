import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Calendar, MessageSquare, Star, TrendingUp, ArrowRight } from 'lucide-angular';
import { DataService } from '../../services/data.service';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './admin-overview.component.html',
  styleUrl: './admin-overview.component.css'
})
export class AdminOverviewComponent implements OnInit {
  calendarIcon = Calendar;
  messageSquareIcon = MessageSquare;
  starIcon = Star;
  trendingUpIcon = TrendingUp;
  arrowRightIcon = ArrowRight;

  stats = {
    bookings: 0,
    pendingBookings: 0,
    messages: 0,
    testimonials: 0,
    revenue: 0
  };

  recentBookings: any[] = [];
  recentMessages: any[] = [];

  constructor(private dataService: DataService, private currencyService: CurrencyService) {}

  ngOnInit() {
    this.loadStats();
    this.loadRecentData();
  }

  loadStats() {
    this.dataService.getBookings().subscribe(bookings => {
      this.stats.bookings = bookings.length;
      this.stats.pendingBookings = bookings.filter(b => b.status === 'pending').length;
      // Compute real revenue from confirmed/completed bookings using amount and currency
      const rates: { [key: string]: number } = { TND: 1, EUR: 3.4, USD: 3.1 };
      const approved = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed');
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

  loadRecentData() {
    this.dataService.getBookings().subscribe(bookings => {
      this.recentBookings = bookings
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
    });
    
    this.dataService.getContactMessages().subscribe(messages => {
      this.recentMessages = messages
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
    });
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
      completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    };
    return colors[status] || colors['pending'];
  }
}

