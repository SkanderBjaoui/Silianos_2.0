import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Phone, MapPin, MessageCircle, Mail, User } from 'lucide-angular';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  userIcon = User;
  mailIcon = Mail;
  phoneIcon = Phone;

  contactForm = {
    name: '',
    email: '',
    phone: '',
    subject: 'Demande de contact',
    message: ''
  };

  submitted = false;
  success = false;

  contacts = [
    {
      icon: Phone,
      title: 'Téléphone',
      details: ['98 147 666', '98 140 565', '98 147 500'],
      gradient: 'from-blue-600 to-emerald-600',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      details: ['+216 98 147 666'],
      gradient: 'from-emerald-600 to-teal-600',
    },
    {
      icon: MapPin,
      title: 'Adresse',
      details: ['Rue Ahmed Ibn Abi Dhiaf', 'Siliana, Tunisie'],
      gradient: 'from-blue-500 to-cyan-600',
    },
  ];

  constructor(private dataService: DataService) {}

  onSubmit() {
    this.submitted = true;
    if (this.contactForm.name && this.contactForm.email && this.contactForm.message) {
      this.dataService.addContactMessage({
        name: this.contactForm.name,
        email: this.contactForm.email,
        phone: this.contactForm.phone,
        subject: this.contactForm.subject,
        message: this.contactForm.message
      });
      
      this.success = true;
      this.contactForm = {
        name: '',
        email: '',
        phone: '',
        subject: 'Demande de contact',
        message: ''
      };
      
      setTimeout(() => {
        this.submitted = false;
        this.success = false;
      }, 5000);
    }
  }
}
