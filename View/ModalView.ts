export class ModalView {
    private modalElement: HTMLElement;
    private contentContainer: HTMLElement;

    constructor(modalElement: HTMLElement) {
        this.modalElement = modalElement;
        this.contentContainer = modalElement.querySelector('.modal__container') as HTMLElement;
        
        console.log('📱 ModalView конструктор:', {
            modalElement: !!modalElement,
            contentContainer: !!this.contentContainer
        });
        
        const closeButton = modalElement.querySelector('.modal__close');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.close());
        }
        
        modalElement.addEventListener('click', (event) => {
            if (event.target === modalElement) this.close();
        });
        
        this.modalElement.classList.remove('modal_active');
    }

    open(content: HTMLElement): void {
        console.log('📱 Открываем модальное окно');
        console.log('📱 Контент для отображения:', content);
        
        if (!this.contentContainer) {
            console.error('❌ contentContainer не найден!');
            return;
        }
        
        this.contentContainer.innerHTML = '';
        
        // Принудительно показываем контент, если он скрыт
        if (content.style.display === 'none') {
            content.style.display = 'block';
            console.log('📱 Принудительно показали скрытый контент');
        }
        
        this.contentContainer.appendChild(content);
        
        console.log('📱 После добавления контента, contentContainer.innerHTML:', this.contentContainer.innerHTML);
        
        this.modalElement.classList.add('modal_active');
        
        console.log('📱 Модальное окно открыто');
    }

    close(): void {
        console.log('📱 Закрываем модальное окно');
        this.modalElement.classList.remove('modal_active');
        this.contentContainer.innerHTML = '';
    }

    isOpen(): boolean {
        return this.modalElement.classList.contains('modal_active');
    }
}