const defaultBooks = [
  { id: 1, title: "1984", author: "Джордж Оруэлл", genre: "Роман", cover: "assets/book-1984.jpg" },
  { id: 2, title: "100 рассказов из истории медицины", author: "Михаил Шифрин", genre: "Медицина", cover: "assets/book-medicine.jpg" },
  { id: 3, title: "Действуй!", author: "Ицхак Пинтосевич", genre: "Бизнес", cover: "assets/book-action.jpg" },
  { id: 4, title: "Достижение максимума", author: "Брайан Трейси", genre: "Бизнес", cover: "assets/book-maximum.jpg" },
  { id: 5, title: "НИ СЫ", author: "Джен Синсеро", genre: "Психология", cover: "assets/book-nisy.jpg" },
  { id: 6, title: "451° по Фаренгейту", author: "Рэй Брэдбери", genre: "Фантастика", cover: "assets/book-451.jpg" },
  { id: 7, title: "Триллионер действует", author: "Ицхак Пинтосевич", genre: "Бизнес", cover: "assets/book-trillioner.jpg" },
  { id: 8, title: "Триллионер думает", author: "Ицхак Пинтосевич", genre: "Бизнес", cover: "assets/book-thinks.jpg" },
  { id: 9, title: "Мастер и Маргарита", author: "Михаил Булгаков", genre: "Классика", cover: "assets/book-master.jpg", description: "Роман о добре и зле, любви, свободе и человеческом выборе." },
  { id: 10, title: "Преступление и наказание", author: "Фёдор Достоевский", genre: "Классика", cover: "assets/book-crime.jpg", description: "Психологический роман о преступлении, совести и внутренней борьбе человека." },
  { id: 11, title: "Шерлок Холмс", author: "Артур Конан Дойл", genre: "Детектив", cover: "assets/book-sherlock.jpg", description: "Сборник детективных историй о знаменитом сыщике и его расследованиях." },
  { id: 12, title: "Алхимик", author: "Пауло Коэльо", genre: "Роман", cover: "assets/book-alchemist.jpg", description: "История о мечте, пути человека и поиске своего предназначения." },
  { id: 13, title: "Гарри Поттер", author: "Джоан Роулинг", genre: "Фантастика", cover: "assets/book-harry.jpg", description: "Фантастическая история о школе магии, дружбе и борьбе со злом." },
  { id: 14, title: "Думай медленно... решай быстро", author: "Даниэль Канеман", genre: "Психология", cover: "assets/book-thinking.jpg", description: "Книга о мышлении, принятии решений и ошибках человеческого разума." },
  { id: 15, title: "Богатый папа, бедный папа", author: "Роберт Кийосаки", genre: "Бизнес", cover: "assets/book-rich-dad.jpg", description: "Книга о финансовом мышлении, деньгах, активах и личных финансах." },
  { id: 16, title: "Абай жолы", author: "Мухтар Ауэзов", genre: "Роман", cover: "assets/book-abai.jpg", description: "Историко-эпический роман о жизни Абая и казахском обществе." }
];

const defaultPlans = [
  {
    id: 1,
    name: "Недельный абонемент",
    price: 599,
    features: [
      "Доступ ко всем электронным книгам",
      "Чтение без ограничений 7 дней",
      "Новые поступления каждую неделю",
      "Поддержка пользователей на сайте"
    ]
  },
  {
    id: 2,
    name: "Месячный абонемент",
    price: 899,
    features: [
      "Полный доступ ко всей библиотеке",
      "Безлимитное чтение 30 дней",
      "Доступ к эксклюзивным книгам",
      "Сохранение избранных книг",
      "Приоритетная поддержка"
    ]
  }
];

let books = JSON.parse(localStorage.getItem("books")) || defaultBooks;
defaultBooks.forEach(defaultBook => {
  const exists = books.some(book => book.title === defaultBook.title);
  if (!exists) books.push(defaultBook);
});
localStorage.setItem("books", JSON.stringify(books));

let plans = JSON.parse(localStorage.getItem("subscriptionPlans")) || defaultPlans;
defaultPlans.forEach(defaultPlan => {
  const exists = plans.some(plan => plan.name === defaultPlan.name);
  if (!exists) plans.push(defaultPlan);
});
localStorage.setItem("subscriptionPlans", JSON.stringify(plans));

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentPage = "home";
let pageHistory = [];
let selectedBookId = null;

