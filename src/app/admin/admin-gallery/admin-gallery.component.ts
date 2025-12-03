import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Image as ImageIcon, PlusCircle, Edit, Trash2 } from 'lucide-angular';
import { DataService, GalleryImage } from '../../services/data.service';
import { ConfirmService } from '../../shared/confirm.service';

interface GalleryForm {
  title: string;
  image: string;
  category: string;
  description: string;
  date: string;
}

@Component({
  selector: 'app-admin-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './admin-gallery.component.html',
  styleUrl: './admin-gallery.component.css'
})
export class AdminGalleryComponent implements OnInit {
  images: GalleryImage[] = [];
  editedImage: GalleryImage | null = null;
  isCreateMode = false;
  imageIcon = ImageIcon;
  addIcon = PlusCircle;
  editIcon = Edit;
  deleteIcon = Trash2;

  editForm: GalleryForm = this.getEmptyForm();
  categories: string[] = [];
  filterQuery: string = '';

  get filteredImages(): GalleryImage[] {
    const q = this.filterQuery.trim().toLowerCase();
    if (!q) return this.images;
    return this.images.filter(i => (i.title || '').toLowerCase().includes(q) || (i.category || '').toLowerCase().includes(q) || (i.description || '').toLowerCase().includes(q));
  }

  constructor(private dataService: DataService, private confirmService: ConfirmService) {}

  ngOnInit(): void {
    this.loadImages();
    this.loadCategories();
  }

  loadImages() {
    this.dataService.getGalleryImages().subscribe(images => {
      this.images = images;
    });
  }

  loadCategories() {
    this.dataService.getGalleryCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  openCreateModal() {
    this.isCreateMode = true;
    this.editedImage = null;
    this.editForm = this.getEmptyForm();
  }

  openEditModal(image: GalleryImage) {
    this.isCreateMode = false;
    this.editedImage = image;
    this.editForm = {
      title: image.title,
      image: image.image,
      category: image.category,
      description: image.description || '',
      date: image.date
    };
  }

  closeModal() {
    this.editedImage = null;
    this.isCreateMode = false;
    this.editForm = this.getEmptyForm();
  }

  saveImage() {
    if (!this.editForm.title.trim() || !this.editForm.image.trim() || !this.editForm.category.trim()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const payload = {
      title: this.editForm.title.trim(),
      image: this.editForm.image.trim(),
      category: this.editForm.category.trim(),
      description: this.editForm.description.trim() || null,
      date: this.editForm.date || new Date().toISOString().split('T')[0]
    };

    if (this.isCreateMode) {
      this.dataService.addGalleryImage(payload).subscribe({
        next: () => {
          this.loadImages();
          this.loadCategories(); // Reload categories in case a new one was added
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout de l\'image :', err);
          alert('Erreur lors de la création de l\'image');
        }
      });
    } else if (this.editedImage) {
      this.dataService.updateGalleryImage(this.editedImage.id, payload).subscribe({
        next: () => {
          this.loadImages();
          this.loadCategories();
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de l\'image :', err);
          alert('Erreur lors de la mise à jour de l\'image');
        }
      });
    }
  }

  async deleteImage(image: GalleryImage) {
    const ok = await this.confirmService.confirm(`Êtes-vous sûr de vouloir supprimer "${image.title}" ?`);
    if (!ok) return;

    this.dataService.deleteGalleryImage(image.id).subscribe({
      next: () => {
        this.loadImages();
        this.loadCategories();
      },
      error: (err) => {
        console.error('Erreur lors de la suppression de l\'image :', err);
        alert('Erreur lors de la suppression de l\'image');
      }
    });
  }

  private getEmptyForm(): GalleryForm {
    return {
      title: '',
      image: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    };
  }
}

