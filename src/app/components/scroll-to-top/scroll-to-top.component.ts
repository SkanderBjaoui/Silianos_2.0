import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ArrowUp } from 'lucide-angular';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div
      class="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 transition-opacity duration-300"
      [class.opacity-0]="!isVisible"
      [class.pointer-events-none]="!isVisible"
    >
      <button
        type="button"
        class="group relative flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold shadow-2xl shadow-emerald-500/30 hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1"
        (click)="scrollToTop()"
        aria-label="Revenir en haut"
      >
        <lucide-icon [name]="arrowUpIcon" class="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5"></lucide-icon>
        <span class="text-sm tracking-wide uppercase">Haut de page</span>
      </button>
    </div>
  `,
  styles: [
    `
      :host {
        position: relative;
      }
    `
  ]
})
export class ScrollToTopComponent {
  arrowUpIcon = ArrowUp;
  isVisible = false;

  @HostListener('window:scroll')
  onScroll() {
    this.isVisible = window.scrollY > 300;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}