const pages = document.querySelectorAll(".page");
const globalPrevBtn = document.getElementById("globalPrevBtn");
const globalNextBtn = document.getElementById("globalNextBtn");
const pageOrder = ["home", "about", "catalog", "bookDetail", "search", "wallet", "profile", "subscriptions", "cart", "reader"];
const publicPages = ["home", "login", "register", "about"];

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, symbol => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  }[symbol]));
}

function isLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true";
}

function getRole() {
  return localStorage.getItem("role") || "user";
}

function canOpenPage(pageId) {
  if (publicPages.includes(pageId)) return true;
  if (!isLoggedIn()) return false;

  const role = getRole();
  if (pageId === "admin") return role === "admin";
  if (pageId === "seller") return role === "seller" || role === "admin";
  return true;
}

function openRolePanel() {
  const role = getRole();

  if (role === "admin") return showPage("admin");
  if (role === "seller") return showPage("seller");
  showPage("profile");
}

function saveBooks() {
  localStorage.setItem("books", JSON.stringify(books));
}

function savePlans() {
  localStorage.setItem("subscriptionPlans", JSON.stringify(plans));
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function showPage(pageId, saveHistory = true) {
  const page = document.getElementById(pageId);
  if (!page || pageId === currentPage) return;

  if (!canOpenPage(pageId)) {
    if (!isLoggedIn()) {
      document.getElementById("loginNotice").textContent = "Сначала войдите в аккаунт";
      pageHistory = [];
      showPage("login", false);
    } else {
      alert("У вашей роли нет доступа к этой странице");
    }
    return;
  }

  if (saveHistory && currentPage !== "login" && currentPage !== "register") {
    pageHistory.push(currentPage);
  }

  pages.forEach(item => item.classList.remove("active"));
  page.classList.add("active");
  currentPage = pageId;

  const showArrows = pageId !== "home";
  globalPrevBtn.style.display = showArrows ? "block" : "none";
  globalNextBtn.style.display = showArrows ? "block" : "none";

  if (pageId === "catalog") renderCatalog();
  if (pageId === "search") renderSearch();
  if (pageId === "cart") renderCart();
  if (pageId === "subscriptions") renderSubscriptions();
  if (pageId === "admin") {
    renderAdmin();
    updateAdminPreview();
  }
  if (pageId === "seller") renderSeller();
  if (pageId === "profile") renderProfile();

  window.scrollTo(0, 0);
}

function bindNavigation() {
  document.querySelectorAll("[data-page]").forEach(button => {
    button.addEventListener("click", () => {
      if (button.dataset.page === "profile") {
        openRolePanel();
      } else {
        showPage(button.dataset.page);
      }
    });
  });

  globalPrevBtn.addEventListener("click", () => {
    let previousPage = pageHistory.pop() || "catalog";

    while ((previousPage === "login" || previousPage === "register") && pageHistory.length) {
      previousPage = pageHistory.pop();
    }

    if (previousPage === "login" || previousPage === "register") previousPage = "catalog";
    showPage(previousPage, false);
  });

  globalNextBtn.addEventListener("click", () => {
    const currentIndex = pageOrder.indexOf(currentPage);
    const nextPage = pageOrder[currentIndex + 1] || "catalog";
    showPage(nextPage);
  });

  globalPrevBtn.style.display = "none";
  globalNextBtn.style.display = "none";
}

function coverHtml(book, extraClass = "") {
  const safeTitle = escapeHtml(book.title);
  const fallbackClass = book.title.includes("Действ") || book.title.includes("Триллионер")
    ? "red"
    : book.title.includes("НИ")
      ? "white"
      : book.title.includes("451")
        ? "dark"
        : "";

  return `
    <div class="book-card ${extraClass}" onclick="openBook(${book.id})">
      <img src="${book.cover || ""}" alt="${safeTitle}" onerror="this.outerHTML='<div class=&quot;cover-fallback ${fallbackClass}&quot;>${safeTitle}</div>'" />
    </div>
  `;
}

function renderCatalog() {
  document.getElementById("catalogGrid").innerHTML = books.map(book => coverHtml(book)).join("");
}

function openBook(id) {
  showBookDetail(id);
}

function getBookDescription(book) {
  if (book.title === "1984") {
    return `
      <p>Эта книга 1984 года.<br />Автор: Джордж Оруэлл.</p>
      <p>Роман показывает будущее тоталитарного государства, где власть полностью контролирует людей.<br />Главный герой — Уинстон Смит.</p>
      <p>Жанр<br />• антиутопия;<br />• политический роман;<br />• социальная фантастика.</p>
    `;
  }

  if (book.description) {
    return `
      <p>Эта книга: ${escapeHtml(book.title)}.<br />Автор: ${escapeHtml(book.author)}.</p>
      <p>${escapeHtml(book.description)}</p>
      <p>Жанр<br />• ${escapeHtml(book.genre)};<br />• электронная книга.</p>
    `;
  }

  return `
    <p>Эта книга: ${escapeHtml(book.title)}.<br />Автор: ${escapeHtml(book.author)}.</p>
    <p>Книга доступна для онлайн-чтения и добавления в корзину.</p>
    <p>Жанр<br />• ${escapeHtml(book.genre)};<br />• электронная книга;<br />• популярная литература.</p>
  `;
}

function showBookDetail(id) {
  const book = books.find(item => item.id === id);
  if (!book) return;

  selectedBookId = id;
  const safeTitle = escapeHtml(book.title);
  document.getElementById("bookDetailCover").innerHTML = `
    <img src="${book.cover || ""}" alt="${safeTitle}" onerror="this.outerHTML='<div class=&quot;book-detail-fallback&quot;>${safeTitle}</div>'" />
  `;
  document.getElementById("bookDetailText").innerHTML = getBookDescription(book);
  document.getElementById("bookDetailNotice").textContent = "";
  showPage("bookDetail");
}

function readBook(id) {
  const book = books.find(item => item.id === id);
  if (!book) return;
  document.getElementById("readerText").innerHTML = `
    <b>${escapeHtml(book.title)}</b><br><br>
    Автор: ${escapeHtml(book.author)}<br>
    Жанр: ${escapeHtml(book.genre)}<br><br>
    Это демонстрационная страница онлайн-чтения. Здесь можно разместить полный текст книги или PDF.
  `;
  showPage("reader");
}

function renderSearch() {
  const search = document.getElementById("searchInput").value.toLowerCase().trim();
  const genre = document.getElementById("genreFilter").value;

  const filtered = books.filter(book => {
    const textOk = book.title.toLowerCase().includes(search)
      || book.author.toLowerCase().includes(search)
      || book.genre.toLowerCase().includes(search);
    const genreOk = genre === "all" || book.genre === genre;
    return textOk && genreOk;
  });

  document.getElementById("searchResults").innerHTML = filtered.map(book => `
    <div class="small-book">
      <h3>${escapeHtml(book.title)}</h3>
      <p>${escapeHtml(book.author)}<br>${escapeHtml(book.genre)}</p>
      <button class="btn" onclick="addToCart(${book.id})">В корзину</button>
    </div>
  `).join("") || "<p>Книги не найдены.</p>";
}

function addToCart(id) {
  const book = books.find(item => item.id === id);
  if (!book) return;
  cart.push(book.title);
  saveCart();
  alert("Книга добавлена в корзину: " + book.title);
}

function renderCart() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && !document.getElementById("orderPhone").value) {
    document.getElementById("orderPhone").value = user.phone || "";
  }

  const cartList = document.getElementById("cartList");
  const titles = cart.length ? cart : ["1984"];

  cartList.innerHTML = titles.map(title => {
    const book = books.find(item => item.title === title) || books[0];
    const safeTitle = escapeHtml(book.title);
    return `
      <div class="cart-book-box">
        <img class="cart-cover" src="${book.cover || ""}" alt="${safeTitle}" onerror="this.outerHTML='<div class=&quot;cart-cover-fallback&quot;>${safeTitle}</div>'" />
        <div class="cart-book-info">
          <p>Книга ${safeTitle} года.</p>
          <p>Автор: ${escapeHtml(book.author)}.</p>
        </div>
        <div class="cart-actions">
          <button class="btn" onclick="orderSingleBook('${safeTitle.replace(/'/g, "\\'")}')">Заказать</button>
          <button class="btn" onclick="readBook(${book.id})">Читать онлайн</button>
        </div>
      </div>
    `;
  }).join("");
}

