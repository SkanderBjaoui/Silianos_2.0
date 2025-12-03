import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Check, X, Trash2, Eye } from 'lucide-angular';
import { DataService, Booking } from '../../services/data.service';
import { ConfirmService } from '../../shared/confirm.service';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
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
  filterQuery: string = '';
  statusFilter: string = '';

  get filteredBookings(): Booking[] {
    const q = this.filterQuery.trim().toLowerCase();
    return this.bookings.filter(b => {
      if (this.statusFilter && b.status !== this.statusFilter) return false;
      if (!q) return true;
      return (
        (b.customerName || '').toLowerCase().includes(q) ||
        (b.email || '').toLowerCase().includes(q) ||
        (b.serviceType || '').toLowerCase().includes(q)
      );
    });
  }

  constructor(private dataService: DataService, private confirmService: ConfirmService) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.dataService.getBookings().subscribe(bookings => {
      this.bookings = bookings;
    });
  }

  updateStatus(id: string, status: Booking['status']) {
    this.dataService.updateBookingStatus(id, status).subscribe({
      next: () => this.loadBookings(),
      error: (err) => console.error('Erreur lors de la mise à jour du statut :', err)
    });
  }

  async deleteBooking(id: string) {
    const ok = await this.confirmService.confirm('Êtes-vous sûr de vouloir supprimer cette réservation?');
    if (!ok) return;
    this.dataService.deleteBooking(id).subscribe({
      next: () => this.loadBookings(),
      error: (err) => console.error('Erreur lors de la suppression de la réservation :', err)
    });
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

