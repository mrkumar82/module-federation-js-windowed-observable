import './main.css';
import { Observable } from 'windowed-observable';

const observable = new Observable('cart-items');
const productElm = document.querySelector('#product-list');
const cartItem = JSON.parse(localStorage.getItem('cart'));
const fetchData = async () => {
  const storageProduct = JSON.parse(localStorage.getItem('products'));
  if (!storageProduct) {
    const resp = await fetch('https://dummyjson.com/products');
    const data = await resp.json();
    localStorage.setItem('products', JSON.stringify(data.products));
    markup(data.products);
  } else {
    markup(storageProduct);
  }
};

const markup = (products) => {
  const elements = products
    .slice(10)
    .map((product) => {
      const { id, price, title, thumbnail, description } = product;
      const prod = cartItem?.find((item) => item.id === id);
      const qty = prod?.qty == undefined ? 0 : prod.qty;
      return `<div class="item">
      <div class="item-content">
        <div class="img-wrap"><img width="220" src="${thumbnail}" alt="${title}"></div>
        <div class="details">
          <h3>${title}</h3>
          <p>${description}</p>
        </div>
        </div>
        <div class="price-quantity">
        <h2>$ ${price} </h2>
        <div class="buttons prod">
          <i class="bi bi-dash-lg" data-id="${id}"></i>
          <div data-qty="${qty}" class="quantity-${id}">${qty}</div>
          <i class="bi bi-plus-lg" data-id="${id}"></i>
        </div>
      </div>
      </div>`;
    })
    .join(' ');

  productElm.innerHTML = `<h2 class="page-title">Products</h2>${elements}`;
};

fetchData();

// const incrementEle = document.querySelectorAll('.bi-plus-lg');
// const decrementEle = document.querySelectorAll('.bi-dash-lg');

const incrementProduct = (ev) => {
  if (ev.target.classList.contains('bi-plus-lg')) {
    const elmDataId = ev.target.dataset.id;
    const item = fetchLocalData(elmDataId);
    observable.publish({ ...item, type: 'ADD_TO_CART' });
    updateCount(elmDataId, 'add');
  }
};
const decrementProduct = (ev) => {
  if (ev.target.classList.contains('bi-dash-lg')) {
    const elmDataId = ev.target.dataset.id;
    const item = fetchLocalData(elmDataId);
    observable.publish({ ...item, type: 'REMOVE_FROM_CART' });
    updateCount(elmDataId, 'remove');
  }
};
document.addEventListener('click', incrementProduct);
document.addEventListener('click', decrementProduct);

function fetchLocalData(id) {
  const localData = JSON.parse(localStorage.getItem('products'));
  const filterData = localData.find((item) => item.id === +id);
  return filterData;
}

function updateCount(elmId, label) {
  const id = document.querySelector(`.quantity-${elmId}`);
  let itemCount = +id.dataset.qty;
  if (label === 'add') {
    itemCount += 1;
  } else {
    itemCount -= 1;
  }
  id.dataset.qty = itemCount;
  id.innerHTML = itemCount;
}
