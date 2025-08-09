import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface Product{
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private url = 'https://fakestoreapi.com/products';
  private http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get(this.url).pipe(map((res) => this.productsMapper(res)))
  }

  productsMapper(data: any): Product[] {
    return data.map((item: any) => {
      return {
        id: item.id,
        title: item.title,
        price: item.price,
        description: item.description,
        image: item.image ?? '',
        category: item.category ?? 'Uncategorized',
        stock: item.stock ?? 0,
      }
    })
  }
}
