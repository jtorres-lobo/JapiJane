  if (typeof sswRun === 'function' && window.location.pathname == '/pages/wishlist') {
     sswRun(function() {
       ssw('.ssw-fave-add-to-cart').off('click');
       var searchUrl = window.location.origin + '/search?type=article%2Cpage%2Cproduct&q=';
       ssw(document.body).on('click', '.ssw-fave-add-to-cart', function() {
         var searchQueryUrl = searchUrl + ssw(this).parents('.ssw-fave-item').find('.ssw-fave-product-info .ssw-fave-product-title').text().split(' ').join('*+') + '*';
         
         var productPageLinkOnWishlistPage = ssw(this).parents('.ssw-fave-item').find('.ssw-fave-product-title.ssw-product-link').attr('href');
         ssw.ajax(searchQueryUrl).done(function (res) {
           ssw(res).find('.productgrid--item').each(function() {
             var productPageLink = ssw(this).find('.productitem--image-link').attr('href');
             if (productPageLink.includes(productPageLinkOnWishlistPage)) {
               var product = JSON.parse(ssw(this).find('[data-product-data]').text());
               var atcButton = ssw(this).find('[data-quick-buy]');
               var variantID = ssw(atcButton).attr('data-variant-id');
               var formData = [{
                 'name': 'id',
                 'value': variantID
               }, {
                 'name': 'quantity',
                 'value': 1
               }];
               var options = {
                 $atcButton: atcButton,
                 settings: {
                   moneyFormat: "${{amount_no_decimals}}",
                   cartRedirection: false
                 }
               };
               window.AddToCartFlyoutInit(formData, product, options);
             }
           })
           
         })
       })
     })
  }