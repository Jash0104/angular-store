import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, provideRouter } from '@angular/router';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { ProductListComponent } from './app/components/product-list/product-list.component';
import { ProductDetailComponent } from './app/components/product-detail/product-detail.component';
import { CartComponent } from './app/components/cart/cart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-white shadow mb-4">
        <div class="container mx-auto px-4">
          <div class="flex justify-between items-center h-16">
            <a routerLink="/" class="text-xl font-bold">FakeStore</a>
            <a routerLink="/cart" class="text-blue-500 hover:text-blue-700">Cart</a>
          </div>
        </div>
      </nav>

      <router-outlet></router-outlet>
    </div>
  `
})
export class App {
  name = 'FakeStore';
}

const routes = [
  { path: '', component: ProductListComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
];

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
  ]
});