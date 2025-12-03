import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Image as ImageIcon } from 'lucide-angular';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { DataService, GalleryImage } from '../../services/data.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, NavbarComponent, FooterComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit {
  imageIcon = ImageIcon;
  images: GalleryImage[] = [];
  categories: string[] = [];
  selectedCategory: string = 'all';
  selectedImage: GalleryImage | null = null;
  showModal = false;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getGalleryImages().subscribe(images => {
      this.images = images;
    });
    
    this.dataService.getGalleryCategories().subscribe(categories => {
      this.categories = ['all', ...categories];
    });
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.dataService.getGalleryImages(category).subscribe(images => {
      this.images = images;
    });
  }

  openImage(image: GalleryImage) {
    this.selectedImage = image;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedImage = null;
  }
}

