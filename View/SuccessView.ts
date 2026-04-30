// interface ISuccessData {
//     total: number;
// }

// export class SuccessView {
//     private container: HTMLElement;
//     private closeButton: HTMLButtonElement;
//     private descriptionElement: HTMLElement;
//     private onClose?: () => void;

//     constructor(container: HTMLElement) {
//         this.container = container;
//         this.closeButton = container.querySelector('.order-success__close') as HTMLButtonElement;
//         this.descriptionElement = container.querySelector('.order-success__description') as HTMLElement;
        
//         this.closeButton.addEventListener('click', () => this.onClose?.());
//     }

//     setOnClose(callback: () => void): void {
//         this.onClose = callback;
//     }

//     render(data: ISuccessData): void {
//         this.descriptionElement.textContent = `Списано ${data.total} синапсов`;
//     }

//     getContainer(): HTMLElement {
//         return this.container;
//     }
// }



interface ISuccessData {
    total: number;
}

export class SuccessView {
    private container: HTMLElement;
    private closeButton: HTMLButtonElement;
    private descriptionElement: HTMLElement;
    private onClose?: () => void;

    constructor(container: HTMLElement) {
        this.container = container;
        this.closeButton = container.querySelector('.order-success__close') as HTMLButtonElement;
        this.descriptionElement = container.querySelector('.order-success__description') as HTMLElement;
        
        this.closeButton.addEventListener('click', () => this.onClose?.());
    }

    setOnClose(callback: () => void): void {
        this.onClose = callback;
    }

    render(data: ISuccessData): void {
        this.descriptionElement.textContent = `Списано ${data.total} синапсов`;
    }

    getContainer(): HTMLElement {
        return this.container;
    }
}