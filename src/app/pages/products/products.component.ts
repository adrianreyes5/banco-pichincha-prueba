import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Alert, Modal, Product } from 'src/app/interfaces';
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
  protected isMenuOpen: Alert = { id: '', open: false };
  protected showModal: Alert = { id: '', open: false };
  protected loadingDelete: boolean = false;

  protected modalState: Modal = {
    title: '',
    message: '',
    showAction: false,
  };

  constructor(
    private productService: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getProductList(this.selectedOption);
  }

  /**
   * list products
   */
  getProductList(paginationValue: number): void {
    this.subscriber = this.productService.getProductList().subscribe(
      (res) => {
        this.allProductList = res.slice(0, paginationValue).map((item, i) => {
          this.testImage(item.logo, i);

          return item;
        });
        this.productList = res.slice(0, paginationValue).map((item, i) => {
          this.testImage(item.logo, i);

          return item;
        });
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

  toggleMenu(id: string) {
    if (this.isMenuOpen.id === id) {
      this.isMenuOpen = {
        id: '',
        open: false,
      };
    } else {
      this.isMenuOpen = {
        id,
        open: true,
      };
    }
  }

  /**
   * edit product
   */
  edit(product: Product) {
    this.router.navigate([`/products/edit/${product.id}`], {
      state: { product },
    });

    this.isMenuOpen = {
      id: '',
      open: false,
    };
  }

  /**
   * delete product
   */
  openDeleteProductModal(product: Product) {
    this.modalState = {
      title: `Estas seguro de eliminar el producto ${product.name}?`,
      showAction: true,
    };

    this.isMenuOpen = {
      id: '',
      open: false,
    };

    this.showModal = {
      id: product.id,
      open: true,
    };
  }

  /**
   * method to delete a product
   */
  deleteProduct(id: string): void {
    this.subscriber = this.productService.deleteProduct(id).subscribe(
      (res) => {
        this.showModal = {
          id: '',
          open: true,
        };

        this.modalState = {
          title: 'Producto eliminado exitosamente!',
          showAction: false,
        };

        this.getProductList(this.selectedOption);

        setTimeout(() => {
          this.resetModalState();
        }, 1500);
      },
      (error) => {
        console.log(error);

        this.showModal = {
          id: '',
          open: true,
        };

        this.modalState = {
          title: 'Ha ocurrido un error',
          showAction: false,
        };

        setTimeout(() => {
          this.resetModalState();
        }, 1500);
      }
    );
  }

  /**
   * method to verify corret image url
   * @param url
   */
  testImage(url: string, index: number): void {
    let tester = new Image();
    tester.addEventListener('error', () => {
      console.log(index);
      this.allProductList[index].logo = 'https://picsum.photos/60';
      this.productList[index].logo = 'https://picsum.photos/60';
    });
    tester.src = url;
  }

  resetModalState(): void {
    this.showModal = {
      id: '',
      open: false,
    };
  }

  ngOnDestroy(): void {
    if (this.subscriber) this.subscriber.unsubscribe();
  }
}
