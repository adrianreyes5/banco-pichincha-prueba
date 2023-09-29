import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterProductComponent } from './register-product.component';
import { ProductFormComponent } from 'src/app/components/product-form/product-form.component';
import { ProductsService } from 'src/app/services/products.service';
import { HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('RegisterProductComponent', () => {
  let component: RegisterProductComponent;
  let fixture: ComponentFixture<RegisterProductComponent>;
  let service: ProductsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterProductComponent, ProductFormComponent],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        HttpClient,
        HttpHandler,
        HttpTestingController,
        ProductsService,
      ],
    });
    fixture = TestBed.createComponent(RegisterProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
