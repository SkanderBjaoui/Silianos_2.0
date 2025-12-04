import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Booking {
  id: string;
  userId?: string;
  serviceId?: string;
  customerName: string;
  email: string;
  phone: string;
  serviceType: string;
  destination?: string;
  departureDate: string;
  returnDate?: string;
  numberOfTravelers: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  notes?: string;
  paymentStatus?: 'pending' | 'approved' | 'paid' | 'failed';
  totalAmount?: number;
  currency?: string;
  pricingPackageId?: string;
  packageCurrency?: string;
  priceSnapshot?: number;
}

export interface Testimonial {
  id: string;
  customerName: string;
  customerImage?: string;
  rating: number;
  comment: string;
  service: string;
  date: string;
  verified: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  image: string;
  category: string;
  description?: string;
  date: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  about?: string;
  image?: string;
  price: number;
  currency: string;
  country?: string;
  startDate?: string;
  endDate?: string;
  durationDays?: number;
  status: 'active' | 'inactive';
  benefits?: string[];
  features?: string[];
}

export interface PricingPackage {
  id: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  period?: string;
  startDate?: string;
  endDate?: string;
  image?: string;
  badge?: string;
  features?: string[];
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

    private bookings: Booking[] = [
    {
      id: '1',
      userId: '1',
      customerName: 'Ahmed Ben Ali',
      email: 'ahmed@example.com',
      phone: '+216 98 123 456',
      serviceType: 'Omra',
      destination: 'Makkah',
      departureDate: '2025-03-15',
      returnDate: '2025-03-25',
      numberOfTravelers: 2,
      status: 'confirmed',
      createdAt: '2025-01-10T10:00:00',
      notes: 'Préférence pour hôtel proche de la mosquée',
      paymentStatus: 'approved',
      totalAmount: 2500
    },
    {
      id: '2',
      customerName: 'Fatma Trabelsi',
      email: 'fatma@example.com',
      phone: '+216 92 456 789',
      serviceType: 'Visa EAU',
      destination: 'Dubai',
      departureDate: '2025-02-20',
      numberOfTravelers: 1,
      status: 'pending',
      createdAt: '2025-01-12T14:30:00'
    },
    {
      id: '3',
      customerName: 'Mohamed Khelifi',
      email: 'mohamed@example.com',
      phone: '+216 95 789 012',
      serviceType: 'Circuit Sud',
      destination: 'Tozeur',
      departureDate: '2025-04-10',
      returnDate: '2025-04-13',
      numberOfTravelers: 4,
      status: 'confirmed',
      createdAt: '2025-01-08T09:15:00'
    }
  ];

  private testimonials: Testimonial[] = [
    {
      id: '1',
      customerName: 'Ahmed Ben Ali',
      rating: 5,
      comment: 'Service exceptionnel pour notre Omra. Tout était parfaitement organisé, de l\'aéroport jusqu\'au retour. L\'équipe était très professionnelle et disponible.',
      service: 'Omra & Hajj',
      date: '2024-12-15',
      verified: true
    },
    {
      id: '2',
      customerName: 'Fatma Trabelsi',
      rating: 5,
      comment: 'J\'ai obtenu mon visa pour les EAU très rapidement. Le processus était simple et l\'assistance était excellente. Je recommande vivement!',
      service: 'Visa EAU',
      date: '2024-11-20',
      verified: true
    },
    {
      id: '3',
      customerName: 'Mohamed Khelifi',
      rating: 5,
      comment: 'Circuit dans le sud tunisien inoubliable! Le guide était très compétent et les hôtels étaient de qualité. Une expérience à refaire.',
      service: 'Circuit Sud',
      date: '2024-10-05',
      verified: true
    },
    {
      id: '4',
      customerName: 'Salma Amri',
      rating: 5,
      comment: 'Voyage sur mesure parfaitement adapté à nos besoins. L\'équipe a pris le temps de comprendre nos attentes et a créé un itinéraire de rêve.',
      service: 'Voyages sur Mesure',
      date: '2024-09-18',
      verified: true
    }
  ];

