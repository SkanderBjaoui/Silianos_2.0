import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmService } from '../confirm.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="visible" class="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60" (click)="cancel()"></div>
      <div class="relative bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl max-w-md w-full p-6 z-50">
        <h3 class="text-lg font-semibold text-white mb-2">{{ title || 'Confirmer' }}</h3>
        <p class="text-slate-300 mb-6">{{ message }}</p>
        <div class="flex justify-end gap-3">
          <button (click)="cancel()" class="px-4 py-2 rounded-xl border border-slate-700 text-slate-300">Annuler</button>
          <button (click)="onConfirm()" class="px-4 py-2 rounded-xl bg-rose-600 text-white">Supprimer</button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmModalComponent implements OnDestroy {
  visible = false;
  message = '';
  title?: string;
  private sub: Subscription | null = null;
  private resolver: ((value: boolean) => void) | null = null;

  constructor(private confirmService: ConfirmService) {
    this.sub = this.confirmService.requests$.subscribe(req => {
      this.message = req.message;
      this.title = req.title;
      this.resolver = req.resolve;
      this.visible = true;
    });
  }

  onConfirm() {
    if (this.resolver) this.resolver(true);
    this.cleanup();
  }

  cancel() {
    if (this.resolver) this.resolver(false);
    this.cleanup();
  }

  private cleanup() {
    this.visible = false;
    this.message = '';
    this.title = undefined;
    this.resolver = null;
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