function orderSingleBook(title) {
  const address = document.getElementById("orderAddress").value.trim();
  const phone = document.getElementById("orderPhone").value.trim();

  if (!address || !phone) {
    document.getElementById("orderNotice").textContent = "Заполните адрес доставки и телефонный номер";
    return;
  }

  const orders = JSON.parse(localStorage.getItem("ordersList")) || [];
  orders.push({
    book: title,
    address,
    phone,
    date: new Date().toLocaleString("ru-RU")
  });
  localStorage.setItem("ordersList", JSON.stringify(orders));
  document.getElementById("orderNotice").textContent = "Заказ оформлен";
}

function registerUser() {
  const user = {
    name: document.getElementById("regName").value.trim(),
    surname: document.getElementById("regSurname").value.trim(),
    age: document.getElementById("regAge").value.trim(),
    email: document.getElementById("regEmail").value.trim(),
    phone: document.getElementById("regPhone").value.trim(),
    password: document.getElementById("regPass").value.trim()
  };

  if (!user.name || !user.surname || !user.age || !user.email || !user.phone || !user.password) {
    document.getElementById("registerNotice").textContent = "Заполните все поля";
    return;
  }

  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("role", "user");
  pageHistory = [];
  document.getElementById("registerNotice").textContent = "Регистрация прошла успешно";
  setTimeout(() => showPage("catalog", false), 700);
}

