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
    'https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp';

  constructor(private httpClient: HttpClient) {}

  /**
   * @returns products
   */
  getProductList(): Observable<Product[]> {
    return this.httpClient
      .get(`${this.baseUrl}/products`)
      .pipe(map((res) => res as Product[]));
  }
}
