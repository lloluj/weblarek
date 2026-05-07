// import { Component } from '../src/components/base/Component';
// import { IProduct } from './ProductModel';
// import { IEvents, EventEmitter } from '../src/components/base/Events';
// export class GalleryView extends Component<IProduct[]> {
//     constructor(container: HTMLElement) {
//         super(container);
//     }

//     render(products: IProduct[]): HTMLElement {
//         this.container.innerHTML = '';
//         products.forEach(product => {
//             const card = document.querySelector(`[data-product-id="${product.id}"]`);
//             if (card) {
//                 this.container.appendChild(card.cloneNode(true) as HTMLElement);
//             }
//         });
//         return this.container;
//     }
// }