function loginUser() {
  const login = document.getElementById("loginInput").value.trim();
  const pass = document.getElementById("passwordInput").value.trim();
  const user = JSON.parse(localStorage.getItem("user"));

  if (login === "admin" && pass === "30.08.2005") {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", "admin");
    pageHistory = [];
    document.getElementById("loginNotice").textContent = "Вход выполнен как админ";
    setTimeout(() => showPage("admin", false), 350);
    return;
  }

  if (login === "seller" && pass === "30.08.2005") {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", "seller");
    pageHistory = [];
    document.getElementById("loginNotice").textContent = "Вход выполнен как продавец";
    setTimeout(() => showPage("seller", false), 350);
    return;
  }

  if (user && (login === user.name || login === user.email) && pass === user.password) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", "user");
    pageHistory = [];
    document.getElementById("loginNotice").textContent = "Вход выполнен";
    setTimeout(() => showPage("catalog", false), 350);
  } else {
    document.getElementById("loginNotice").textContent = "Неверный логин или пароль";
  }
}

function saveCard() {
  const holder = document.getElementById("cardHolder").value.trim();
  const number = document.getElementById("cardNumber").value.trim();
  const date = document.getElementById("cardDate").value.trim();
  const cvc = document.getElementById("cardCvc").value.trim();

  if (!holder || number.length < 19 || date.length < 5 || cvc.length < 3) {
    document.getElementById("cardNotice").textContent = "Введите ФИО и данные карты полностью";
    return;
  }

  localStorage.setItem("bankCard", JSON.stringify({ holder, number, date }));
  document.getElementById("cardNotice").textContent = "Карта успешно привязана";

  const pendingPlan = JSON.parse(localStorage.getItem("pendingPlan"));
  if (pendingPlan) {
    localStorage.removeItem("pendingPlan");
    setTimeout(() => {
      showPage("subscriptions", false);
      payForSubscription(pendingPlan.name, pendingPlan.price);
    }, 700);
    return;
  }

  setTimeout(() => showPage("catalog", false), 700);
}

function formatCardInputs() {
  document.getElementById("cardNumber").addEventListener("input", event => {
    event.target.value = event.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
  });

  document.getElementById("cardDate").addEventListener("input", event => {
    event.target.value = event.target.value.replace(/\D/g, "").replace(/^(\d{2})(\d)/, "$1/$2").slice(0, 5);
  });

  document.getElementById("cardCvc").addEventListener("input", event => {
    event.target.value = event.target.value.replace(/\D/g, "").slice(0, 3);
  });
}

