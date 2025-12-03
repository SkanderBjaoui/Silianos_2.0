import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ScrollRevealService } from './shared/scroll-reveal.service';
import { ScrollToTopComponent } from './components/scroll-to-top/scroll-to-top.component';
import { ConfirmModalComponent } from './shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ScrollToTopComponent,
    ConfirmModalComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title = 'Silianos-ng';

  constructor(private scrollReveal: ScrollRevealService) {}

  ngAfterViewInit() {
    this.scrollReveal.init();
  }
}
