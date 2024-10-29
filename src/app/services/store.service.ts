import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { Product, CartItem } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private apiUrl = 'https://fakestoreapi.com';
  private cartItems = new BehaviorSubject<CartItem[]>([]);

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`)
      .pipe(catchError(this.handleError));
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`)
      .pipe(catchError(this.handleError));
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/products/categories`)
      .pipe(catchError(this.handleError));
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/category/${category}`)
      .pipe(catchError(this.handleError));
  }

  getCart(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  addToCart(product: Product): void {
    const currentCart = this.cartItems.value;
    const existingItem = currentCart.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
      this.cartItems.next([...currentCart]);
    } else {
      this.cartItems.next([...currentCart, { product, quantity: 1 }]);
    }
  }

  removeFromCart(productId: number): void {
    const currentCart = this.cartItems.value;
    this.cartItems.next(currentCart.filter(item => item.product.id !== productId));
  }

  updateQuantity(productId: number, quantity: number): void {
    const currentCart = this.cartItems.value;
    const item = currentCart.find(item => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
      this.cartItems.next([...currentCart]);
    }
  }
}