function payForSubscription(planName, planPrice) {
  const card = JSON.parse(localStorage.getItem("bankCard"));
  const user = JSON.parse(localStorage.getItem("user"));

  if (!card) {
    localStorage.setItem("pendingPlan", JSON.stringify({ name: planName, price: planPrice }));
    document.getElementById("planNotice").textContent = "Сначала привяжите карту для оплаты абонемента";
    setTimeout(() => showPage("wallet"), 700);
    return;
  }

  const subscriptionText = `${planName} — ${planPrice} сом`;
  localStorage.setItem("subscription", subscriptionText);

  const payments = JSON.parse(localStorage.getItem("paymentsList")) || [];
  payments.push({
    type: "Абонемент",
    name: planName,
    price: planPrice,
    user: user ? `${user.name} ${user.surname}` : "Пользователь",
    phone: user ? user.phone : "не указан",
    cardHolder: card.holder,
    date: new Date().toLocaleString("ru-RU")
  });
  localStorage.setItem("paymentsList", JSON.stringify(payments));

  document.getElementById("planNotice").textContent = `Оплата прошла успешно: ${subscriptionText}`;
  setTimeout(() => showPage("profile", false), 900);
}

function renderSubscriptions() {
  const container = document.getElementById("subscriptionCards");
  container.innerHTML = plans.map(plan => `
    <div class="subs-card">
      <p>
        ${escapeHtml(plan.name)}<br />
        — ${plan.price} сом<br />
        ${plan.features.map(feature => "✓ " + escapeHtml(feature)).join("<br />")}
      </p>
      <button class="btn" onclick="selectSubscriptionPlan(${plan.id})">Получить</button>
    </div>
  `).join("");
}

function selectSubscriptionPlan(id) {
  const plan = plans.find(item => item.id === id);
  if (!plan) return;
  payForSubscription(plan.name, plan.price);
}

function renderSeller() {
  const orders = JSON.parse(localStorage.getItem("ordersList")) || [];
  const user = JSON.parse(localStorage.getItem("user"));
  const subscription = localStorage.getItem("subscription") || "Нет";

  document.getElementById("sellerOrdersCount").textContent = orders.length;
  document.getElementById("sellerBooksCount").textContent = books.length;
  document.getElementById("sellerSubsCount").textContent = subscription === "Нет" ? "0" : "1";

  document.getElementById("sellerOrdersList").innerHTML = orders.length ? orders.map((order, index) => `
    <div class="admin-row">
      <span>${index + 1}. ${escapeHtml(order.book)}<br><small>${order.date}</small><br><small>Адрес: ${escapeHtml(order.address || "не указан")}</small><br><small>Телефон: ${escapeHtml(order.phone || "не указан")}</small></span>
      <button class="btn" onclick="sellerCompleteOrder(${index})">Выдано</button>
    </div>
  `).join("") : "<p>Заказов пока нет.</p>";

  document.getElementById("sellerUserInfo").innerHTML = user ? `
    <div class="profile-info-row"><span>Имя</span><span>${escapeHtml(user.name)}</span></div>
    <div class="profile-info-row"><span>Телефон</span><span>${escapeHtml(user.phone)}</span></div>
    <div class="profile-info-row"><span>Email</span><span>${escapeHtml(user.email)}</span></div>
    <div class="profile-info-row"><span>Абонемент</span><span>${escapeHtml(subscription)}</span></div>
  ` : "<p>Пользователь пока не зарегистрирован.</p>";
}

function sellerCompleteOrder(index) {
  const orders = JSON.parse(localStorage.getItem("ordersList")) || [];
  orders.splice(index, 1);
  localStorage.setItem("ordersList", JSON.stringify(orders));
  renderSeller();
}

function renderProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const logged = localStorage.getItem("isLoggedIn") === "true";
  const profileInfo = document.getElementById("profileInfo");
  const profileHistory = document.getElementById("profileHistory");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!logged || !user) {
    profileInfo.innerHTML = "<p style='text-align:center;margin:0 0 12px;'>Вы ещё не вошли в аккаунт.</p><button class='btn' onclick='showPage(\"login\")'>Войти</button>";
    profileHistory.innerHTML = "<p style='text-align:center;margin:0;'>История появится после входа.</p>";
    logoutBtn.style.display = "none";
    return;
  }

  logoutBtn.style.display = "block";

  const card = JSON.parse(localStorage.getItem("bankCard"));
  const subscription = localStorage.getItem("subscription") || "Нет абонемента";
  const cardText = card ? "Карта привязана" : "Карта не привязана";

  profileInfo.innerHTML = `
    <div class="profile-info-row"><span>Имя</span><span>${escapeHtml(user.name)}</span></div>
    <div class="profile-info-row"><span>Фамилия</span><span>${escapeHtml(user.surname)}</span></div>
    <div class="profile-info-row"><span>Возраст</span><span>${escapeHtml(user.age)}</span></div>
    <div class="profile-info-row"><span>Email</span><span>${escapeHtml(user.email)}</span></div>
    <div class="profile-info-row"><span>Телефон</span><span>${escapeHtml(user.phone)}</span></div>
    <div class="profile-info-row"><span>Карта</span><span>${cardText}</span></div>
    <div class="profile-info-row"><span>Абонемент</span><span>${escapeHtml(subscription)}</span></div>
  `;

  const lastTitle = cart[cart.length - 1] || "100 рассказов из истории медицины";
  const lastBook = books.find(book => book.title === lastTitle) || books[1] || books[0];

  profileHistory.innerHTML = `
    <div class="history-item">
      <img class="history-cover" src="${lastBook.cover || ""}" alt="${escapeHtml(lastBook.title)}" onerror="this.style.display='none'" />
      <div>
        <b>Книга</b>: ${escapeHtml(lastBook.title)}<br />
        <b>Автор</b>: ${escapeHtml(lastBook.author)}
      </div>
    </div>
  `;
}

function logoutAccount() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("role");
  pageHistory = [];
  showPage("home", false);
}

function clearAdminForm() {
  document.getElementById("adminEditId").value = "";
  document.getElementById("adminTitle").value = "";
  document.getElementById("adminAuthor").value = "";
  document.getElementById("adminGenre").value = "Роман";
  document.getElementById("adminCover").value = "";
  document.getElementById("adminDescription").value = "";
  document.getElementById("saveBookBtn").textContent = "Сохранить";
  updateAdminPreview();
}

function updateAdminPreview() {
  const title = document.getElementById("adminTitle").value.trim() || "Название книги";
  const author = document.getElementById("adminAuthor").value.trim() || "Автор";
  const genre = document.getElementById("adminGenre").value || "Жанр";
  const cover = document.getElementById("adminCover").value.trim();
  const description = document.getElementById("adminDescription").value.trim() || "Описание книги появится здесь.";
  const safeTitle = escapeHtml(title);

  document.getElementById("adminPreview").innerHTML = `
    <div class="admin-preview-book">
      ${cover ? `<img class="admin-preview-cover" src="${cover}" alt="${safeTitle}" onerror="this.outerHTML='<div class=&quot;admin-preview-cover cover-fallback&quot;>${safeTitle}</div>'" />` : `<div class="admin-preview-cover cover-fallback">${safeTitle}</div>`}
      <div class="admin-preview-text">
        <p><b>${safeTitle}</b></p>
        <p>Автор: ${escapeHtml(author)}</p>
        <p>Жанр: ${escapeHtml(genre)}</p>
        <p>${escapeHtml(description)}</p>
      </div>
    </div>
  `;
}

