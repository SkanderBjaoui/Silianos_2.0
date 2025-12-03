import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Star, Trash2, Check, X } from 'lucide-angular';
import { DataService, Testimonial } from '../../services/data.service';
import { ConfirmService } from '../../shared/confirm.service';

@Component({
  selector: 'app-admin-testimonials',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './admin-testimonials.component.html',
  styleUrl: './admin-testimonials.component.css'
})
export class AdminTestimonialsComponent implements OnInit {
  starIcon = Star;
  trashIcon = Trash2;
  checkIcon = Check;
  xIcon = X;

  testimonials: Testimonial[] = [];
  filterQuery: string = '';
  verifiedFilter: 'all' | 'verified' | 'unverified' = 'all';

  get filteredTestimonials(): Testimonial[] {
    const q = this.filterQuery.trim().toLowerCase();
    let list = this.testimonials;
    // apply verified filter first
    if (this.verifiedFilter === 'verified') {
      list = list.filter(t => !!t.verified);
    } else if (this.verifiedFilter === 'unverified') {
      list = list.filter(t => !t.verified);
    }

    if (!q) return list;
    return list.filter(t => {
      return (
        (t.customerName || '').toLowerCase().includes(q) ||
        (t.comment || '').toLowerCase().includes(q) ||
        (t.service || '').toLowerCase().includes(q)
      );
    });
  }

  constructor(private dataService: DataService, private confirmService: ConfirmService) {}

  ngOnInit() {
    this.loadTestimonials();
  }

  loadTestimonials() {
    this.dataService.getTestimonials().subscribe(testimonials => {
      this.testimonials = testimonials;
    });
  }

  verifyTestimonial(id: string) {
    this.dataService.verifyTestimonial(id).subscribe({
      next: () => {
        this.loadTestimonials();
      },
      error: (err) => {
        console.error('Erreur lors de la vérification du témoignage :', err);
        alert('Erreur lors de la vérification du témoignage');
      }
    });
  }

  async deleteTestimonial(id: string) {
    const ok = await this.confirmService.confirm('Êtes-vous sûr de vouloir supprimer ce témoignage?');
    if (!ok) return;
    this.dataService.deleteTestimonial(id).subscribe({
      next: () => this.loadTestimonials(),
      error: (err) => console.error('Erreur lors de la suppression du témoignage :', err)
    });
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }
}

