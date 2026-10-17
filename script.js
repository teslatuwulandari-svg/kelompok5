(() => {
  "use strict";

  const body = document.body;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const currentPage = body.dataset.page || "home";
  const pageFiles = { home: "index.html", about: "about.html", team: "team.html", projects: "projects.html", skills: "skills.html", contact: "contact.html" };

  document.querySelectorAll(".site-nav a").forEach((link) => {
    if (link.getAttribute("href") === pageFiles[currentPage]) {
      link.setAttribute("aria-current", "page");
    }
  });

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".site-nav");
  if (menuButton && navigation) {
    const closeMenu = () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Buka menu navigasi");
      navigation.classList.remove("is-open");
    };
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Tutup menu navigasi" : "Buka menu navigasi");
      navigation.classList.toggle("is-open", isOpen);
    });
    navigation.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) closeMenu();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 780) closeMenu();
    });
  }

  const themeButton = document.querySelector(".theme-toggle");
  let savedTheme = "pink";
  try {
    savedTheme = window.localStorage.getItem("pixelle-theme") || "pink";
  } catch (error) {
    console.warn("Preferensi tema tidak dapat dibaca dari penyimpanan lokal.", error);
  }
  const applyTheme = (theme) => {
    body.dataset.theme = theme === "blue" ? "blue" : "pink";
    if (themeButton) {
      const nextTheme = body.dataset.theme === "blue" ? "pink-lavender" : "ungu-biru";
      themeButton.title = `Ganti ke tema ${nextTheme}`;
      themeButton.setAttribute("aria-label", `Ganti ke tema ${nextTheme}`);
    }
  };
  applyTheme(savedTheme);
  if (themeButton) {
    themeButton.addEventListener("click", () => {
      const nextTheme = body.dataset.theme === "blue" ? "pink" : "blue";
      applyTheme(nextTheme);
      try {
        window.localStorage.setItem("pixelle-theme", nextTheme);
      } catch (error) {
        console.warn("Preferensi tema tidak dapat disimpan.", error);
      }
    });
  }

  const revealItems = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  if (!reducedMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg) translateY(-3px)`;
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
  }

  const topButton = document.querySelector(".back-to-top");
  if (topButton) {
    const updateTopButton = () => topButton.classList.toggle("is-visible", window.scrollY > 400);
    window.addEventListener("scroll", updateTopButton, { passive: true });
    updateTopButton();
    topButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" }));
  }

  const toast = document.querySelector(".welcome-toast");
  if (toast && currentPage === "home") {
    let greeted = false;
    try {
      greeted = window.sessionStorage.getItem("pixelle-greeted") === "true";
    } catch (error) {
      console.warn("Status sambutan tidak dapat dibaca dari penyimpanan sesi.", error);
    }
    if (!greeted) {
      toast.hidden = false;
      try {
        window.sessionStorage.setItem("pixelle-greeted", "true");
      } catch (error) {
        console.warn("Status sambutan tidak dapat disimpan.", error);
      }
    }
    toast.querySelector("button")?.addEventListener("click", () => { toast.hidden = true; });
  }

  const projectDetails = {
    mahasiswa: {
      title: "Sistem Informasi Mahasiswa",
      description: "Konsep portal akademik yang membantu mahasiswa melihat informasi penting secara ringkas dan tertata.",
      features: ["Ringkasan jadwal dan informasi akademik", "Daftar pengumuman perkuliahan", "Tampilan yang menyesuaikan perangkat"],
      technologies: ["HTML", "CSS", "JavaScript"]
    },
    profil: {
      title: "Website Profil Mahasiswa",
      description: "Konsep halaman profil untuk memperkenalkan identitas akademik, minat, keterampilan, dan karya.",
      features: ["Bagian profil dan minat", "Galeri karya atau proyek", "Navigasi sederhana dan responsif"],
      technologies: ["HTML", "CSS", "UI/UX"]
    },
    data: {
      title: "Sistem Pengelolaan Data",
      description: "Konsep aplikasi untuk membantu pencatatan dan pencarian data dengan alur yang mudah dipahami.",
      features: ["Pencatatan informasi secara terstruktur", "Pencarian dan penyaringan data", "Rancangan akses data yang terkelola"],
      technologies: ["PHP", "Laravel", "Basis Data"]
    }
  };
  const modal = document.querySelector("[data-modal]");
  if (modal) {
    const title = modal.querySelector("#modal-title");
    const description = modal.querySelector("#modal-description");
    const featureList = modal.querySelector("#modal-features");
    const technologyList = modal.querySelector("#modal-tech");
    const closeButton = modal.querySelector(".modal-close");
    let previousFocus = null;
    const closeModal = () => {
      modal.hidden = true;
      document.body.classList.remove("modal-open");
      previousFocus?.focus();
    };
    document.querySelectorAll("[data-project]").forEach((button) => {
      button.addEventListener("click", () => {
        const detail = projectDetails[button.dataset.project];
        if (!detail || !title || !description || !featureList || !technologyList) return;
        previousFocus = button;
        title.textContent = detail.title;
        description.textContent = detail.description;
        featureList.replaceChildren(...detail.features.map((feature) => {
          const item = document.createElement("li");
          item.textContent = feature;
          return item;
        }));
        technologyList.replaceChildren(...detail.technologies.map((technology) => {
          const item = document.createElement("span");
          item.textContent = technology;
          return item;
        }));
        modal.hidden = false;
        document.body.classList.add("modal-open");
        closeButton?.focus();
      });
    });
    closeButton?.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !modal.hidden) closeModal();
    });
  }

  const contactForm = document.querySelector("[data-contact-form]");
  if (contactForm instanceof HTMLFormElement) {
    const status = contactForm.querySelector("[data-form-status]");
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!status) return;
      const valid = contactForm.checkValidity();
      status.classList.toggle("is-error", !valid);
      if (!valid) {
        status.textContent = "Periksa kembali nama, format email, dan pesan (minimal 10 karakter).";
        contactForm.reportValidity();
        return;
      }
      status.textContent = "Validasi berhasil. Formulir ini belum terhubung ke server, jadi pesan belum dikirim.";
    });
    contactForm.addEventListener("input", () => {
      if (status) {
        status.textContent = "";
        status.classList.remove("is-error");
      }
    });
  }
})();