function renderAdmin() {
  renderAdminPlans();

  document.getElementById("adminList").innerHTML = books.map(book => `
    <div class="admin-list-item">
      <img class="admin-list-cover" src="${book.cover || ""}" alt="${escapeHtml(book.title)}" onerror="this.style.display='none'" />
      <div>
        <b>${escapeHtml(book.title)}</b><br />
        Автор: ${escapeHtml(book.author)}<br />
        Жанр: ${escapeHtml(book.genre)}
      </div>
      <div class="admin-list-actions">
        <button class="btn" onclick="editBook(${book.id})">Изменить</button>
        <button class="btn admin-danger" onclick="deleteBook(${book.id})">Удалить</button>
      </div>
    </div>
  `).join("");

  const user = JSON.parse(localStorage.getItem("user"));
  const card = JSON.parse(localStorage.getItem("bankCard"));
  const subscription = localStorage.getItem("subscription") || "Нет абонемента";

  document.getElementById("adminUserList").innerHTML = user ? `
    <div class="profile-info-row"><span>Имя</span><span>${escapeHtml(user.name)}</span></div>
    <div class="profile-info-row"><span>Фамилия</span><span>${escapeHtml(user.surname)}</span></div>
    <div class="profile-info-row"><span>Email</span><span>${escapeHtml(user.email)}</span></div>
    <div class="profile-info-row"><span>Телефон</span><span>${escapeHtml(user.phone)}</span></div>
    <div class="profile-info-row"><span>Абонемент</span><span>${escapeHtml(subscription)}</span></div>
    <div class="profile-info-row"><span>Карта</span><span>${card ? "Привязана" : "Нет"}</span></div>
    <button class="btn admin-danger" onclick="deleteUser()" style="margin-top:10px;">Удалить пользователя</button>
  ` : "<p>Пользователь пока не зарегистрирован.</p>";

  const orders = JSON.parse(localStorage.getItem("ordersList")) || [];
  const payments = JSON.parse(localStorage.getItem("paymentsList")) || [];
  const ordersHtml = orders.length ? orders.map((order, index) => `
    <div class="admin-row">
      <span>${index + 1}. ${escapeHtml(order.book)}<br><small>${order.date}</small><br><small>Адрес: ${escapeHtml(order.address || "не указан")}</small><br><small>Телефон: ${escapeHtml(order.phone || "не указан")}</small></span>
      <button class="btn admin-danger" onclick="deleteOrder(${index})">Удалить</button>
    </div>
  `).join("") : "<p>Заказов пока нет.</p>";

  const paymentsHtml = payments.length ? payments.map((payment, index) => `
    <div class="admin-row">
      <span>${index + 1}. ${escapeHtml(payment.name)}<br><small>Сумма: ${payment.price} сом</small><br><small>Покупатель: ${escapeHtml(payment.user)}</small><br><small>Телефон: ${escapeHtml(payment.phone)}</small><br><small>${payment.date}</small></span>
      <button class="btn admin-danger" onclick="deletePayment(${index})">Удалить</button>
    </div>
  `).join("") : "<p>Оплат абонементов пока нет.</p>";

  document.getElementById("adminOrdersList").innerHTML = ordersHtml + "<h3 style='margin-top:16px;'>Оплаты абонементов</h3>" + paymentsHtml;
}

function clearPlanForm() {
  document.getElementById("adminPlanEditId").value = "";
  document.getElementById("adminPlanName").value = "";
  document.getElementById("adminPlanPrice").value = "";
  document.getElementById("adminPlanFeatures").value = "";
  document.getElementById("savePlanBtn").textContent = "Сохранить абонемент";
}

function renderAdminPlans() {
  document.getElementById("adminPlansList").innerHTML = plans.map(plan => `
    <div class="admin-row">
      <span><b>${escapeHtml(plan.name)}</b><br>${plan.price} сом<br><small>${plan.features.map(escapeHtml).join(", ")}</small></span>
      <span class="admin-list-actions">
        <button class="btn" onclick="editPlan(${plan.id})">Изменить</button>
        <button class="btn admin-danger" onclick="deletePlan(${plan.id})">Удалить</button>
      </span>
    </div>
  `).join("");
}

function savePlan() {
  const editId = Number(document.getElementById("adminPlanEditId").value);
  const name = document.getElementById("adminPlanName").value.trim();
  const price = Number(document.getElementById("adminPlanPrice").value);
  const features = document.getElementById("adminPlanFeatures").value
    .split(String.fromCharCode(10))
    .map(item => item.trim())
    .filter(Boolean);

  if (!name || !price || !features.length) return;

  if (editId) {
    plans = plans.map(plan => plan.id === editId ? { ...plan, name, price, features } : plan);
  } else {
    plans.push({ id: Date.now(), name, price, features });
  }

  savePlans();
  clearPlanForm();
  renderAdminPlans();
  renderSubscriptions();
}

function editPlan(id) {
  const plan = plans.find(item => item.id === id);
  if (!plan) return;

  document.getElementById("adminPlanEditId").value = plan.id;
  document.getElementById("adminPlanName").value = plan.name;
  document.getElementById("adminPlanPrice").value = plan.price;
  document.getElementById("adminPlanFeatures").value = plan.features.join(String.fromCharCode(10));
  document.getElementById("savePlanBtn").textContent = "Сохранить изменения";
  window.scrollTo(0, 0);
}

