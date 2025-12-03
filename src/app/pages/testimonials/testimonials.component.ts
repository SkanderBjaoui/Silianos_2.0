import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Star, Quote } from 'lucide-angular';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { DataService, Testimonial } from '../../services/data.service';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, NavbarComponent, FooterComponent],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent implements OnInit {
  starIcon = Star;
  quoteIcon = Quote;
  testimonials: Testimonial[] = [];
  showAll = false;

  get displayedTestimonials(): Testimonial[] {
    return this.showAll ? this.testimonials : this.testimonials.slice(0, 3);
  }

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getTestimonials().subscribe(testimonials => {
      // Only display testimonials that were verified/approved by admin
      this.testimonials = (testimonials || []).filter(t => !!t.verified);
    });
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }
}

