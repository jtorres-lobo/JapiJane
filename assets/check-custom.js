/*
 Script Name: Checkout Plus 2.1.0
      Author: Lobo Creaciones (https://lobocreaciones.com)
       Store: Japi Jane® (japijane.myshopify.com)
 Description: Change the native Checkout into a Client specification.
*/

const isOnLoad = false;
let mandatory_token_do_not_modify = 1216216;

const alertRUT = document.createElement("div");
alertRUT.innerHTML = `
    <div id="alertRUT" style="display: none;">
      <p style="color: red;position: relative;top: 5px;left: 2px;">
        Introduce un RUT válido
      </p>
    </div>
`;

const alerterLtC = document.createElement("div");
alerterLtC.innerHTML = `
    <div id="alertElementLC" style="display: none;">
      <label style="position: absolute;margin-top: 2em;color: red;">
        Acepta los Términos y Condiciones para continuar.
      </label>
    </div>
`;

const alertPickup = document.createElement("div");
alertPickup.innerHTML = `
    <div id="alertElementPickup" style="display: none;">
      <label style="position: inherit;margin-top: 2em;color: red;">
        Acepta los Términos y Condiciones para continuar.
      </label>
    </div>
`;

function VerificarShippingLC() {
  if(Cookies.get('shippingJJ') === "true"){
    $(".section.section--billing-address").css("display","none");
  }
}

function VerificarPickupLC() {
  if(Cookies.get('pickupJJ') === "true"){
    $(".section.section--billing-address").css("display","block");
  }
}

function comunasLC() {
  let cityContainerLC = document.querySelector("div[data-address-field='city']");
  cityContainerLC.setAttribute("class", "field field--required field--half");
  cityContainerLC.innerHTML = "";

  let citySubContainerLC = document.createElement("div");
  citySubContainerLC.setAttribute("class","field__input-wrapper field__input-wrapper--select");
  cityContainerLC.appendChild(citySubContainerLC);

  let cityLabelLC = document.createElement("label");
  cityLabelLC.setAttribute("class", "field__label field__label--visible");
  cityLabelLC.setAttribute("for", "checkout_shipping_address_city");
  cityLabelLC.textContent = "Comuna";
  citySubContainerLC.appendChild(cityLabelLC);

  let cityListLC = document.createElement("select");
  cityListLC.setAttribute("autocomplete", "shipping address-level2");
  cityListLC.setAttribute("data-trekkie-id", "shipping_city_field");
  cityListLC.setAttribute("data-backup", "city");
  cityListLC.setAttribute("class", "field__input field__input--select");
  cityListLC.setAttribute("aria-required", "true");
  cityListLC.setAttribute("name", "checkout[shipping_address][city]");
  cityListLC.setAttribute("id", "checkout_shipping_address_city");

  let disabledItemLC = document.createElement("option");
  disabledItemLC.setAttribute("selected", "");
  disabledItemLC.setAttribute("disabled", "");
  disabledItemLC.text = "Cargando...";
  cityListLC.appendChild(disabledItemLC);

  fetch("https://cdn.shopify.com/s/files/1/2399/8817/files/japi_jane_chile_cities_do_not_delete.json?v=1658866857")
      .then((responseLC) => responseLC.json())
      .then((responseLC) => {
        responseLC.forEach((cityLC) => {
          let cityItemLC = document.createElement("option");
          cityItemLC.text = cityLC.comuna_nombre;
          cityItemLC.value = cityLC.comuna_nombre;
          cityListLC.appendChild(cityItemLC);
        });

        disabledItemLC.text = "Comuna";

        if (localStorage.checkout_shipping_address_city && isOnLoad)
          cityListLC.value = localStorage.getItem("checkout_shipping_address_city");

        cityListLC.onblur = () => {};
      })
      .catch((errorLC) => {
        console.log(errorLC.message);
        disabledItemLC.text = "Escribe una dirección para predecir una comuna";
      });

  citySubContainerLC.appendChild(cityListLC);

  let caretItemLC = document.querySelector("div[class='field__caret']");
  let cityCaretLC = caretItemLC.cloneNode(true);
  citySubContainerLC.appendChild(cityCaretLC);
}

function CheckComunasLC() {
  if($("input[id$='checkout_id_delivery-shipping']").attr('checked') || Cookies.get('shippingJJ') === "true" ) {
    comunasLC();
  }else{

  }
}

