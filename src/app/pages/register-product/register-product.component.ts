import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductsService } from 'src/app/services/products.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from '@angular/forms';

@Component({
  selector: 'app-register-product',
  templateUrl: './register-product.component.html',
  styleUrls: ['./register-product.component.scss'],
})
export class RegisterProductComponent implements OnInit, OnDestroy {
  private subscriber: Subscription = new Subscription();

  productForm: UntypedFormGroup | undefined;

  constructor(
    private productService: ProductsService,
    private formBuilder: UntypedFormBuilder
  ) {}

  ngOnInit(): void {}

  loadForm(): void {
    this.productForm = this.formBuilder.group({
      id: ['', Validators.required],
      name: [''],
      description: ['', Validators.required],
      logo: ['', Validators.required],
      date_release: [new Date()],
      date_revision: ['', Validators.required],
    });
  }

  /**
   * verify product by id
   * @param id
   */
  verifyProductExistence(id: number): void {
    this.subscriber = this.productService.verifyExistence(id).subscribe(
      (res) => {
        console.log(res);
      },
      ({ error }) => {
        console.log(error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscriber) this.subscriber.unsubscribe();
  }
}
