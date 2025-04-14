// Toggle class active untuk hamburger menu
const navbarNav = document.querySelector('.navbar-nav');
const hm = document.querySelector("#hamburger-menu");

hm.onclick = () => {
  navbarNav.classList.toggle("active");
};

// Toggle class active untuk search form
const searchForm = document.querySelector('.search-form');
const searchBox = document.querySelector('#search-box');
const sb = document.querySelector('#search-button');

sb.onclick = (e) => {
  searchForm.classList.toggle("active");
  searchBox.focus();
  e.preventDefault();
};

// Toggle class active untuk shopping cart
const shoppingCart = document.querySelector(".shopping-cart");
const sc = document.querySelector("#shopping-cart-button");

sc.onclick = (e) => {
  e.preventDefault();
  shoppingCart.classList.toggle("active");

  if (shoppingCart.classList.contains("active")) {
    document.body.classList.add("no-scroll");
  } else {
    document.body.classList.remove("no-scroll");
  }
};

// Klik di luar elemen untuk menutup semua yang terbuka
document.addEventListener("click", function (e) {
  // Tutup hamburger menu
  if (!hm.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }

  // Tutup search form
  if (!sb.contains(e.target) && !searchForm.contains(e.target)) {
    searchForm.classList.remove("active");
  }

  // Tutup shopping cart dan unlock scroll
  if (!sc.contains(e.target) && !shoppingCart.contains(e.target)) {
    shoppingCart.classList.remove("active");
    document.body.classList.remove("no-scroll");
  }
});

// Modal Box
const itemDetailModal = document.querySelector("#item-detail-modal");
const itemDetailButtons = document.querySelectorAll(".item-detail-button");

itemDetailButtons.forEach((btn) => {
  btn.onclick = (e) => {
    e.preventDefault();
    itemDetailModal.style.display = "flex";
  };
});

// Klik tombol close modal
const modalClose = document.querySelector(".modal .close-icon");
if (modalClose) {
  modalClose.onclick = (e) => {
    e.preventDefault();
    itemDetailModal.style.display = "none";
  };
}

// Klik di luar modal
window.onclick = (e) => {
  if (e.target === itemDetailModal) {
    itemDetailModal.style.display = "none";
  }
};
