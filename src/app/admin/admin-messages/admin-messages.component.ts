import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Mail, Trash2, Check, Eye, X } from 'lucide-angular';
import { DataService, ContactMessage } from '../../services/data.service';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
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

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.messages = this.dataService.getContactMessages();
  }

  getNewMessagesCount(): number {
    return this.messages.filter(m => m.status === 'new').length;
  }

  markAsRead(id: string) {
    this.dataService.updateMessageStatus(id, 'read');
    this.loadMessages();
  }

  markAsReplied(id: string) {
    this.dataService.updateMessageStatus(id, 'replied');
    this.loadMessages();
  }

  deleteMessage(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce message?')) {
      this.dataService.deleteMessage(id);
      this.loadMessages();
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

