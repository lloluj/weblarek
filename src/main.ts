import './scss/styles.scss';
import { IProductsResponse, IOrderRequest, IOrderResponse, IProduct, IApi } from '../src/types/index.ts';
import { apiProducts } from "./utils/data";
import { ProductCatalog } from '../ProductCatalog'
import { Buyer } from '../Buyer'
import { ShoppingCart } from '../ShoppingCart'
import { ApiService } from "../Api.ts";
import { API_URL } from '../src/utils/constants'
// const apiService = new ApiService({
//   async get<T>(url: string): Promise<T> {
//     console.warn('Mock API: get() called for', url);
//     if (url === '/product/') {
//       return { items: apiProducts.items } as T;
//     }
//     throw new Error(`Unknown endpoint: ${url}`);
//   },
//   async post<T>(url: string, data: any): Promise<T> {
//     console.warn('Mock API: post() called for', url);
//     throw new Error('POST not implemented in mock');
//   }
// });


const apiService = new ApiService({
  async get<T>(endpoint: string): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json() as Promise<T>;
  },

  async post<T>(endpoint: string, data: any): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }
})






const buyer = new Buyer()
const shoppingCart = new ShoppingCart()
const productsModel = new ProductCatalog();
productsModel.setItems(apiProducts.items);
const  catalogItems = productsModel.getItems()
console.log('Массив товаров из каталога: ', productsModel.getItems())
const firstProductId = catalogItems[0]?.id
if (firstProductId) {
  const foundProduct = productsModel.getProductById(firstProductId)
  console.log(`Товар с ID ${firstProductId}:`, foundProduct)
}
if (catalogItems[0]) {
  productsModel.setProduct(catalogItems[0]);
  const selectedProduct = productsModel.getProduct();
  console.log('Выбранный товар:', selectedProduct);
}




console.log('Добавление товаров в корзину:')
shoppingCart.addItem(catalogItems[0])
shoppingCart.addItem(catalogItems[1])
console.log('Товары в корзине после добавления:', shoppingCart.getItems())


console.log('Проверка наличия товара в корзине:')
const firstItemId = catalogItems[0]?.id
const secondItemId = catalogItems[1]?.id
console.log(`Есть ли товар с ID ${firstItemId} в корзине?`, shoppingCart.hasItem(firstItemId))
console.log(`Есть ли товар с ID ${secondItemId} в корзине?`, shoppingCart.hasItem(secondItemId))



console.log('Расчёт общей стоимости и количества товаров:')
console.log('Общая стоимость товаров в корзине:', shoppingCart.getPrice(), 'руб.')
console.log('Количество товаров в корзине:', shoppingCart.getCount())


console.log('Удаление товара из корзины:')
shoppingCart.deleteItem(catalogItems[0])
console.log('Товары в корзине после удаления:', shoppingCart.getItems())
console.log('Общая стоимость после удаления:', shoppingCart.getPrice(), 'руб.')
console.log('Количество после удаления:', shoppingCart.getCount())


console.log('Очистка корзины:')
shoppingCart.clear();
console.log('Корзина после очистки:', shoppingCart.getItems())
console.log('Стоимость после очистки:', shoppingCart.getPrice())





console.log('Установка данных покупателя:')
buyer.setBuyerData({
  payment: 'card',
  email: 'user@example.com',
  phone: '+79991234567',
  address: 'ул. Ленина, 1'
});
console.log('Данные покупателя после setBuyerData:', buyer.getData())



console.log('Валидация данных покупателя:')
const validationErrors = buyer.validate()
console.log('Ошибки валидации:', validationErrors)




console.log('Очистка данных покупателя:')
buyer.clearData()
console.log('Данные покупателя после очистки:', buyer.getData())
console.log('Ошибки после очистки:', buyer.validate())




apiService.getProducts()
  .then((serverProducts: IProduct[]) => {
    productsModel.setItems(serverProducts);
    console.log('Массив товаров, полученный с сервера:', productsModel.getItems());
  })
  .catch((err: Error) => {
    console.error('Ошибка при получении данных:', err);
  });


































