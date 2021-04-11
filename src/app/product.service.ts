import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from './models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productsCollection:
    AngularFirestoreCollection<Product> = this.fireStore.collection('products');

  constructor(
    private fireStore: AngularFirestore,
  ) { }

  getProducts(): Observable<Product[]> {
    return this.productsCollection.valueChanges();
  }

  searchByName(name: string): Observable<Product[]> {
    return this.fireStore.collection<Product>('products',
      ref => ref.orderBy('name').startAt(name).endAt(name + '\uf8ff')
    ).valueChanges();
  }

  addProduct(product: Product) {
    // o método add é o método mais simples de se utilizar
    // para a criação de um novo registro no firebase

    // return this.productsCollection.add(product);

    const id = this.fireStore.createId();
    Object.assign(product, { ...product, id });

    return this.productsCollection.doc(id).set(product);
  }

  delete(product: Product) {
    return this.productsCollection.doc(product.id).delete();
  }

  update(product: Product) {
    return this.productsCollection.doc(product.id).set(product);
  }
}
