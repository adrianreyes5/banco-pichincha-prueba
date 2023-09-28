import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private baseUrl: string =
    'https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products';

  constructor(private httpClient: HttpClient) {}

  /**
   * @returns products
   */
  getProductList(): Observable<Product[]> {
    return this.httpClient
      .get(`${this.baseUrl}`)
      .pipe(map((res) => res as Product[]));
  }

  /**
   * endpoint to create product
   * @returns created product
   */
  createProduct(data: Product): Observable<Product[]> {
    return this.httpClient
      .post(`${this.baseUrl}`, data)
      .pipe(map((res) => res as Product[]));
  }

  /**
   * @returns products
   */
  verifyExistence(id: number): Observable<boolean> {
    return this.httpClient
      .get(`${this.baseUrl}/verification?id=${id}`)
      .pipe(map((res) => res as boolean));
  }
}