// import { CardView } from "../View/CardView";
// import { CardPreview } from "../View/CardPreview";
// import { CardBasket } from "../View/CardBasket";

// import { ProductCardManager } from '../View/ProductCardManager';
// import { ensureElement } from '../src/utils/utils';
// import { Modal } from '../View/Modal';
// import { Basket } from '../View/Basket';
// import { Header } from '../View/Header';
// import { EventEmitter } from '../src/components/base/Events';


// interface ProductData {
//     id: string;
//     title: string;
//     category: string;
//     price: number;
//     image: string;
//     description: string;
// }

// document.addEventListener('DOMContentLoaded', () => {
//     try {
//         console.log('DOM загружен, начинаем инициализацию...');

//         const products: ProductData[] = [
//             {
//                 id: 'product-001',
//                 title: '+1 час в сутках',
//                 category: 'софт-скил',
//                 price: 750,
//                 image: './src/images/Subtract.svg',
//                 description: 'Поможет успеть всё запланированное за день.'
//             },
//             {
//                 id: 'product-002',
//                 title: 'Бэкенд-антистресс',
//                 category: 'другое',
//                 price: 1000,
//                 image: './src/images/Subtract.svg',
//                 description: 'Если планируете решать задачи в тренажёре, берите два.'
//             }
//         ];

//         console.log('Товары для отображения:', products);

//         // Получаем или создаём контейнер корзины
//         let basketElement = document.querySelector('.basket') as HTMLElement | null;
//         if (!basketElement) {
//             basketElement = document.createElement('div');
//             basketElement.className = 'basket';
//             document.body.appendChild(basketElement);
//             console.log('Создан элемент .basket');
//         }

//         const galleryElement = ensureElement<HTMLElement>('.gallery', document.body);
//         const modalElement = ensureElement<HTMLElement>('#modal-container', document.body);
//         const headerElement = ensureElement<HTMLElement>('.header', document.body);

//         console.log('Элементы получены:', { galleryElement, modalElement, basketElement, headerElement });

//         const events = new EventEmitter();
//         const modal = new Modal(modalElement);
//         const basket = new Basket(basketElement);
//         const header = new Header(events, headerElement);

//         const productManager = new ProductCardManager(
//             galleryElement,
//             modal,
//             basket,
//             header,
//             events
//         );

//         console.log('Менеджер создан, начинаем создание карточек...');
//         productManager.createCatalogCards(products);
//         console.log('Карточки успешно созданы и добавлены в галерею');
//     } catch (error) {
//         console.error('Критическая ошибка:', error);
//     }
// });



























interface ProductData {
    id: string;
    title: string;
    category: string;
    price: number;
    image: string;
    description: string;
}

