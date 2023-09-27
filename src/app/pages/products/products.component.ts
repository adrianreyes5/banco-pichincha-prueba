import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Product } from 'src/app/interfaces';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  private subscriber: Subscription = new Subscription();

  protected inputValue: string = '';

  protected productList: Product[] = [];
  protected allProductList: Product[] = [];
  protected selectedOption: number = 5;
  protected options: number[] = [5, 10, 20];

  constructor(private productService: ProductsService) {}

  ngOnInit(): void {
    this.getProductList(this.selectedOption);
  }

  /**
   * list products
   */
  getProductList(paginationValue: number): void {
    this.subscriber = this.productService.getProductList().subscribe(
      (res) => {
        this.allProductList = res.slice(0, paginationValue);
        this.productList = res.slice(0, paginationValue);
      },
      ({ error }) => {
        console.error(error);
      }
    );
  }

  /**
   * filter list by product name
   */
  handleInputFilter(): void {
    const filter = this.productList.filter((product) =>
      product.name.toLocaleLowerCase().includes(this.inputValue)
    );

    if (this.inputValue.length > 0) {
      this.productList = filter;
    } else {
      this.productList = this.allProductList;
    }
  }

  ngOnDestroy(): void {
    if (this.subscriber) this.subscriber.unsubscribe();
  }
}
