import { Injectable } from '@angular/core';

export interface Booking {
  id: string;
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

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private bookings: Booking[] = [
    {
      id: '1',
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
      notes: 'Préférence pour hôtel proche de la mosquée'
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

  // Bookings
  getBookings(): Booking[] {
    return [...this.bookings];
  }

  getBooking(id: string): Booking | undefined {
    return this.bookings.find(b => b.id === id);
  }

  addBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'status'>): Booking {
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    this.bookings.push(newBooking);
    return newBooking;
  }

  updateBookingStatus(id: string, status: Booking['status']): void {
    const booking = this.bookings.find(b => b.id === id);
    if (booking) {
      booking.status = status;
    }
  }

  deleteBooking(id: string): void {
    this.bookings = this.bookings.filter(b => b.id !== id);
  }

  // Testimonials
  getTestimonials(): Testimonial[] {
    return [...this.testimonials];
  }

  addTestimonial(testimonial: Omit<Testimonial, 'id' | 'date' | 'verified'>): Testimonial {
    const newTestimonial: Testimonial = {
      ...testimonial,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      verified: false
    };
    this.testimonials.push(newTestimonial);
    return newTestimonial;
  }

  deleteTestimonial(id: string): void {
    this.testimonials = this.testimonials.filter(t => t.id !== id);
  }

  // Blog Posts
  getBlogPosts(): BlogPost[] {
    return [...this.blogPosts];
  }

  getBlogPost(id: string): BlogPost | undefined {
    return this.blogPosts.find(p => p.id === id);
  }

  // Contact Messages
  getContactMessages(): ContactMessage[] {
    return [...this.contactMessages];
  }

  addContactMessage(message: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): ContactMessage {
    const newMessage: ContactMessage = {
      ...message,
      id: Date.now().toString(),
      status: 'new',
      createdAt: new Date().toISOString()
    };
    this.contactMessages.push(newMessage);
    return newMessage;
  }

  updateMessageStatus(id: string, status: ContactMessage['status']): void {
    const message = this.contactMessages.find(m => m.id === id);
    if (message) {
      message.status = status;
    }
  }

  deleteMessage(id: string): void {
    this.contactMessages = this.contactMessages.filter(m => m.id !== id);
  }

  // Gallery
  getGalleryImages(category?: string): GalleryImage[] {
    if (category) {
      return this.galleryImages.filter(img => img.category === category);
    }
    return [...this.galleryImages];
  }

  getGalleryCategories(): string[] {
    return [...new Set(this.galleryImages.map(img => img.category))];
  }
}

