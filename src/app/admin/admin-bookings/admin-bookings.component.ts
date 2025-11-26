import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Check, X, Trash2, Eye } from 'lucide-angular';
import { DataService, Booking } from '../../services/data.service';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './admin-bookings.component.html',
  styleUrl: './admin-bookings.component.css'
})
export class AdminBookingsComponent implements OnInit {
  checkIcon = Check;
  xIcon = X;
  trashIcon = Trash2;
  eyeIcon = Eye;

  bookings: Booking[] = [];
  selectedBooking: Booking | null = null;
  showModal = false;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.bookings = this.dataService.getBookings();
  }

  updateStatus(id: string, status: Booking['status']) {
    this.dataService.updateBookingStatus(id, status);
    this.loadBookings();
  }

  deleteBooking(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réservation?')) {
      this.dataService.deleteBooking(id);
      this.loadBookings();
    }
  }

  viewBooking(booking: Booking) {
    this.selectedBooking = booking;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedBooking = null;
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

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      pending: 'En attente',
      confirmed: 'Confirmé',
      cancelled: 'Annulé',
      completed: 'Terminé'
    };
    return labels[status] || status;
  }
}

