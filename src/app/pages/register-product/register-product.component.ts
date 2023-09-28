import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductsService } from 'src/app/services/products.service';

import { Router } from '@angular/router';
import { Product } from 'src/app/interfaces';

@Component({
  selector: 'app-register-product',
  templateUrl: './register-product.component.html',
  styleUrls: ['./register-product.component.scss'],
})
export class RegisterProductComponent implements OnInit, OnDestroy {
  private subscriber: Subscription = new Subscription();
  public productData: Product;

  constructor(private router: Router) {
    const state = this.router.getCurrentNavigation()?.extras?.state;

    this.productData = state?.['product'];
  }

  ngOnInit(): void {}

  loadForm(): void {}

  ngOnDestroy(): void {
    if (this.subscriber) this.subscriber.unsubscribe();
  }
}
