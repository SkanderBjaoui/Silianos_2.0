import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ServicesPageComponent } from './pages/services-page/services-page.component';
import { BookingComponent } from './pages/booking/booking.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { TestimonialsComponent } from './pages/testimonials/testimonials.component';
import { BlogComponent } from './pages/blog/blog.component';
import { ServiceDetailComponent } from './pages/service-detail/service-detail.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { TermsComponent } from './pages/terms/terms.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminOverviewComponent } from './admin/admin-overview/admin-overview.component';
import { AdminBookingsComponent } from './admin/admin-bookings/admin-bookings.component';
import { AdminServicesComponent } from './admin/admin-services/admin-services.component';
import { AdminPricingComponent } from './admin/admin-pricing/admin-pricing.component';
import { AdminTestimonialsComponent } from './admin/admin-testimonials/admin-testimonials.component';
import { AdminMessagesComponent } from './admin/admin-messages/admin-messages.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'services', component: ServicesPageComponent },
  { path: 'services/:id', component: ServiceDetailComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'testimonials', component: TestimonialsComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    children: [
      { path: '', component: AdminOverviewComponent },
      { path: 'bookings', component: AdminBookingsComponent },
      { path: 'services', component: AdminServicesComponent },
      { path: 'pricing', component: AdminPricingComponent },
      { path: 'testimonials', component: AdminTestimonialsComponent },
      { path: 'messages', component: AdminMessagesComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];