const checkChangeContactFormLC = () => {
  setTimeout(() => {
    location.reload(true);
  }, 1500);
};

const formattingZipLC = (e, zipInputLC) => {
  zipInputLC.value = e.target.value

  if (zipInputLC.value.trim().length > 1) {
    zipInputLC.value = formattingRutLC(zipInputLC.value.trim())
  }
}

const formattingRutLC = (rutLC) => {
  let tmp = removeRutFormatLC(rutLC)
  let rut = tmp.substring(0, tmp.length - 1), f = ''

  while(rut.length > 3) {
    f = '.' + rut.substr(rut.length - 3) + f
    rut = rut.substring(0, rut.length - 3)
  }

  return (rut.trim() === '') ? '' : rut + f + '-' + tmp.charAt(tmp.length-1)
}

const removeRutFormatLC = (rut) => {
  rut = rut.split('-').join('').split('.').join('')
  return rut
}

const continueButton = document.querySelector("#continue_button");

let autocomplete;
let addressSelector;

$("input[id$='checkout_id_delivery-shipping']").change(function() {
  if ($("#checkout_id_delivery-shipping").prop("checked")) {
    Cookies.set("shippingJJ", true);
    Cookies.set("pickupJJ", false);
  }

  CheckComunasLC();
  AlertMessage()
});

$("input[id$='checkout_id_delivery-pickup']").change(function() {
  if ($("#checkout_id_delivery-pickup").prop("checked")) {
    Cookies.set("shippingJJ", false);
    Cookies.set("pickupJJ", true);
  }

  CheckComunasLC();
  AlertMessage()
});

$($("input[id$='checkout_shipping_address_company']")).change(function() {
  let RUT_length=$("input[id$='checkout_shipping_address_company']").val();
  if (RUT_length.length > 8) {
    $("#alertRUT").css({'display':'none'});
  } else {
    $("#alertRUT").css({'display':'block'});
  }
});

$("#checkout_reduction_code").change(function () {
  checkChangeContactFormLC();
});

$("button[class='tag__button']").click(function () {
  checkChangeContactFormLC();
});

$("div[data-step-footer]").click(function () {
  let RUT_length = $("input[id$='checkout_shipping_address_company']").val();

  const parent = document.querySelector("#checkout_remember_me").parentElement.parentElement.parentElement;

    if ($("input[id$='checkout_id_delivery-pickup']").prop("checked")) {

        if ($("input[id$='tycTerms']").prop("checked")) {
          continueButton.removeAttribute("disabled");
          parent.classList.remove("field--error");
        } else {
          $("#alertElementPickup").css({ display: "block" });
          $("#alertElementLC").css({ display: "block" });
        }

    } else {
      if($("#checkout_shipping_address_city option:selected").text() === "Comuna"){
        alert("Debes seleccionar tu comuna para avanzar.")
      }else{
        if(RUT_length){
          if (RUT_length.length > 8) {
            if ( $("input[id$='tycTerms']").prop("checked")) {
              continueButton.removeAttribute("disabled");
              parent.classList.remove("field--error");
            } else {
              $("#alertElementPickup").css({ display: "block" });
              $("#alertElementLC").css({ display: "block" });
            }
          } else {
            $("#alertRUT").css({ display: "block" });
            parent.classList.add("field--error");
            continueButton.setAttribute("disabled", "true");
          }
        }else{
          if ($("input[id$='tycTerms']").prop("checked")) {
            continueButton.removeAttribute("disabled");
            parent.classList.remove("field--error");
          } else {
            $("#alertElementPickup").css({ display: "block" });
            $("#alertElementLC").css({ display: "block" });
          }
        }
      }
    }

  if ($("input[id$='tycTerms']").prop("checked")) {
  } else {
    $("#alertElementPickup").css({ display: "block" });
    $("#alertElementLC").css({ display: "block" });
  }
});

$("input[id$='checkout_shipping_address_company']").bind('keypress', function(event) {
  let regex = new RegExp("^[k-kK-K0-9]+$");
  let key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
  if (!regex.test(key)) {
    event.preventDefault();
    return false;
  }
});


let zipInputLC = document.getElementById('checkout_shipping_address_company')
if(zipInputLC){
  zipInputLC.addEventListener('input', (e) => { formattingZipLC(e, zipInputLC) })
}


