export function getHeaderTemplate() {
  // future feature here KEKW - no way
  const headerRef = document.getElementById("header");
  headerRef.innerHTML = `
  
      <div class="header-container header-content">
        <a href="./index.html"><img id="header-logo" src="./assets/img/bestellapp_logo.png" alt="Bestellapp Logo" /></a>
        <button id="hamburger-menu" class="hidden" type="button">
          <div class="hamburger-menu-line"></div>
          <div class="hamburger-menu-line"></div>
          <div class="hamburger-menu-line"></div>
        </button>
      </div>
`;
}

export function getMenuTemplate(menu) {
  const mainContentRef = document.getElementById("main-content");
  mainContentRef.innerHTML += `
    <div id="menu-${menu.id}" class="menu">
      <button class="menu-btn lato-black" type="button">+</button>
      <h3>${menu.name}</h3>
      <p>${menu.description}</p>
      <span class="lato-bold">${menu.price.toLocaleString("de-DE", { style: "currency", currency: "EUR" })}</span>
    </div>
`;
}

export function getCategorySliderTemplate(category) {
  const categoryRef = document.getElementById("category");
  categoryRef.innerHTML += `
  <a onclick="location.href='#${category.toLowerCase()}'" class="slider-item">${category}</a>`;
}

export function getCategoryHeadlineTemplate(category) {
  const mainContentRef = document.getElementById("main-content");
  const div = document.createElement("div");
  div.id = category.toLowerCase();
  mainContentRef.appendChild(div);

  getCategoryHeaderImage(category, div);
  const h3 = document.createElement("h3");
  h3.classList.add("categoryHeadTitle");
  h3.textContent = category;
  div.appendChild(h3);
}

function getCategoryHeaderImage(category, div) {
  const img = document.createElement("img");
  switch (category.toLowerCase()) {
    case "sushi":
      img.src = "./assets/img/sushi.jpg";
      img.classList.add("categoryHeadImage");
      div.appendChild(img);
      break;
    case "suppe":
      img.src = "./assets/img/soup_bg.jpg";
      img.classList.add("categoryHeadImage");
      div.appendChild(img);
      break;
    case "nudeln":
      img.src = "./assets/img/noodles.jpg";
      img.classList.add("categoryHeadImage");
      div.appendChild(img);
      break;
    case "vorspeisen":
      img.src = "./assets/img/spring_rolls.jpg";
      img.classList.add("categoryHeadImage");
      div.appendChild(img);
      break;
    case "hauptgerichte":
      img.src = "./assets/img/teriyaki.jpg";
      img.classList.add("categoryHeadImage");
      div.appendChild(img);
      break;
    case "salate":
      img.src = "./assets/img/salat.jpg";
      img.classList.add("categoryHeadImage");
      div.appendChild(img);
      break;
    case "desserts":
      img.src = "./assets/img/desserts.png";
      img.classList.add("categoryHeadImage");
      div.appendChild(img);
      break;
    default:
      break;
  }
}

export function getFooterTemplate() {
  const footerRef = document.getElementById("footer");
  footerRef.innerHTML = `
      <div class="container footer-content">
        <img id="footer-logo" src="./assets/img/bestellapp_logo.svg" alt="Bestellapp Logo" />
        <span>Follow us</span>
        <div class="social-media-container">
          <a href="http://www.facebook.com" target="_blank">
            <img class="social-media-logos" src="./assets/icons/facebook-brands-solid.svg" alt="Facebook Logo"
          /></a>
          <a href="http://www.instagram.com" target="_blank">
            <img class="social-media-logos" src="./assets/icons/instagram-brands-solid.svg" alt="Instagram Logo"
          /></a>
          <a href="http://www.x.com" target="_blank">
            <img class="social-media-logos" src="./assets/icons/x-twitter-brands-solid.svg" alt="X Logo"
          /></a>
          <a href="https://wa.me/012315405189" target="_blank">
            <img class="social-media-logos" src="./assets/icons/whatsapp-brands-solid.svg" alt="Whatsapp Logo"
          /></a>
        </div>
      </div>
  `;
}

export function getBasketMenu(basketItems, counts) {
  const basketContent = document.getElementById("basketContent");
  const content = [];

  basketItems.forEach((item) => content.push(getBasketMenuTemplate(item, counts[item.name])));
  basketContent.innerHTML = content.join(" ");
}

function getBasketMenuTemplate(basketItem, count) {
  return `
  <div class="basket-item">
    <div class="basket-item-info">
      <span class="item-amount">${count}x</span>
      <h2 class="item-name">${basketItem.name}</h2>
      <span class="item-price">${(count * basketItem.price).toLocaleString("de-DE", {
        style: "currency",
        currency: "EUR",
      })}</span>
    </div>
    <div class="basket-item-control">
      <button class="basketControllBtn reduce" type="button">
        <img class="basketImage" src="./assets/icons/minus.svg" alt="item remove" />
      </button>
      <span>${count}</span>
      <button class="basketControllBtn add" type="button">
        <img class="basketImage" src="./assets/icons/plus.svg" alt="item add" />
      </button>
    </div>
  </div>`;
}

export function getBasketFooterTemplate(subtotal, DELIVERY_COSTS, total) {
  const basketContent = document.getElementById("basketContent");
  basketContent.innerHTML += `
  <footer id="cost-overview-container">
    <div class="cost-overview">
      <span>Zwischensumme</span>
      <span>${subtotal.toLocaleString("de-DE", {
        style: "currency",
        currency: "EUR",
      })}</span>
    </div>
    <div class="cost-overview">
      <span>Lieferkosten</span>
      <span>${DELIVERY_COSTS.toLocaleString("de-DE", {
        style: "currency",
        currency: "EUR",
      })}</span>
    </div>
    <div class="cost-overview">
      <h2>Gesamt</h2>
      <span>${total.toLocaleString("de-DE", {
        style: "currency",
        currency: "EUR",
      })}</span>
    </div>
  </footer>
`;
}
