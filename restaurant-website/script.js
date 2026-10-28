"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".site-navbar");
  const navCollapse = document.querySelector("#mainNav");
  const navLinks = [...document.querySelectorAll(".site-navbar .nav-link")];
  const backToTop = document.querySelector("#back-to-top");
  const menuItems = [...document.querySelectorAll(".menu-item")];
  const filterButtons = [...document.querySelectorAll(".filter-btn")];
  const toastElement = document.querySelector("#demo-toast");
  const toastMessage = document.querySelector("#toast-message");

  document.querySelector("#current-year").textContent = String(new Date().getFullYear());

  const updateScrollState = () => {
    nav.classList.toggle("navbar-scrolled", window.scrollY > 24);
    backToTop.classList.toggle("visible", window.scrollY > 500);
  };
  window.addEventListener("scroll", updateScrollState, { passive: true });
  updateScrollState();

  const sections = [...document.querySelectorAll("main section[id]")];
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", isCurrent);
        if (isCurrent) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  sections.forEach((section) => sectionObserver.observe(section));

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 991.98px)").matches && navCollapse.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
      }
    });
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedCategory = button.dataset.filter;
      filterButtons.forEach((filterButton) => {
        const isActive = filterButton === button;
        filterButton.classList.toggle("active", isActive);
        filterButton.setAttribute("aria-pressed", String(isActive));
      });
      menuItems.forEach((item) => {
        item.classList.toggle("is-hiding", selectedCategory !== "all" && item.dataset.category !== selectedCategory);
      });
    });
  });

  const demoToast = bootstrap.Toast.getOrCreateInstance(toastElement, { delay: 3600 });
  document.querySelectorAll(".btn-order").forEach((button) => {
    button.addEventListener("click", () => {
      toastMessage.textContent = `${button.dataset.dish} is a sample menu item. Online ordering is not available in this demo.`;
      demoToast.show();
    });
  });

  document.querySelector("#back-to-top").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const reservationDate = document.querySelector("#reservation-date");
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  reservationDate.min = localToday;

  // These client-side demonstrations do not submit data; real reservations require backend integration.
  const forms = [
    { form: document.querySelector("#reservation-form"), response: document.querySelector("#reservation-response"), message: "Thanks! Your reservation details passed the demo validation. No booking was sent or saved." },
    { form: document.querySelector("#contact-form"), response: document.querySelector("#contact-response"), message: "Thanks for your note! The demo form validated successfully, but your message was not sent or saved." }
  ];

  forms.forEach(({ form, response, message }) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      response.textContent = "";
      response.className = "form-response";

      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        response.textContent = "Please check the highlighted fields and try again.";
        response.classList.add("error");
        form.querySelector(":invalid")?.focus();
        return;
      }

      form.classList.remove("was-validated");
      form.reset();
      response.textContent = message;
      response.classList.add("success");
    });

    form.addEventListener("input", () => {
      if (response.classList.contains("error")) {
        response.textContent = "";
        response.className = "form-response";
      }
    });
  });
});
