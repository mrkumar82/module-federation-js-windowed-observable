import { Observable } from 'windowed-observable';

const observable = new Observable('cart-items');
let cartItem = JSON.parse(localStorage.getItem('cart')) || [];
const CartEle = document.querySelector('#cart-list');
const MiniCartEle = document.querySelector('#mini-cart');

const populateCart = () => {
  let markup = '';
  if (!cartItem.length) {
    markup = `<div>Cart is empty</div>`;
  } else {
    markup = cartItem.map((item) => {
      const { id, title, price, qty, thumbnail } = item;
      return `<div class="cart-item">
       
          <div class="img-wrapper"><img width="100" src="${thumbnail}" alt=""> </div>

          <div class="title-price-wrapper">
          <div class="main-title"> <h4 class="title">${title}</h4></div>
          <div><p class="cart-item-price">$ ${price}</p></div>
            <div><p class="cart-item-price">$ ${price * qty}</p></div>
            <div class="cart-buttons">
            <div class="buttons">
            <i class="bi bi-dash-lg" data-id=${id}></i>
            <div id="quantity-${id}" data-qty="${qty}" class="quantity">${qty}</div>
            <i class="bi bi-plus-lg" data-id=${id}></i>
            </div>
          </div>
          <div class="clear-cart"> <i class="bi bi-x-lg" data-id="${id}"></i></div>
          </div>
      </div>`;
    });
  }

  if (typeof CartEle != 'undefined') {
    CartEle.innerHTML = `<h2 class="page-title">Cart </h2>${markup}`;
  }
};

populateCart();

const populateMiniCart = () => {
  const cartCount = cartItem
    .map((item) => item.qty)
    .reduce((acc, value) => acc + value, 0);
  const miniCartMarkup = `<i class="bi bi-cart2"></i>
    <div id="cartAmount" class="cartAmount">${cartCount}</div>`;

  MiniCartEle.innerHTML = miniCartMarkup;
  populateCart();
};
populateMiniCart();

observable.subscribe(handleMessage);
// window.addEventListener('ADD_TO_CART', handleAddMessage);
function handleMessage(data) {
  if (data.type === 'ADD_TO_CART') {
    incrementItem(data);
  } else if (data.type === 'REMOVE_FROM_CART') {
    decrementItem(data);
  }
  populateMiniCart();
}

function incrementItem(item) {
  let cartItems = cartItem.find((product) => product.id === item.id);
  if (cartItems === undefined) {
    item.qty = 1;
    cartItem.push(item);
  } else {
    cartItems.qty += 1;
  }
  localStorage.setItem('cart', JSON.stringify(cartItem));
}

function decrementItem(item) {
  let cartItems = cartItem.find((product) => product.id === item.id);
  if (cartItems === undefined) {
    return;
  } else if (cartItems.qty === 0) {
    return;
  } else {
    cartItems.qty -= 1;
  }
  cartItem = cartItem.filter((prod) => prod.qty !== 0);
  localStorage.setItem('cart', JSON.stringify(cartItem));
}

document.addEventListener('click', removeItemFromCart);

function removeItemFromCart(ev) {
  if (ev.target.classList.contains('bi-x-lg')) {
    const id = ev.target.dataset.id;
    cartItem = cartItem.filter((prod) => prod.id !== +id);
    localStorage.setItem('cart', JSON.stringify(cartItem));
    document.querySelector(`.quantity-${id}`).innerHTML = 0;
    populateCart();
    populateMiniCart();
  }
}
