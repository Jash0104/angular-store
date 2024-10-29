import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { Product } from '../../models/product.model';
import { CategoryFilterComponent } from '../category-filter/category-filter.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, CategoryFilterComponent],
  template: `
    <div class="container mx-auto p-4">
      <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error }}
      </div>

      <app-category-filter (categorySelected)="filterByCategory($event)"></app-category-filter>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <div *ngFor="let product of products" class="border rounded-lg p-4 flex flex-col">
          <a [routerLink]="['/product', product.id]" class="group">
            <img [src]="product.image" [alt]="product.title" class="w-full h-48 object-contain mb-4 group-hover:opacity-90 transition-opacity">
            <h2 class="text-lg font-semibold mb-2 group-hover:text-blue-600">{{ product.title }}</h2>
          </a>
          <p class="text-gray-600 mb-2 flex-grow">{{ product.description | slice:0:100 }}...</p>
          <div class="flex justify-between items-center mt-4">
            <span class="text-xl font-bold">{{ product.price }}</span>
            <button 
              (click)="addToCart(product)"
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  error: string | null = null;

  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.storeService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.error = null;
      },
      error: (error) => {
        this.error = 'Error loading products. Please try again later.';
        console.error('Error loading products:', error);
      }
    });
  }

  filterByCategory(category: string): void {
    if (category) {
      this.storeService.getProductsByCategory(category).subscribe({
        next: (products) => {
          this.products = products;
          this.error = null;
        },
        error: (error) => {
          this.error = 'Error filtering products. Please try again later.';
          console.error('Error filtering products:', error);
        }
      });
    } else {
      this.loadProducts();
    }
  }

  addToCart(product: Product): void {
    this.storeService.addToCart(product);
  }
}