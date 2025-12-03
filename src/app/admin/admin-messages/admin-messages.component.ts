import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Mail, Trash2, Check, Eye, X } from 'lucide-angular';
import { DataService, ContactMessage } from '../../services/data.service';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './admin-messages.component.html',
  styleUrl: './admin-messages.component.css'
})
export class AdminMessagesComponent implements OnInit {
  mailIcon = Mail;
  trashIcon = Trash2;
  checkIcon = Check;
  eyeIcon = Eye;
  xIcon = X;

  messages: ContactMessage[] = [];
  selectedMessage: ContactMessage | null = null;
  showModal = false;
  filterQuery: string = '';

  get filteredMessages(): ContactMessage[] {
    const q = this.filterQuery.trim().toLowerCase();
    if (!q) return this.messages;
    return this.messages.filter(m => {
      return (
        (m.name || '').toLowerCase().includes(q) ||
        (m.email || '').toLowerCase().includes(q) ||
        (m.subject || '').toLowerCase().includes(q) ||
        (m.message || '').toLowerCase().includes(q)
      );
    });
  }

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.dataService.getContactMessages().subscribe(messages => {
      this.messages = messages;
    });
  }

  getNewMessagesCount(): number {
    return this.messages.filter(m => m.status === 'new').length;
  }

  markAsRead(id: string) {
    this.dataService.updateMessageStatus(id, 'read').subscribe({
      next: () => this.loadMessages(),
      error: (err) => console.error('Erreur lors de la mise à jour du statut :', err)
    });
  }

  markAsReplied(id: string) {
    this.dataService.updateMessageStatus(id, 'replied').subscribe({
      next: () => this.loadMessages(),
      error: (err) => console.error('Erreur lors de la mise à jour du statut :', err)
    });
  }

  deleteMessage(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce message?')) {
      this.dataService.deleteMessage(id).subscribe({
        next: () => this.loadMessages(),
        error: (err) => console.error('Erreur lors de la suppression du message :', err)
      });
    }
  }

  viewMessage(message: ContactMessage) {
    this.selectedMessage = message;
    this.showModal = true;
    if (message.status === 'new') {
      this.markAsRead(message.id);
    }
  }

  closeModal() {
    this.showModal = false;
    this.selectedMessage = null;
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      new: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      read: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      replied: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    };
    return colors[status] || colors['new'];
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      new: 'Nouveau',
      read: 'Lu',
      replied: 'Répondu'
    };
    return labels[status] || status;
  }
}

