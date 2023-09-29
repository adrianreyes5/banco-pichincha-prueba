import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductsService } from './services/products.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CustomHttpInterceptor } from './interceptor/http-interceptor';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterProductComponent } from './pages/register-product/register-product.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ModalComponent } from './components/modal/modal.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    NavBarComponent,
    RegisterProductComponent,
    ProductFormComponent,
    ModalComponent,
  ],
  imports: [
    HttpClientModule,
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomHttpInterceptor,
      multi: true,
    },
    ProductsService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
