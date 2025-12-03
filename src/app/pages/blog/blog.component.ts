import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Calendar, User, ArrowRight } from 'lucide-angular';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { DataService, BlogPost } from '../../services/data.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, NavbarComponent, FooterComponent],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent implements OnInit {
  calendarIcon = Calendar;
  userIcon = User;
  arrowRightIcon = ArrowRight;
  posts: BlogPost[] = [];
  selectedCategory: string = 'all';
  categories: string[] = [];
  selectedPost: BlogPost | null = null;
  showModal = false;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getBlogPosts().subscribe(posts => {
      this.posts = posts;
      this.categories = ['all', ...new Set(posts.map(p => p.category))];
    });
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    if (category === 'all') {
      this.dataService.getBlogPosts().subscribe(posts => {
        this.posts = posts;
      });
    } else {
      this.dataService.getBlogPosts().subscribe(posts => {
        this.posts = posts.filter(p => p.category === category);
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  openModal(post: BlogPost, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.selectedPost = post;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedPost = null;
  }
}

