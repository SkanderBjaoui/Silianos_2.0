import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Star, Trash2, Check, X } from 'lucide-angular';
import { DataService, Testimonial } from '../../services/data.service';

@Component({
  selector: 'app-admin-testimonials',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './admin-testimonials.component.html',
  styleUrl: './admin-testimonials.component.css'
})
export class AdminTestimonialsComponent implements OnInit {
  starIcon = Star;
  trashIcon = Trash2;
  checkIcon = Check;
  xIcon = X;

  testimonials: Testimonial[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadTestimonials();
  }

  loadTestimonials() {
    this.testimonials = this.dataService.getTestimonials();
  }

  verifyTestimonial(id: string) {
    const testimonial = this.testimonials.find(t => t.id === id);
    if (testimonial) {
      testimonial.verified = true;
    }
  }

  deleteTestimonial(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce témoignage?')) {
      this.dataService.deleteTestimonial(id);
      this.loadTestimonials();
    }
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }
}

