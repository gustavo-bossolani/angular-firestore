import { fromEvent, Observable, pipe } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Product } from './../models/product.model';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../product.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  @ViewChild('name')
  private nameField!: ElementRef;

  products$!: Observable<Product[]>;
  displayedColumns = ['name', 'price', 'stock', 'operations'];
  filterProducts$!: Observable<Product[]>;

  productForm = this.builder.group({
    id: [ undefined ],
    name: ['', [ Validators.required ]],
    stock: [, [ Validators.required ]],
    price: [, [ Validators.required ]]
  });

  constructor(
    private builder: FormBuilder,
    private service: ProductService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.products$ = this.service.getProducts();
    this.filterProducts$ = this.service.getProducts();
  }

  handleSubmit() {
    const p: Product = this.productForm.value;

    if (!p.id) {
      this.addProduct(p);
    } else {
      this.updateProduct(p);
    }
  }

  addProduct(product: Product) {
    this.service.addProduct(product)
      .then(() => {
        this.snackBar.open(`${product.name} created`, 'OK', { duration: 2000 });
        this.productForm.reset({ name: '', stock: 0, price: 0, id: undefined });
        this.nameField.nativeElement.focus();
      })
      .catch(error => {
        this.snackBar.open('Error', 'NOK', { duration: 2000 });
        console.error(error);
      });
  }

  updateProduct(product: Product) {
    this.service.update(product)
      .then(() => {
        this.snackBar.open(`${product.name} deleted`, 'OK', { duration: 2000 });
        this.productForm.reset({ name: '', stock: 0, price: 0, id: undefined });
      })
      .catch(error => {
        this.snackBar.open('Error', 'NOK', { duration: 2000 });
        console.error(error);
      });
  }

  edit(product: Product) {
    this.productForm.setValue(product);
  }

  remove(product: Product) {
    this.service.delete(product)
      .then(() => {
        this.snackBar.open(`${product.name} updated`, 'OK', { duration: 2000 });
        this.productForm.reset({ name: '', stock: 0, price: 0, id: undefined });
      })
      .catch(error => {
        this.snackBar.open('Error', 'NOK', { duration: 2000 });
        console.error(error);
      });
  }

  filter(event: any) {
    this.filterProducts$ = this.service.searchByName(event.target.value);
  }
}
