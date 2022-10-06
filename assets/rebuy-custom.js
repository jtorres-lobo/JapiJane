if (typeof window.Rebuy == 'undefined') {
  window.Rebuy = {};
}
window.Rebuy.disable_attribution = true;

document.addEventListener('rebuy.init', function(event){
  window.Rebuy.shop.currency_format = {
      dollars: false,
      cents: true,
      precision: 0,
      thousands: '.',
      decimal: '.'
    }
  window.Rebuy.disable_attribution = true;
});

if(Shopify.Checkout != undefined && Shopify.Checkout.step === 'contact_information') {
  document.addEventListener('rebuy.add', function(event){
    //document.querySelector('#order-summary div.order-summary__section').classList.add('order-summary__section--is-scrollable');
  });
}

if (Shopify.Checkout != undefined && Shopify.Checkout.step === 'shipping_method') {
  document.addEventListener('rebuy.add', function(event){
    location.reload();
  });
  document.addEventListener('rebuy.remove', function(event){
  	location.reload();
  });
}