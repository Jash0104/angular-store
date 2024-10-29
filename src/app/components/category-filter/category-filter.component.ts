import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-category-filter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-4">
      <div class="flex flex-wrap gap-2">
        <button
          (click)="selectCategory('')"
          class="px-4 py-2 rounded"
          [class.bg-blue-500]="selectedCategory === ''"
          [class.text-white]="selectedCategory === ''"
          [class.bg-gray-200]="selectedCategory !== ''">
          All
        </button>
        <button
          *ngFor="let category of categories"
          (click)="selectCategory(category)"
          class="px-4 py-2 rounded"
          [class.bg-blue-500]="selectedCategory === category"
          [class.text-white]="selectedCategory === category"
          [class.bg-gray-200]="selectedCategory !== category">
          {{ category | titlecase }}
        </button>
      </div>
    </div>
  `
})
export class CategoryFilterComponent implements OnInit {
  @Output() categorySelected = new EventEmitter<string>();
  categories: string[] = [];
  selectedCategory = '';

  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.storeService.getCategories().subscribe(
      categories => this.categories = categories
    );
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.categorySelected.emit(category);
  }
}