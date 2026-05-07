// import { BaseView } from './BaseView';
// import { IEvents } from '../src/components/base/Events';

// export class HeaderView extends BaseView<number> {
//     private counterElement: HTMLElement;
//     private basketButton: HTMLButtonElement;
//     private events: IEvents;

//     constructor(events: IEvents, container: HTMLElement) {
//         super(container);
//         this.events = events;
//         // Поиск элементов только внутри контейнера
//         this.counterElement = container.querySelector('.header__basket-counter') as HTMLElement;
//         this.basketButton = container.querySelector('.header__basket') as HTMLButtonElement;
        
//         this.basketButton.addEventListener('click', () => {
//             this.events.emit('basket:open');
//         });
//     }

//     render(count: number): void {
//         this.counterElement.textContent = String(count);
//     }
// }