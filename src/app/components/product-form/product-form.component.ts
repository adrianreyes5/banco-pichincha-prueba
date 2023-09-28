import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductsService } from 'src/app/services/products.service';
import {
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from '@angular/forms';
import * as dayjs from 'dayjs';
import { Router } from '@angular/router';
import { Modal } from 'src/app/interfaces';

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

  protected modalState: Modal = {
    title: '',
    message: '',
    showAction: false,
  };

  constructor(
    private productService: ProductsService,
    private formBuilder: UntypedFormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadForm();
  }

  loadForm(): void {
    this.productForm = this.formBuilder.group({
      id: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: ['', Validators.required],
      date_release: [
        dayjs(new Date()).format('DD/MM/YYYY'),
        Validators.required,
      ],
      date_revision: [
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

    console.log(this.productForm.controls);

    if (this.productForm.status === 'INVALID' || !this.isValidDate) return;

    const data = {
      ...this.productForm.value,
      date_release: this.handleValidDate(
        this.productForm.get('date_release')?.value
      ),
      date_revision: this.handleValidDate(
        this.productForm.get('date_revision')?.value
      ),
    };

    this.subscriber = this.productService.createProduct(data).subscribe(
      (res) => {
        this.modalState = {
          title: 'Producto creado exitosamente!',
          showAction: false,
        };

        this.showModal = true;

        setTimeout(() => {
          this.router.navigate(['/products']);
        }, 2000);
      },
      ({ error }) => {
        console.log(error);

        this.modalState = {
          title: 'Ha Ocurrido un error',
          showAction: true,
        };

        this.showModal = true;
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
