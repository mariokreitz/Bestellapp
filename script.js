import { data } from "./data/db.js";
import {
  getHeaderTemplate,
  getCategorySliderTemplate,
  getCategoryHeadlineTemplate,
  getMenuTemplate,
  getFooterTemplate,
  getBasketMenu,
  getBasketFooterTemplate,
} from "./scripts/template.js";

const MOBILE_SCROLL_FACTOR = 17;
const DELIVERY_COSTS = 2.0;
const FREE = 0;

document.addEventListener("DOMContentLoaded", () => {
  loadHeader();
  loadCategorySlider();
  loadMenu();
  loadFooter();
  loadDesktopBasket();
});

function loadHeader() {
  getHeaderTemplate();
}

function loadCategorySlider() {
  const uniqueCategory = getUniqueCategory();
  uniqueCategory.forEach((category) => getCategorySliderTemplate(category));
}

function loadMenu() {
  const uniqueCategory = getUniqueCategory();
  uniqueCategory.forEach((category) => {
    getCategoryHeadlineTemplate(category);
    getCategorisedMenus(category);
  });
  addClickFunction();
}

function getCategorisedMenus(category) {
  const menus = data.filter((menu) => menu.category === category);
  menus.forEach((menu) => getMenuTemplate(menu));
}

function loadFooter() {
  getFooterTemplate();
}

function loadDesktopBasket() {
  if (window.innerWidth <= 1024) return;
  addRadioButtonFunction();
  addBasketButtonObserver();
  basketRef.classList.add("show");
  basektOpenBtn.innerHTML = `Bezahlen ${total.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
  })}`;
  getBasketFooterTemplate(subtotal, isDelivery ? DELIVERY_COSTS : FREE, total);
  isCheckout = true;
}

function getUniqueCategory() {
  return new Set(data.map((menu) => menu.category));
}
/**############################################
 * #                                          #
 * #   START OF THE  SLIDER LOGIC             #
 * #     [  DESKTOP && MOBILE ]               #
 * #                                          #
 * ############################################
 */
let isDragging = false;
let clientX;

const categoryContentRef = document.getElementById("category-content");

if (isBrowserMobile()) {
  categoryContentRef.addEventListener("touchstart", startMobile);
  categoryContentRef.addEventListener("touchmove", draggingMobile);
} else {
  categoryContentRef.addEventListener("mousedown", toggleDragging);
  categoryContentRef.addEventListener("mousemove", dragging);
  document.addEventListener("mouseup", toggleDragging);
}

function isBrowserMobile() {
  const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
}

function dragging(event) {
  if (!isDragging) return;
  categoryContentRef.scrollLeft -= event.movementX;
}

function toggleDragging() {
  isDragging = !isDragging;
}

function startMobile(e) {
  clientX = e.touches[0].clientX;
}

function draggingMobile(e) {
  let deltaX = e.changedTouches[0].clientX - clientX;
  categoryContentRef.scrollLeft -= deltaX / MOBILE_SCROLL_FACTOR;
}
/**############################################
 * #                                          #
 * #             MENU INTO BASKET             #
 * #                                          #
 * #                                          #
 * ############################################
 */
let counts = {};
let basket = [];

function addClickFunction() {
  const menuRef = document.querySelectorAll(".menu-btn");
  menuRef.forEach((menu, index) => menu.addEventListener("click", (event) => addToBasket(index, event)));
}

function addToBasket(idx, event) {
  basket.push(data[idx]);

  countDuplicatesInBasket();
  const uniqueItemsInBasket = removeDuplicatesFromBasket();
  renderBasketContent(uniqueItemsInBasket, event);
  if (window.innerWidth >= 1024) {
    basektOpenBtn.innerHTML = `Bezahlen ${total.toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
    })}`;
  } else {
    basektOpenBtn.innerHTML = `&#128722; Warenkorb ${total.toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
    })}`;
  }
}
/**############################################
 * #                                          #
 * #                BASKET                    #
 * #                                          #
 * #                                          #
 * ############################################
 */
let isDelivery = true;
let isCheckout = false;

const basketRef = document.getElementById("basket");
const basektOpenBtn = document.getElementById("basektOpenBtn");
const basketCloseBtnRef = document.getElementById("basketCloseBtn");
const deliverOption = document.getElementById("deliverOption");
const basketOptionsRef = document.getElementsByName("option");
const successScreen = document.getElementById("successPayment");

basektOpenBtn.addEventListener("click", openBasket);
basketCloseBtnRef.addEventListener("click", closeBasket);

function openBasket() {
  basketRef.classList.add("show");
  if (basket[0]) deliverOption.classList.remove("hidden");
  if (basketRef.classList.contains("show")) {
    addRadioButtonFunction();
    basektOpenBtn.classList.add("active");
    basektOpenBtn.innerHTML = `Bezahlen ${total.toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
    })}`;
  }
  if (basektOpenBtn.classList.contains("active")) {
    checkBasketForPayment();
  }
}

function checkBasketForPayment() {
  if (!basket[0]) return;
  if (window.innerWidth >= 1024) isCheckout = true;

  let buttonContent = document.getElementById("basektOpenBtn").innerHTML;
  const regex = new RegExp("Bezahlen");
  let isPayment = regex.test(buttonContent);
  if (isCheckout && isPayment) {
    executePayment();
    showSuccessScreen();
    removeSuccessScreen();
  } else if (!isCheckout && isPayment) {
    isCheckout = !isCheckout;
  }
}

function executePayment() {
  setTimeout(() => {
    resetBasket();
    closeBasket();
  }, 1000);
}