function deletePlan(id) {
  plans = plans.filter(plan => plan.id !== id);
  savePlans();
  renderAdminPlans();
  renderSubscriptions();
}

function saveBook() {
  const editId = Number(document.getElementById("adminEditId").value);
  const title = document.getElementById("adminTitle").value.trim();
  const author = document.getElementById("adminAuthor").value.trim();
  const genre = document.getElementById("adminGenre").value;
  const cover = document.getElementById("adminCover").value.trim();
  const description = document.getElementById("adminDescription").value.trim();

  if (!title || !author) return;

  if (editId) {
    books = books.map(book => book.id === editId ? { ...book, title, author, genre, cover, description } : book);
  } else {
    books.push({ id: Date.now(), title, author, genre, cover, description });
  }

  saveBooks();
  clearAdminForm();
  renderAdmin();
  renderCatalog();
  renderSearch();
}

function editBook(id) {
  const book = books.find(item => item.id === id);
  if (!book) return;

  document.getElementById("adminEditId").value = book.id;
  document.getElementById("adminTitle").value = book.title;
  document.getElementById("adminAuthor").value = book.author;
  document.getElementById("adminGenre").value = book.genre;
  document.getElementById("adminCover").value = book.cover || "";
  document.getElementById("adminDescription").value = book.description || "";
  document.getElementById("saveBookBtn").textContent = "Сохранить изменения";
  updateAdminPreview();
  window.scrollTo(0, 0);
}

function deleteBook(id) {
  books = books.filter(book => book.id !== id);
  saveBooks();
  renderAdmin();
  renderCatalog();
  renderSearch();
}

function deleteUser() {
  localStorage.removeItem("user");
  localStorage.removeItem("bankCard");
  localStorage.removeItem("subscription");
  renderAdmin();
}

function deleteOrder(index) {
  const orders = JSON.parse(localStorage.getItem("ordersList")) || [];
  orders.splice(index, 1);
  localStorage.setItem("ordersList", JSON.stringify(orders));
  renderAdmin();
}

function deletePayment(index) {
  const payments = JSON.parse(localStorage.getItem("paymentsList")) || [];
  payments.splice(index, 1);
  localStorage.setItem("paymentsList", JSON.stringify(payments));
  renderAdmin();
}

function clearOrders() {
  localStorage.removeItem("ordersList");
  localStorage.removeItem("paymentsList");
  renderAdmin();
}

function bindForms() {
  document.getElementById("bookDetailReadBtn").addEventListener("click", () => {
    if (selectedBookId) readBook(selectedBookId);
  });

  document.getElementById("bookDetailCartBtn").addEventListener("click", () => {
    if (!selectedBookId) return;
    const book = books.find(item => item.id === selectedBookId);
    if (!book) return;
    cart.push(book.title);
    saveCart();
    document.getElementById("bookDetailNotice").textContent = "Книга добавлена в корзину";
  });

  document.getElementById("searchInput").addEventListener("input", renderSearch);
  document.getElementById("genreFilter").addEventListener("change", renderSearch);
  document.getElementById("doRegisterBtn").addEventListener("click", registerUser);
  document.getElementById("loginBtn").addEventListener("click", loginUser);
  document.getElementById("saveCardBtn").addEventListener("click", saveCard);
  document.getElementById("logoutBtn").addEventListener("click", logoutAccount);
  document.getElementById("savePlanBtn").addEventListener("click", savePlan);
  document.getElementById("resetPlanBtn").addEventListener("click", clearPlanForm);
  document.getElementById("saveBookBtn").addEventListener("click", saveBook);
  document.getElementById("resetBookBtn").addEventListener("click", clearAdminForm);
  document.getElementById("clearOrdersBtn").addEventListener("click", clearOrders);

  ["adminTitle", "adminAuthor", "adminGenre", "adminCover", "adminDescription"].forEach(id => {
    document.getElementById(id).addEventListener("input", updateAdminPreview);
    document.getElementById(id).addEventListener("change", updateAdminPreview);
  });
}

bindNavigation();
bindForms();
formatCardInputs();
renderCatalog();
renderSearch();
renderSubscriptions();
updateAdminPreview();
