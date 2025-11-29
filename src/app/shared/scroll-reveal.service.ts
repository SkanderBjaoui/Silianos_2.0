import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ScrollRevealService {
  private observer?: IntersectionObserver;
  private mutationObserver?: MutationObserver;
  private initialized = false;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  init() {
    if (this.initialized || typeof window === 'undefined') {
      return;
    }

    this.initialized = true;
    this.observer = new IntersectionObserver(
      entries => this.handleIntersect(entries),
      {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    this.observeExistingElements();
    this.observeMutations();
  }

  private observeExistingElements() {
    const elements = this.document.querySelectorAll<HTMLElement>('.scroll-reveal');
    elements.forEach(el => this.observeElement(el));
  }

  private observeMutations() {
    this.mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (!(node instanceof HTMLElement)) {
            return;
          }

          if (node.classList.contains('scroll-reveal')) {
            this.observeElement(node);
          }

          node.querySelectorAll<HTMLElement>('.scroll-reveal').forEach(el => this.observeElement(el));
        });
      });
    });

    this.mutationObserver.observe(this.document.body, {
      childList: true,
      subtree: true
    });
  }

  private observeElement(element: HTMLElement) {
    if (!this.observer || element.dataset['revealReady'] === 'true') {
      return;
    }

    element.dataset['revealReady'] = 'true';

    const delay = element.getAttribute('data-reveal-delay');
    if (delay) {
      element.style.setProperty('--reveal-delay', delay);
    }

    const origin = element.getAttribute('data-reveal-origin');
    if (origin === 'left') {
      element.classList.add('reveal-from-left');
    } else if (origin === 'right') {
      element.classList.add('reveal-from-right');
    } else if (origin === 'bottom') {
      element.classList.add('reveal-from-bottom');
    }

    this.observer.observe(element);
  }

  private handleIntersect(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        this.observer?.unobserve(entry.target);
      }
    });
  }
}

