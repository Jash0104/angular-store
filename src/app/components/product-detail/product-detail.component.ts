import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error }}
      </div>

      <div *ngIf="product" class="bg-white rounded-lg shadow-lg p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="flex items-center justify-center">
            <img [src]="product.image" [alt]="product.title" class="max-w-full h-auto max-h-96 object-contain">
          </div>
          
          <div>
            <h1 class="text-2xl font-bold mb-4">{{ product.title }}</h1>
            <p class="text-gray-600 mb-4">{{ product.description }}</p>
            
            <div class="mb-4">
              <span class="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                {{ product.category }}
              </span>
            </div>
            
            <div class="flex items-center mb-4">
              <div class="flex items-center">
                <span class="text-yellow-400">★</span>
                <span class="ml-1">{{ product.rating.rate }} ({{ product.rating.count }} reviews)</span>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-3xl font-bold">{{ product.price }}</span>
              <button 
                (click)="addToCart(product)"
                class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <a routerLink="/" class="text-blue-500 hover:text-blue-700">← Back to Products</a>
      </div>
    </div>
  `,
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(Number(id));
    }
  }

  loadProduct(id: number): void {
    this.storeService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
        this.error = null;
      },
      error: (error) => {
        this.error = 'Error loading product. Please try again later.';
        console.error('Error loading product:', error);
      },
    });
  }

  addToCart(product: Product): void {
    this.storeService.addToCart(product);
  }
}
