import {ensureElement} from '../src/utils/utils'
import {Component} from '../src/components/base/Component'
import {IEvents} from '../src/components/base/Events'


interface IHeader {
    counter: number;
}

export class Header extends Component<IHeader> {
    protected counterElement: HTMLElement;
    protected basketButton: HTMLButtonElement;

    constructor(protected events: IEvents, container:HTMLElement) {
        super(container)
        this.counterElement = ensureElement<HTMLElement>('.header__basket-counter',this.container)
        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket',this.container)

        this.basketButton.addEventListener('click', () =>{
            this.events.emit('basket:open')
        })
    }

    set counter(value:number) {
        this.counterElement.textContent = String(value)
    }
    updateCounter(count: number): void {
        if (this.counterElement) {
            this.counterElement.textContent = String(count);
            console.log('🔄 Счетчик корзины обновлен:', count);
        }
    }
}