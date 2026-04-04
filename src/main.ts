import './scss/styles.scss';
import { apiProducts } from "./utils/data";
import { ProductCatalog } from '../ProductCatalog'
import { Buyer } from '../Buyer'
import { ShoppingCart } from '../ShoppingCart'
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
const validationErrors = buyer.Validate()
console.log('Ошибки валидации:', validationErrors)




console.log('Очистка данных покупателя:')
buyer.clearData()
console.log('Данные покупателя после очистки:', buyer.getData())
console.log('Ошибки после очистки:', buyer.Validate())