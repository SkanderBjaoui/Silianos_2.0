import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Calendar, Users, Mail, Phone, MapPin, Plane } from 'lucide-angular';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, NavbarComponent, FooterComponent],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent {
  calendarIcon = Calendar;
  usersIcon = Users;
  mailIcon = Mail;
  phoneIcon = Phone;
  mapPinIcon = MapPin;
  planeIcon = Plane;

  bookingForm = {
    customerName: '',
    email: '',
    phone: '',
    serviceType: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    numberOfTravelers: 1,
    notes: ''
  };

  serviceTypes = [
    'Omra & Hajj',
    'Visa EAU',
    'Visa Qatar',
    'Visa Égypte',
    'Visa Oman',
    'Circuit Sud Tunisien',
    'Voyage sur Mesure'
  ];

  submitted = false;
  success = false;

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {}

  onSubmit() {
    this.submitted = true;
    if (this.isFormValid()) {
      const currentUser = this.authService.getCurrentUser();
      this.dataService.addBooking({
        userId: currentUser?.id,
        customerName: this.bookingForm.customerName,
        email: this.bookingForm.email,
        phone: this.bookingForm.phone,
        serviceType: this.bookingForm.serviceType,
        destination: this.bookingForm.destination || undefined,
        departureDate: this.bookingForm.departureDate,
        returnDate: this.bookingForm.returnDate || undefined,
        numberOfTravelers: this.bookingForm.numberOfTravelers,
        notes: this.bookingForm.notes || undefined
      });
      
      this.success = true;
      this.resetForm();
      
      setTimeout(() => {
        this.submitted = false;
        this.success = false;
      }, 5000);
    }
  }

  isFormValid(): boolean {
    return !!(
      this.bookingForm.customerName &&
      this.bookingForm.email &&
      this.bookingForm.phone &&
      this.bookingForm.serviceType &&
      this.bookingForm.departureDate
    );
  }

  resetForm() {
    this.bookingForm = {
      customerName: '',
      email: '',
      phone: '',
      serviceType: '',
      destination: '',
      departureDate: '',
      returnDate: '',
      numberOfTravelers: 1,
      notes: ''
    };
  }
}

