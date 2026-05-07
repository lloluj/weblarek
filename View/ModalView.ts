export class ModalView {
    private modalElement: HTMLElement;
    private contentContainer: HTMLElement;

    constructor(modalElement: HTMLElement) {
        this.modalElement = modalElement;
        // Поиск элементов только внутри контейнера
        this.contentContainer = modalElement.querySelector('.modal__content') as HTMLElement;
        
        const closeButton = modalElement.querySelector('.modal__close');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.close());
        }
        
        modalElement.addEventListener('click', (event) => {
            if (event.target === modalElement) this.close();
        });
        
        this.modalElement.style.display = 'none';
    }

    open(content: HTMLElement): void {
        this.contentContainer.innerHTML = '';
        this.contentContainer.appendChild(content);
        this.modalElement.style.display = 'flex';
        this.modalElement.classList.add('modal_active');
    }

    close(): void {
        this.modalElement.style.display = 'none';
        this.modalElement.classList.remove('modal_active');
        
        // Скрываем корзину при закрытии
        const basketElement = this.contentContainer.querySelector('.basket');
        if (basketElement) {
            (basketElement as HTMLElement).style.display = 'none';
        }
        
        this.contentContainer.innerHTML = '';
    }

    isOpen(): boolean {
        return this.modalElement.style.display === 'flex';
    }
}