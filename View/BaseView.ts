export abstract class BaseView<T = any> {
    protected container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    abstract render(data?: T): void;
}