import { ProductCardManager } from '../View/ProductCardManager'
import { Modal } from '../View/Modal'
import { Basket } from '../View/Basket'
import { Header } from '../View/Header'
import { EventEmitter } from '../src/components/base/Events'

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔎 Начинаем инициализацию приложения...')
    const galleryElement = document.querySelector('.gallery') as HTMLElement
    const modalElement = document.getElementById('modal-container') as HTMLElement
    const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
    if (!basketTemplate) {
        console.error('❌ Шаблон #basket не найден в HTML');
        return;
    }
    const basketFragment = document.importNode(basketTemplate.content, true);
    const basketElement = basketFragment.firstElementChild as HTMLElement;

    const headerElement = document.querySelector('.header') as HTMLElement;

    // Диагностика
    console.log('🔍 Результаты поиска DOM‑элементов:')
    console.log('• .gallery:', galleryElement ? 'НАЙДЕН' : 'НЕ НАЙДЕН')
    console.log('• #modal-container:', modalElement ? 'НАЙДЕН' : 'НЕ НАЙДЕН')
    console.log('• .basket (создан из шаблона):', basketElement ? 'СОЗДАН' : 'ОШИБКА СОЗДАНИЯ')
    console.log('• .header:', headerElement ? 'НАЙДЕН' : 'НЕ НАЙДЕН')

    if (!galleryElement || !modalElement || !basketElement || !headerElement) {
        console.error('❌ Не найдены необходимые DOM‑элементы: проверьте разметку HTML');
        return
    }

    console.log('✅ Все DOM‑элементы успешно найдены/созданы!');

    const events = new EventEmitter()
    const modal = new Modal(modalElement)
    const basket = new Basket(basketElement, modal) // Передаем модальное окно в корзину
    const header = new Header(events, headerElement)

    const productManager = new ProductCardManager(
        galleryElement,
        modal,
        basket,
        header,
        events
    );

    const products: ProductData[] = [
        {
            id: 'product-001',
            title: '+1 час в сутках',
            category: 'софт-скил',
            price: 750,
            image: './src/images/5Dots.png',
            description: 'Поможет успеть всё запланированное за день.'
        },
        {
            id: 'product-002',
            title: 'HEX-леденец',
            category: 'другое',
            price: 1450,
            image: './src/images/Леденец.png',
            description: 'Лизните этот леденец, чтобы мгновенно запоминать и узнавать любой цветовой код CSS.'
        },
        {
            id: 'product-003',
            title: 'Мамка-таймер',
            category: 'софт-скил',
            price: 750,
            image: './src/images/Мамка-таймер.png',
            description: 'Будет стоять над душой и не давать прокрастинировать.'
        },
        {
            id: 'product-004',
            title: 'Фреймворк куки судьбы',
            category: 'дополнительное',
            price: 2500,
            image: './src/images/Фреймворк.png',
            description: 'Откройте эти куки, чтобы узнать, какой фреймворк вы должны изучить дальше.'
        },
        {
            id: 'product-005',
            title: 'Кнопка "Замьютить кота"',
            category: 'кнопка',
            price: 2000,
            image: './src/images/Кнопка.png',
            description: 'Если орёт кот, нажмите кнопку.'
        },
        {
            id: 'product-006',
            title: 'БЭМ-пилюлька',
            category: 'другое',
            price: 1500,
            image: './src/images/БЭМ.png',
            description: 'Чтобы научиться правильно называть модификаторы, без этого не обойтись.'
        },
        {
            id: 'product-007',
            title: 'Портативный телепорт',
            category: 'другое',
            price: 100000,
            image: './src/images/Телепорт.png',
            description: 'Измените локацию для поиска работы.'
        },
        {
            id: 'product-008',
            title: 'Микровселенная в кармане',
            category: 'другое',
            price: 150000,
            image: './src/images/Микровселенная.png',
            description: 'Даст время для изучения React, ООП и бэкенда'
        },
        {
            id: 'product-009',
            title: 'UI/UX-карандаш',
            category: 'хард-скил',
            price: 10000,
            image: './src/images/Карандаш.png',
            description: 'Очень полезный навык для фронтендера. Без шуток.'
        },
        {
            id: 'product-010',
            title: 'Бэкенд-антистресс',
            category: 'другое',
            price: 1000,
            image: './src/images/антистресс.png',
            description: 'Сжимайте мячик, чтобы снизить стресс от тем по бэкенду.'
        },
    ];

    console.log(`🛒 Начинаем создание ${products.length} карточек каталога...`);
    productManager.createCatalogCards(products);
    console.log('✅ Карточки каталога успешно созданы и добавлены на страницу!');

    // Открытие корзины по клику на иконку корзины в шапке
    const basketIcon = document.querySelector('.header__basket')
    if (basketIcon) {
        basketIcon.addEventListener('click', () => {
            console.log('🛒 Открываем корзину в модальном окне');
            productManager.openBasket()
        });
    }

    console.log('✅ Приложение инициализировано успешно')
    console.log('🛒 В каталоге отображено', products.length, 'товаров')
})