function digitalItem() {
  let step = Shopify.Checkout.step;

  $.get("/cart.js",function(data) {
    let LdataC = JSON.parse(data);
    if (LdataC.total_weight == 0 && LdataC.item_count == 0) {

      if (step === "payment_method" && Cookies.get("shippingJJ") === "true"){
        $(".section.section--billing-address .section__title").css({'display':'none'});
      }

      $(".section.section--billing-address").css({'display':''});
      $("#section-delivery-title").css({'display':'flex'});
      $(".section.section--billing-address .content-box").css({'display':'none'});
      $(".section.section--billing-address .section__text").css({'display':'none'});

    }else{
      if (LdataC.requires_shipping === false) {
        $(".section.section--billing-address").css({'display':''});
      } else {}
    }
  });
}

function AlertMessage() {
  if ($("input[id$='checkout_id_delivery-pickup']").attr("checked")) {
    $("div[data-delivery-pickup-info]").after(alertPickup);
  }else{
    $("#checkout_remember_me").before(alerterLtC);
  }
}

$(document).ready(function () {

  if (Cookies.get("shippingJJ")){
    $("#checkout_shipping_address_company").attr("placeholder", "RUT");
    $("label[for$='checkout_shipping_address_company']").html("RUT");
  }

  $("label[for$='checkout_shipping_address_city']").html("Comuna");
  $("input[id$='checkout_shipping_address_company']").after(alertRUT);


  $("div[data-address-field$='zip']").css("display", "none");
  $("div[data-address-field$='country']").css("display", "none");
  $("div[data-address-field$='city']").css("float", "right");
  $("div[data-address-field$='province']").removeClass("field--show-floating-label");
  $("div[data-address-field$='province']").addClass("field--half");

  function initAutocompleteLC() {
    addressSelector = document.querySelector("#checkout_shipping_address_address1");
    emailSelector = document.querySelector("#checkout_email");

    autocomplete = new google.maps.places.Autocomplete(addressSelector, {
      componentRestrictions: { country: "CL" },
      fields: ["address_components", "geometry"],
      types: ["address"],
    });
    emailSelector.focus();
    autocomplete.addListener("place_changed", fillInAddress);
  }

  function fillInAddress() {
    const place = autocomplete.getPlace();

    for (const component of place.address_components) {
      const componentType = component.types[0];

      switch (componentType) {
        case "locality":{
          document.querySelector("#checkout_shipping_address_city").value = component.long_name;
          break;
        }
        case "administrative_area_level_1": {
          let value = $("option[data-alternate-values *= '"+ component.long_name +"']")[0].value;
          document.querySelector("#checkout_shipping_address_province").value = value;
          break;
        }

      }

    }
  }

  let paso = Shopify.Checkout.step;
  if (paso === "contact_information"){
    if ($("input[id$='checkout_id_delivery-pickup']").attr("checked") || $("input[id$='checkout_id_delivery-shipping']").attr("checked") ){
      if ($("input[id$='checkout_id_delivery-shipping']").attr("checked")) {
        Cookies.set("shippingJJ", true);
        Cookies.set("pickupJJ", false);
      }
      if ($("input[id$='checkout_id_delivery-pickup']").attr("checked")) {
        Cookies.set("shippingJJ", false);
        Cookies.set("pickupJJ", true);
      }
    }else {
      digitalItem();
    }
  }else{
    digitalItem();
  }

  if ($("input[id$='checkout_id_delivery-pickup']").prop("checked") || $("input[id$='checkout_id_delivery-shipping']").prop("checked") ){

  }else {
    if(paso === "contact_information"){
      Cookies.set("shippingJJ", true);
      Cookies.set("pickupJJ", false);
    }
  }

  VerificarPickupLC();
  VerificarShippingLC();

  let ValueElement = $("#section-delivery-title").text();
  let ValueClean = ValueElement.replace(/\s+/g, '');

  if(ValueClean === "Direccióndefacturación"){
    Cookies.set("shippingJJ", false);
    Cookies.set("pickupJJ", true);
  }

  CheckComunasLC();
  AlertMessage()

  Cookies.set("ElemetLsC", mandatory_token_do_not_modify);
  initAutocompleteLC();
});
