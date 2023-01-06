import('./bootstrap');

const cartElm = document.getElementById('cart-list');
const prodElm = document.getElementById('product-list');
const goBack = document.getElementById('go-back');
cartElm.style.display = 'none';
goBack.style.display = 'none';
document
  .querySelector('.show-cart')
  .addEventListener('click', showCartHideProduct);

goBack.addEventListener('click', showCartHideProduct);

function showCartHideProduct() {
  if (cartElm.style.display === 'none') {
    cartElm.style.display = 'block';
    prodElm.style.display = 'none';
    goBack.style.display = 'block';
  } else {
    cartElm.style.display = 'none';
    goBack.style.display = 'none';
    prodElm.style.display = 'flex';
  }
}