function resetBasket() {
  const basketContent = document.getElementById("basketContent");
  basketContent.innerHTML = "";
  deliverOption.classList.add("hidden");
  counts = {};
  basket = [];
  subtotal = [];
  total = 0;
  basektOpenBtn.innerHTML = "&#128722; Warenkorb";
}

function showSuccessScreen() {
  setTimeout(() => {
    successScreen.classList.remove("hidden");
  }, 1650);
  isCheckout = false;
}

function removeSuccessScreen() {
  setTimeout(() => {
    successScreen.classList.add("hidden");
  }, 3650);
}

function addRadioButtonFunction() {
  basketOptionsRef.forEach((radio) => radio.addEventListener("click", deliverOrPickUp));
}

function getReduceButtonControl() {
  const basketControllBtnReduce = document.querySelectorAll("button.basketControllBtn.reduce");
  basketControllBtnReduce.forEach((reduceBtn, index) =>
    reduceBtn.addEventListener("click", (event) => reduceBasketItem(index, event))
  );
}

function getAddButtonControl() {
  const basketControllBtnAdd = document.querySelectorAll("button.basketControllBtn.add");
  basketControllBtnAdd.forEach((addBtn, index) =>
    addBtn.addEventListener("click", (event) => addBasketItem(index, event))
  );
}

function reduceBasketItem(index, event) {
  const itemName = document.querySelectorAll(".item-name")[index].innerHTML;
  --counts[itemName];

  let sameMenu = getSameItemMenu(itemName);
  let menufound = basket.find((menu) => menu == sameMenu);
  let menuIndex = basket.indexOf(menufound);

  if (menuIndex !== -1) basket.splice(menuIndex, 1);
  const uniqueItemsInBasket = removeDuplicatesFromBasket();

  reRender(uniqueItemsInBasket, event);
}

function addBasketItem(index, event) {
  const itemName = document.querySelectorAll(".item-name")[index].innerHTML;
  const uniqueItemsInBasket = removeDuplicatesFromBasket();
  ++counts[itemName];

  let sameMenu = getSameItemMenu(itemName);
  basket.push(sameMenu);

  reRender(uniqueItemsInBasket, event);
}

function getSameItemMenu(itemName) {
  let namesFromMenu = data.map((item) => item.name);
  let filteredMenu = namesFromMenu.filter((x) => x == itemName);
  let sameMenu = data.find((menu) => menu.name == filteredMenu);
  return sameMenu;
}

function reRender(uniqueItemsInBasket, event) {
  renderBasketContent(uniqueItemsInBasket, event);
  basektOpenBtn.innerHTML = `Bezahlen ${total.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
  })}`;
}

function deliverOrPickUp(event) {
  const uniqueItemsInBasket = removeDuplicatesFromBasket();
  renderBasketContent(uniqueItemsInBasket, event);
  basektOpenBtn.innerHTML = `Bezahlen ${total.toLocaleString("de-DE", { style: "currency", currency: "EUR" })}`;
}

function closeBasket() {
  basektOpenBtn.classList.remove("active");
  basketRef.classList.remove("show");
  if (isCheckout) {
    basektOpenBtn.innerHTML = "&#128722; Warenkorb";
  }
  basektOpenBtn.innerHTML = `&#128722; Warenkorb ${total.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
  })}`;
  isCheckout = false;
}

function countDuplicatesInBasket() {
  counts = {};
  basket.forEach((menuItem) => {
    counts[menuItem.name] = (counts[menuItem.name] || 0) + 1;
  });
}

function removeDuplicatesFromBasket() {
  basket.sort((a, b) => a.id - b.id);
  return new Set(basket.map((item) => item));
}

function renderBasketContent(uniqueBasketItems, event) {
  getBasketMenu(uniqueBasketItems, counts);
  calculateSubtotal();
  calculateTotal(event);
  getBasketFooterTemplate(subtotal, isDelivery ? DELIVERY_COSTS : FREE, total);
  getReduceButtonControl();
  getAddButtonControl();
}

let subtotal = [];
let total = 0;

function calculateSubtotal() {
  let sub = basket.map((item) => item.price);
  subtotal = sub.reduce((acc, item) => (acc += item), 0);
}

function calculateTotal(event = null) {
  if (event) {
    if (basketOptionsRef[0] == event.target) {
      isDelivery = true;
      total = subtotal + DELIVERY_COSTS;
    } else if (basketOptionsRef[1] == event.target) {
      isDelivery = false;
      total = subtotal;
    } else if (event && !isDelivery) {
      isDelivery = false;
      total = subtotal;
    } else total = subtotal + DELIVERY_COSTS;
  }
}
/**############################################
 * #                                          #
 * #         BASKET BUTTON OBSERVER           #
 * #                                          #
 * #                                          #
 * ############################################
 */
function addBasketButtonObserver() {
  document.addEventListener("scroll", function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollThreshold = 200;
    if (scrollTop === 0) basektOpenBtn.style.top = 91.5 + "%";
    else if (scrollTop > scrollThreshold) {
      const footer = document.querySelector("footer");
      const footerTop = footer.getBoundingClientRect().top;
      const viewportHeight = window.innerHeight;
      const buttonTopPercentage = 165;
      const buttonTopInPixels = (buttonTopPercentage / 100) * viewportHeight;
      if (footerTop < viewportHeight) {
        const offset = viewportHeight - footerTop;
        // basektOpenBtn.style.top = `${Math.max(buttonTopInPixels, offset)}px`;
        basektOpenBtn.style.top = `${buttonTopInPixels - offset}px`;
      }
    }
  });
}
