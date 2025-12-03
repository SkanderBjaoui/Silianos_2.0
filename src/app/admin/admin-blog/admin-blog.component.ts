import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, FileText, PlusCircle, Edit, Trash2 } from 'lucide-angular';
import { DataService, BlogPost } from '../../services/data.service';
import { ConfirmService } from '../../shared/confirm.service';

interface BlogForm {
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  tags: string;
}

@Component({
  selector: 'app-admin-blog',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './admin-blog.component.html',
  styleUrl: './admin-blog.component.css'
})
export class AdminBlogComponent implements OnInit {
  posts: BlogPost[] = [];
  editedPost: BlogPost | null = null;
  isCreateMode = false;
  fileIcon = FileText;
  addIcon = PlusCircle;
  editIcon = Edit;
  trash2 = Trash2;

  filterQuery: string = '';

  get filteredPosts(): BlogPost[] {
    const q = this.filterQuery.trim().toLowerCase();
    if (!q) return this.posts;
    return this.posts.filter(p => (p.title || '').toLowerCase().includes(q) || (p.author || '').toLowerCase().includes(q) || (p.excerpt || '').toLowerCase().includes(q));
  }

  editForm: BlogForm = this.getEmptyForm();

  constructor(private dataService: DataService, private confirmService: ConfirmService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    this.dataService.getBlogPosts().subscribe(posts => {
      this.posts = posts;
    });
  }

  openCreateModal() {
    this.isCreateMode = true;
    this.editedPost = null;
    this.editForm = this.getEmptyForm();
  }

  openEditModal(post: BlogPost) {
    this.isCreateMode = false;
    this.editedPost = post;
    this.editForm = {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      author: post.author,
      date: post.date,
      category: post.category,
      tags: post.tags.join(', ')
    };
  }

  closeModal() {
    this.editedPost = null;
    this.isCreateMode = false;
    this.editForm = this.getEmptyForm();
  }

  savePost() {
    const payload = {
      title: this.editForm.title.trim(),
      excerpt: this.editForm.excerpt.trim(),
      content: this.editForm.content.trim(),
      image: this.editForm.image.trim() || 'https://via.placeholder.com/600x400',
      author: this.editForm.author.trim() || 'Silianos Voyage',
      date: this.editForm.date || new Date().toISOString().split('T')[0],
      category: this.editForm.category.trim() || 'Général',
      tags: this.parseList(this.editForm.tags)
    };

    if (this.isCreateMode) {
      this.dataService.addBlogPost(payload).subscribe({
        next: () => {
          this.loadPosts();
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur lors de la création de la publication :', err);
          alert('Erreur lors de la création du post');
        }
      });
    } else if (this.editedPost) {
      this.dataService.updateBlogPost({
        ...this.editedPost,
        ...payload
      }).subscribe({
        next: () => {
          this.loadPosts();
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de la publication :', err);
          alert('Erreur lors de la mise à jour du post');
        }
      });
    }
  }

  async deletePost(id: string) {
    const ok = await this.confirmService.confirm('Êtes-vous sûr de vouloir supprimer cet article ?');
    if (!ok) return;
    this.dataService.deleteBlogPost(id).subscribe({
      next: () => this.loadPosts(),
      error: (err) => console.error('Erreur lors de la suppression de la publication :', err)
    });
  }

  private parseList(value: string): string[] {
    return value
      .split(',')
      .map(item => item.trim())
      .filter(item => !!item);
  }

  private getEmptyForm(): BlogForm {
    return {
      title: '',
      excerpt: '',
      content: '',
      image: '',
      author: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
      tags: ''
    };
  }
}






