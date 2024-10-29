import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { CartItem } from '../../models/product.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4">Shopping Cart</h2>
      
      <div *ngIf="cartItems.length === 0" class="text-center py-8">
        <p class="text-gray-600 mb-4">Your cart is empty</p>
        <a [routerLink]="['/']" class="text-blue-500 hover:text-blue-700">
          Continue Shopping
        </a>
      </div>

      <div *ngFor="let item of cartItems" class="flex items-center gap-4 border-b py-4">
        <img [src]="item.product.image" [alt]="item.product.title" class="w-24 h-24 object-contain">
        
        <div class="flex-grow">
          <h3 class="font-semibold">{{ item.product.title }}</h3>
          <p class="text-gray-600">{{ item.product.price | number:'1.2-2' }}</p>
        </div>

        <div class="flex items-center gap-2">
          <button 
            (click)="updateQuantity(item, item.quantity - 1)"
            class="px-2 py-1 border rounded hover:bg-gray-100"
            [disabled]="item.quantity <= 1"
            [class.opacity-50]="item.quantity <= 1">
            -
          </button>
          <span class="w-8 text-center">{{ item.quantity }}</span>
          <button 
            (click)="updateQuantity(item, item.quantity + 1)"
            class="px-2 py-1 border rounded hover:bg-gray-100">
            +
          </button>
        </div>

        <div class="text-right min-w-[100px]">
          <p class="font-semibold">{{ item.product.price * item.quantity | number:'1.2-2' }}</p>
        </div>

        <button 
          (click)="removeFromCart(item.product.id)"
          class="text-red-500 hover:text-red-700 ml-4">
          <span class="sr-only">Remove</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <div *ngIf="cartItems.length > 0" class="mt-8">
        <div class="flex justify-between items-center border-t pt-4">
          <span class="text-lg">Subtotal:</span>
          <span class="text-xl font-bold">{{ getTotal() | number:'1.2-2' }}</span>
        </div>
        
        <div class="mt-8 flex justify-end gap-4">
          <a [routerLink]="['/']" class="text-blue-500 hover:text-blue-700">
            Continue Shopping
          </a>
          <button 
            class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  `
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.storeService.getCart().subscribe(
      items => this.cartItems = items
    );
  }

  removeFromCart(productId: number): void {
    this.storeService.removeFromCart(productId);
  }

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity > 0) {
      this.storeService.updateQuantity(item.product.id, quantity);
    }
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0);
  }
}