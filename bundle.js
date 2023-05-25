document
  .querySelectorAll(".HorizontalList__Item .SizeSwatch")
  .forEach((btn) => {
    btn.addEventListener("click", function () {
      const idArray = [];
      setTimeout(function () {
        const inputs = document.querySelectorAll(
          ".HorizontalList__Item input:checked"
        );
        inputs.forEach((input) => {
          const varName = input.value;
          idArray.push(varName);
        });
        const resultVariantName = idArray.join(" / ");
        const select = document.getElementById("emHiddenVariants");
        for (var i = 0; i < select.options.length; i++) {
          let option = select.options[i];
          let optionName = option.innerHTML.trim();
          if (optionName === resultVariantName) {
            let variantID = option.getAttribute("data-varID");

            document
              .querySelectorAll(".no-js.ProductForm__Option option")
              .forEach((opt) => {
                const newFoundValue = opt.value;
                if (newFoundValue === variantID) {
                  opt.setAttribute("selected", "selected");
                } else {
                  opt.removeAttribute("selected", "selected");
                }
              });

            let currentURL = window.location.href;
            let newURL = currentURL.split("?")[0];
            if (newURL.includes("?")) {
              newURL += "&variant=" + variantID;
            } else {
              newURL += "?variant=" + variantID;
            }
            window.history.replaceState({ path: newURL }, "", newURL);
            document
              .querySelector("shopify-payment-terms")
              .setAttribute("variant-id", variantID);
          }
        }
      }, 10);
    });
  });

document.querySelectorAll(".bundle-products .pdp-list").forEach((pdp) => {
  const outOfStockID = pdp.getAttribute("data-productID");
  if (!outOfStockID) {
    pdp.classList.add("outofstock");
    const OOSBtn = pdp.querySelector(".addOnBtn");
    OOSBtn.disabled = true;
    OOSBtn.style.backgroundColor = "#cdc6c6";
    pdp.querySelector("#defaultTxt").innerHTML = "OUT OF STOCK";
  } else {
    pdp.querySelector(".addOnBtn").addEventListener("click", function () {
      const self = this;
      const cartSpinner = self.querySelector("#cartSpinner");
      const defaultTxt = self.querySelector("#defaultTxt");

      cartSpinner.style.display = "block";
      defaultTxt.innerHTML = "";
      pdp.classList.add("addOn");
      self.disabled = true;

      setTimeout(function () {
        defaultTxt.innerHTML = "ADDED TO CART";
        self.style.backgroundColor = "#cdc6c6";
        cartSpinner.style.display = "none";
      }, 1000);
    });
  }
});

const cartBtn = document.querySelector(".customAddToCart");
cartBtn.addEventListener("click", (event) => {
  const items = [];
  handleAddOnProduct(items);
  if (items.length >= 1) {
    event.preventDefault();
    handleAddOnAddToCart(items);
  }
});

function handleAddOnProduct(items) {
  document
    .querySelectorAll(".bundle-products .pdp-list.addOn")
    .forEach((addOn) => {
      const addOnID = addOn.getAttribute("data-productID");
      const result = { quantity: 1, id: addOnID };
      items.push(result);
    });
}
function handleAddOnAddToCart(items) {
  $.ajax({
    type: "POST",
    url: "/cart/add.js",
    data: { items: items },
    dataType: "json",
    success: function () {
      console.log("add");
      document.querySelector(".formWrapper").submit();
    },
  });
}
