import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductsService } from './products.service';
import { Product } from '../interfaces';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsService],
    });

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve a list of products', () => {
    const mockProducts: Product[] = [];

    service.getProductList().subscribe((products) => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(`${service.baseUrl}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should create a product', () => {
    const mockProduct: Product = {
      id: 'test-demo',
      name: 'test-product',
      description: 'test-description',
      logo: 'test-logo',
      date_release: '2023-09-29',
      date_revision: '2024-09-29',
    };

    service.createProduct(mockProduct).subscribe((createdProduct) => {
      return expect(createdProduct).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${service.baseUrl}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProduct);
    req.flush(mockProduct);
  });

  it('should edit a product', () => {
    const mockProduct: Product = {
      id: 'test-update-demo',
      name: 'test-update-product',
      description: 'test-update-description',
      logo: 'test-update-logo',
      date_release: '2023-09-29',
      date_revision: '2024-09-29',
    };

    service.editProduct(mockProduct).subscribe((updatedProduct) => {
      return expect(updatedProduct).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${service.baseUrl}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockProduct);
    req.flush(mockProduct);
  });

  it('should delete a product', () => {
    const productId = 'test-demo';

    service.deleteProduct(productId).subscribe((response) => {
      expect(response).toBe('success');
    });

    const req = httpMock.expectOne(`${service.baseUrl}?id=${productId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush('success');
  });

  it('should verify product existence', () => {
    const productId = 'test-demo';

    service.verifyExistence(productId).subscribe((exists) => {
      expect(exists).toBe(true);
    });

    const req = httpMock.expectOne(
      `${service.baseUrl}/verification?id=${productId}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });
});
