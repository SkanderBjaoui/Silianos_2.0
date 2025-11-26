import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Calendar, MessageSquare, Star, TrendingUp, ArrowRight } from 'lucide-angular';
import { DataService } from '../../services/data.service';

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

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadStats();
    this.loadRecentData();
  }

  loadStats() {
    const bookings = this.dataService.getBookings();
    this.stats.bookings = bookings.length;
    this.stats.pendingBookings = bookings.filter(b => b.status === 'pending').length;
    this.stats.messages = this.dataService.getContactMessages().filter(m => m.status === 'new').length;
    this.stats.testimonials = this.dataService.getTestimonials().length;
    this.stats.revenue = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed').length * 1000;
  }

  loadRecentData() {
    this.recentBookings = this.dataService.getBookings()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    this.recentMessages = this.dataService.getContactMessages()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
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

