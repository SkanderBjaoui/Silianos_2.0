import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.css'
})
export class PrivacyComponent implements OnInit, AfterViewInit {
  currentDate = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

  ngOnInit() {
    // Scroll to top immediately
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  ngAfterViewInit() {
    // Ensure scroll to top after view is initialized
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

