import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductsService } from 'src/app/services/products.service';
import {
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from '@angular/forms';
import * as dayjs from 'dayjs';
import { Router } from '@angular/router';
import { Modal, Product } from 'src/app/interfaces';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private subscriber: Subscription = new Subscription();

  protected productForm!: UntypedFormGroup;
  protected submitted: boolean = false;
  protected isValidDate: boolean = true;
  protected showModal: boolean = false;
  protected loading: boolean = false;

  protected modalState: Modal = {
    title: '',
    message: '',
    showAction: false,
  };

  @Input() product: Product | undefined;

  constructor(
    private productService: ProductsService,
    private formBuilder: UntypedFormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadForm(this.product);
  }

  loadForm(product?: Product): void {
    this.productForm = this.formBuilder.group({
      id: [
        product?.id || '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
      ],
      name: [
        product?.name || '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        product?.description || '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: [product?.logo || '', Validators.required],
      date_release: [
        dayjs(product?.date_release).format('DD/MM/YYYY') ||
          dayjs(new Date()).format('DD/MM/YYYY'),
        Validators.required,
      ],
      date_revision: [
        dayjs(product?.date_revision).format('DD/MM/YYYY') ||
          dayjs(new Date()).add(1, 'year').format('DD/MM/YYYY'),
        Validators.required,
      ],
    });

    this.productForm.get('date_revision')?.disable();
  }

  /**
   * form controls
   */
  get control() {
    return this.productForm.controls;
  }

  /**
   * format dates
   * @returns yyyy/mm/dd
   */
  getTodayDate(dateRangeYear: number): string {
    const today = new Date();
    const year = today.getFullYear() - dateRangeYear;
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  handleRevisionDate(e: Event): void {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    const value = (e.target as HTMLInputElement).value;
    const splitDate = value.split('/');
    const validDate = `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`;
    const validYear = +splitDate[2] >= dayjs().year();
    const validMonth = +splitDate[1] >= 1 && +splitDate[1] <= 12;
    const validDay = +splitDate[0] >= 1 && +splitDate[0] <= 31;

    this.isValidDate = regex.test(value) && validYear && validMonth && validDay;

    if (this.isValidDate) {
      const date = dayjs(validDate);

      const newDate = date.add(1, 'year');

      const formattedDate = newDate.format('DD/MM/YYYY');

      this.productForm.get('date_revision')?.setValue(formattedDate);
    }
  }

  /**
   * send data
   */
  onSubmit(): void {
    this.submitted = true;

    if (this.productForm.status === 'INVALID' || !this.isValidDate) return;

    this.loading = true;

    const data = {
      ...this.productForm.value,
      date_release: this.handleValidDate(
        this.productForm.get('date_release')?.value
      ),
      date_revision: this.handleValidDate(
        this.productForm.get('date_revision')?.value
      ),
    };

    if (!!this.product) {
      this.editProduct(data);
    } else {
      this.verifyProductExistence(this.productForm.get('id')?.value, data);
    }
  }

  /**
   * create a product after verify id existence
   * @param data
   */
  createProduct(data: Product): void {
    this.subscriber = this.productService.createProduct(data).subscribe(
      (res) => {
        this.modalState = {
          title: 'Producto creado exitosamente!',
          showAction: false,
        };

        this.showModal = true;
        this.loading = false;

        setTimeout(() => {
          this.router.navigate(['/products']);
        }, 2000);
      },
      ({ error }) => {
        this.modalState = {
          title: 'Ha Ocurrido un error',
          showAction: true,
        };

        this.showModal = true;
        this.loading = false;
      }
    );
  }

  /**
   * verify product by id
   * @param id
   */
  verifyProductExistence(id: string, data: Product): void {
    this.subscriber = this.productService.verifyExistence(id).subscribe(
      (res) => {
        console.log(res);

        if (!res) {
          this.createProduct(data);
        } else {
          this.modalState = {
            title: 'Producto duplicado',
            showAction: true,
          };

          this.showModal = true;
          this.loading = false;
        }
      },
      ({ error }) => {
        console.log(error);

        this.modalState = {
          title: 'Ha Ocurrido un error',
          showAction: true,
        };

        this.showModal = true;
        this.loading = false;
      }
    );
  }

  /**
   * edit a product and verify id existence
   * @param data
   */
  editProduct(data: Product): void {
    this.subscriber = this.productService.editProduct(data).subscribe(
      (res) => {
        this.modalState = {
          title: 'Producto editado exitosamente!',
          showAction: false,
        };

        this.showModal = true;
        this.loading = false;

        setTimeout(() => {
          this.router.navigate(['/products']);
        }, 2000);
      },
      ({ error }) => {
        this.modalState = {
          title: 'Ha Ocurrido un error',
          showAction: true,
        };

        this.showModal = true;
        this.loading = false;
      }
    );
  }

  /**
   * method to format valid date with dayjs
   * @param date
   * @returns
   */
  handleValidDate(date: string): dayjs.Dayjs {
    const splitDate = date.split('/');

    const validDate = `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`;

    return dayjs(validDate);
  }

  /**
   * restar form
   */
  restart(): void {
    this.productForm.reset();
  }

  closeModal(): void {
    this.showModal = false;
  }

  ngOnDestroy(): void {
    if (this.subscriber) this.subscriber.unsubscribe();
  }
}