  private blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Guide Complet pour l\'Omra 2025',
      excerpt: 'Tout ce que vous devez savoir pour préparer votre Omra en toute sérénité.',
      content: 'L\'Omra est un pèlerinage à la Mecque qui peut être effectué à tout moment de l\'année...',
      image: 'https://images.pexels.com/photos/26436662/pexels-photo-26436662.jpeg?auto=compress&cs=tinysrgb&w=800&q=80',
      author: 'Silianos Voyage',
      date: '2025-01-15',
      category: 'Omra & Hajj',
      tags: ['Omra', 'Makkah', 'Guide']
    },
    {
      id: '2',
      title: 'Top 10 Destinations à Visiter en 2025',
      excerpt: 'Découvrez les destinations les plus prisées pour cette année.',
      content: 'L\'année 2025 s\'annonce riche en découvertes...',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
      author: 'Silianos Voyage',
      date: '2025-01-10',
      category: 'Voyages',
      tags: ['Destinations', 'Voyage', '2025']
    },
    {
      id: '3',
      title: 'Comment Obtenir un Visa pour les EAU',
      excerpt: 'Processus simplifié et conseils pratiques pour votre visa Emirates.',
      content: 'Les Émirats Arabes Unis sont une destination de choix...',
      image: 'https://images.pexels.com/photos/618079/pexels-photo-618079.jpeg?auto=compress&cs=tinysrgb&w=800&q=80',
      author: 'Silianos Voyage',
      date: '2025-01-05',
      category: 'Visas',
      tags: ['Visa', 'EAU', 'Dubai']
    }
  ];

  private contactMessages: ContactMessage[] = [
    {
      id: '1',
      name: 'Karim Ben Salah',
      email: 'karim@example.com',
      phone: '+216 98 111 222',
      subject: 'Demande de devis Omra',
      message: 'Bonjour, je souhaite obtenir un devis pour une Omra en mars 2025 pour 2 personnes.',
      status: 'new',
      createdAt: '2025-01-14T10:00:00'
    },
    {
      id: '2',
      name: 'Aicha Mansouri',
      email: 'aicha@example.com',
      phone: '+216 92 333 444',
      subject: 'Question sur visa Qatar',
      message: 'Combien de temps faut-il pour obtenir un visa Qatar?',
      status: 'read',
      createdAt: '2025-01-13T15:30:00'
    }
  ];

  private galleryImages: GalleryImage[] = [
    {
      id: '1',
      title: 'Makkah - Grande Mosquée',
      image: 'https://images.pexels.com/photos/26436662/pexels-photo-26436662.jpeg?auto=compress&cs=tinysrgb&w=800&q=80',
      category: 'Omra & Hajj',
      description: 'Vue magnifique de la Grande Mosquée',
      date: '2024-12-01'
    },
    {
      id: '2',
      title: 'Dubai - Burj Khalifa',
      image: 'https://images.pexels.com/photos/618079/pexels-photo-618079.jpeg?auto=compress&cs=tinysrgb&w=800&q=80',
      category: 'Destinations',
      description: 'Le plus haut bâtiment du monde',
      date: '2024-11-15'
    },
    {
      id: '3',
      title: 'Tozeur - Oasis',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      category: 'Circuits Sud',
      description: 'Oasis verdoyante de Tozeur',
      date: '2024-10-20'
    },
    {
      id: '4',
      title: 'Médine - Mosquée du Prophète',
      image: 'https://images.pexels.com/photos/26436662/pexels-photo-26436662.jpeg?auto=compress&cs=tinysrgb&w=800&q=80',
      category: 'Omra & Hajj',
      description: 'Mosquée sacrée de Médine',
      date: '2024-12-05'
    },
    {
      id: '5',
      title: 'Doha - Skyline',
      image: 'https://images.pexels.com/photos/3069345/pexels-photo-3069345.jpeg?auto=compress&cs=tinysrgb&w=800&q=80',
      category: 'Destinations',
      description: 'Vue panoramique de Doha',
      date: '2024-11-10'
    },
    {
      id: '6',
      title: 'Matmata - Maisons Troglodytes',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      category: 'Circuits Sud',
      description: 'Habitations traditionnelles de Matmata',
      date: '2024-10-15'
    }
  ];

    private mapBooking(dbBooking: any): Booking {
    return {
      id: dbBooking.id.toString(),
      userId: dbBooking.user_id?.toString(),
      serviceId: dbBooking.service_id?.toString(),
      customerName: dbBooking.customer_name,
      email: dbBooking.email,
      phone: dbBooking.phone,
      serviceType: dbBooking.service_type,
      destination: dbBooking.destination,
      departureDate: dbBooking.departure_date,
      returnDate: dbBooking.return_date,
      numberOfTravelers: dbBooking.number_of_travelers,
      status: dbBooking.status,
      createdAt: dbBooking.created_at,
      notes: dbBooking.notes,
      paymentStatus: dbBooking.payment_status,
      totalAmount: dbBooking.total_amount !== null && dbBooking.total_amount !== undefined
        ? Number(dbBooking.total_amount)
        : undefined,
      currency: dbBooking.currency,
      pricingPackageId: dbBooking.pricing_package_id?.toString(),
      packageCurrency: dbBooking.package_currency,
      priceSnapshot: dbBooking.price_snapshot
    };
  }

  getBookings(userId?: string): Observable<Booking[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bookings`).pipe(
      map(bookings => {
        const mapped = bookings.map(b => this.mapBooking(b));
        if (userId) {
          return mapped.filter(b => b.userId === userId);
        }
        return mapped;
      })
    );
  }

  getBooking(id: string): Observable<Booking> {
    return this.http.get<any>(`${this.apiUrl}/bookings/${id}`).pipe(
      map(dbBooking => this.mapBooking(dbBooking))
    );
  }

  addBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'status'>): Observable<Booking> {
    const dbFormat = {
      user_id: booking.userId,
      service_id: booking.serviceId,
      customer_name: booking.customerName,
      email: booking.email,
      phone: booking.phone,
      service_type: booking.serviceType,
      destination: booking.destination,
      departure_date: booking.departureDate,
      return_date: booking.returnDate,
      number_of_travelers: booking.numberOfTravelers,
      notes: booking.notes,
      total_amount: booking.totalAmount,
      currency: booking.currency,
      pricing_package_id: booking.pricingPackageId,
      package_currency: booking.packageCurrency,
      price_snapshot: booking.priceSnapshot
    };
    
    return this.http.post<{id: number, message: string}>(`${this.apiUrl}/bookings`, dbFormat).pipe(
      map(response => ({
        ...booking,
        id: response.id.toString(),
        status: 'pending' as const,
        createdAt: new Date().toISOString()
      }))
    );
  }

  updateBookingStatus(id: string, status: Booking['status']): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/bookings/${id}/status`, { status });
  }

  updateBookingPaymentStatus(id: string, paymentStatus: Booking['paymentStatus']): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/bookings/${id}/payment`, { payment_status: paymentStatus });
  }

  deleteBooking(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/bookings/${id}`);
  }

  private mapTestimonial(db: any): Testimonial {
    return {
      id: db.id.toString(),
      customerName: db.customer_name,
      customerImage: db.customer_image,
      rating: db.rating,
      comment: db.comment,
      service: db.service,
      date: db.date,
      verified: db.verified === 1 || db.verified === true
    };
  }

    getTestimonials(): Observable<Testimonial[]> {
    return this.http.get<any[]>(`${this.apiUrl}/testimonials`).pipe(
      map(testimonials => testimonials.map(t => this.mapTestimonial(t)))
    );
  }

  addTestimonial(testimonial: Omit<Testimonial, 'id' | 'date' | 'verified'>): Observable<Testimonial> {
    const dbFormat = {
      customer_name: testimonial.customerName,
      customer_image: testimonial.customerImage,
      rating: testimonial.rating,
      comment: testimonial.comment,
      service: testimonial.service
    };
    
    return this.http.post<{id: number, message: string}>(`${this.apiUrl}/testimonials`, dbFormat).pipe(
      map(response => ({
        ...testimonial,
        id: response.id.toString(),
        date: new Date().toISOString().split('T')[0],
        verified: false
      }))
    );
  }

  deleteTestimonial(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/testimonials/${id}`);
  }

  private mapBlogPost(db: any): BlogPost {
    return {
      id: db.id.toString(),
      title: db.title,
      excerpt: db.excerpt || '',
      content: db.content,
      image: db.image || '',
      author: db.author,
      date: db.date,
      category: db.category,
      tags: typeof db.tags === 'string' ? JSON.parse(db.tags) : (db.tags || [])
    };
  }

  getBlogPosts(): Observable<BlogPost[]> {
    return this.http.get<any[]>(`${this.apiUrl}/blog`).pipe(
      map(posts => posts.map(p => this.mapBlogPost(p)))
    );
  }

  getBlogPost(id: string): Observable<BlogPost> {
    return this.http.get<any>(`${this.apiUrl}/blog/${id}`).pipe(
      map(post => this.mapBlogPost(post))
    );
  }

  addBlogPost(post: Omit<BlogPost, 'id'>): Observable<BlogPost> {
    const dbFormat = {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      author: post.author,
      date: post.date,
      category: post.category,
      tags: post.tags
    };
    
    return this.http.post<{id: number, message: string}>(`${this.apiUrl}/blog`, dbFormat).pipe(
      map(response => ({
        ...post,
        id: response.id.toString()
      }))
    );
  }

  updateBlogPost(updatedPost: BlogPost): Observable<void> {
    const dbFormat = {
      title: updatedPost.title,
      excerpt: updatedPost.excerpt,
      content: updatedPost.content,
      image: updatedPost.image,
      author: updatedPost.author,
      date: updatedPost.date,
      category: updatedPost.category,
      tags: updatedPost.tags
    };
    
    return this.http.put<void>(`${this.apiUrl}/blog/${updatedPost.id}`, dbFormat);
  }

  deleteBlogPost(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/blog/${id}`);
  }

  private mapContactMessage(db: any): ContactMessage {
    return {
      id: db.id.toString(),
      name: db.name,
      email: db.email,
      phone: db.phone,
      subject: db.subject,
      message: db.message,
      status: db.status,
      createdAt: db.created_at
    };
  }

  getContactMessages(): Observable<ContactMessage[]> {
    return this.http.get<any[]>(`${this.apiUrl}/messages`).pipe(
      map(messages => messages.map(m => this.mapContactMessage(m)))
    );
  }

  addContactMessage(message: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): Observable<ContactMessage> {
    return this.http.post<{id: number, message: string}>(`${this.apiUrl}/messages`, message).pipe(
      map(response => ({
        ...message,
        id: response.id.toString(),
        status: 'new' as const,
        createdAt: new Date().toISOString()
      }))
    );
  }

  updateMessageStatus(id: string, status: ContactMessage['status']): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/messages/${id}/status`, { status });
  }

  deleteMessage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/messages/${id}`);
  }

  private mapGalleryImage(db: any): GalleryImage {
    return {
      id: db.id.toString(),
      title: db.title,
      image: db.image,
      category: db.category,
      description: db.description,
      date: db.date
    };
  }

  getGalleryImages(category?: string): Observable<GalleryImage[]> {
    const url = (category && category !== 'all') 
      ? `${this.apiUrl}/gallery/category/${category}`
      : `${this.apiUrl}/gallery`;
    
    return this.http.get<any[]>(url).pipe(
      map(images => images.map(img => this.mapGalleryImage(img)))
    );
  }

  getGalleryCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/gallery/categories`);
  }

  addGalleryImage(image: { title: string; image: string; category: string; description?: string | null; date: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/gallery`, image);
  }

  updateGalleryImage(id: string, image: { title: string; image: string; category: string; description?: string | null; date: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/gallery/${id}`, image);
  }

  deleteGalleryImage(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/gallery/${id}`);
  }

  verifyTestimonial(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/testimonials/${id}/verify`, {});
  }

  getServices(): Observable<Service[]> {
    return this.http.get<any[]>(`${this.apiUrl}/services`).pipe(
      map(services => services.map(s => ({
        id: s.id.toString(),
        title: s.title,
        description: s.description,
        about: s.about,
        image: s.image,
        price: Number(s.price ?? 0),
        currency: s.currency || 'TND',
        country: s.country || undefined,
        startDate: s.start_date || undefined,
        endDate: s.end_date || undefined,
        durationDays: s.duration_days ?? undefined,
        status: s.status,
        benefits: typeof s.benefits === 'string' ? JSON.parse(s.benefits) : (s.benefits || []),
        features: typeof s.features === 'string' ? JSON.parse(s.features) : (s.features || [])
      })))
    );
  }

  getService(id: string): Observable<Service> {
    return this.http.get<any>(`${this.apiUrl}/services/${id}`).pipe(
      map(s => ({
        id: s.id.toString(),
        title: s.title,
        description: s.description,
        about: s.about,
        image: s.image,
        price: Number(s.price ?? 0),
        currency: s.currency || 'TND',
        country: s.country || undefined,
        startDate: s.start_date || undefined,
        endDate: s.end_date || undefined,
        durationDays: s.duration_days ?? undefined,
        status: s.status,
        benefits: typeof s.benefits === 'string' ? JSON.parse(s.benefits) : (s.benefits || []),
        features: typeof s.features === 'string' ? JSON.parse(s.features) : (s.features || [])
      }))
    );
  }

  addService(service: Omit<Service, 'id'>): Observable<Service> {
    return this.http.post<{id: number, message: string}>(`${this.apiUrl}/services`, {
      title: service.title,
      description: service.description,
      about: service.about,
      image: service.image,
      price: service.price,
      currency: service.currency,
      country: service.country,
      start_date: service.startDate,
      end_date: service.endDate,
      duration_days: service.durationDays,
      status: service.status,
      // Some backends expect JSON strings for arrays - stringify to be safe
      benefits: service.benefits ? JSON.stringify(service.benefits) : undefined,
      features: service.features ? JSON.stringify(service.features) : undefined
    }).pipe(
      map(response => ({
        ...service,
        id: response.id.toString()
      }))
    );
  }

  updateService(service: Service): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/services/${service.id}`, {
      title: service.title,
      description: service.description,
      about: service.about,
      image: service.image,
      price: service.price,
      currency: service.currency,
      country: service.country,
      start_date: service.startDate,
      end_date: service.endDate,
      duration_days: service.durationDays,
      status: service.status,
      benefits: service.benefits ? JSON.stringify(service.benefits) : undefined,
      features: service.features ? JSON.stringify(service.features) : undefined
    });
  }

  deleteService(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/services/${id}`);
  }

  getPricingPackages(): Observable<PricingPackage[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pricing`).pipe(
      map(packages => packages.map(p => ({
        id: p.id.toString(),
        title: p.title,
        description: p.description,
        price: parseFloat(p.price),
        currency: p.currency,
        period: p.period,
        startDate: p.start_date || undefined,
        endDate: p.end_date || undefined,
        image: p.image,
        badge: p.badge,
        features: typeof p.features === 'string' ? JSON.parse(p.features) : (p.features || []),
        isActive: p.is_active === 1 || p.is_active === true
      })))
    );
  }

  getPricingPackage(id: string): Observable<PricingPackage> {
    return this.http.get<any>(`${this.apiUrl}/pricing/${id}`).pipe(
      map(p => ({
        id: p.id.toString(),
        title: p.title,
        description: p.description,
        price: parseFloat(p.price),
        currency: p.currency,
        period: p.period,
        startDate: p.start_date || undefined,
        endDate: p.end_date || undefined,
        image: p.image,
        badge: p.badge,
        features: typeof p.features === 'string' ? JSON.parse(p.features) : (p.features || []),
        isActive: p.is_active === 1 || p.is_active === true
      }))
    );
  }

  addPricingPackage(pkg: Omit<PricingPackage, 'id'>): Observable<PricingPackage> {
    return this.http.post<{id: number, message: string}>(`${this.apiUrl}/pricing`, {
      title: pkg.title,
      description: pkg.description,
      price: pkg.price,
      currency: pkg.currency,
      period: pkg.period,
      start_date: pkg.startDate,
      end_date: pkg.endDate,
      image: pkg.image,
      badge: pkg.badge,
      features: pkg.features,
      is_active: pkg.isActive
    }).pipe(
      map(response => ({
        ...pkg,
        id: response.id.toString()
      }))
    );
  }

  updatePricingPackage(pkg: PricingPackage): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/pricing/${pkg.id}`, {
      title: pkg.title,
      description: pkg.description,
      price: pkg.price,
      currency: pkg.currency,
      period: pkg.period,
      start_date: pkg.startDate,
      end_date: pkg.endDate,
      image: pkg.image,
      badge: pkg.badge,
      features: pkg.features,
      is_active: pkg.isActive
    });
  }

  deletePricingPackage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/pricing/${id}`);
  }
}

