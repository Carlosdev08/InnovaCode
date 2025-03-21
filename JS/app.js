/*******************************
 * NAVBAR Y MENÚ SCROLL EFFECT
 *******************************/
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const navLinksContainer = document.getElementById("nav-links");
  const navLinks = document.querySelectorAll(".nav-links a");
  const menuToggle = document.getElementById("menu-toggle");

  const scrollNavbar = () => {
    window.scrollY > 100
      ? navbar.classList.add("nav-scroll")
      : navbar.classList.remove("nav-scroll");
  };

  menuToggle.addEventListener("click", () => {
    navLinksContainer.classList.toggle("active");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      navLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
      navLinksContainer.classList.remove("active");
    });
  });

  window.addEventListener("scroll", scrollNavbar);
  scrollNavbar();
});

/*******************************
 * GALERÍA, FILTROS Y MODAL
 *******************************/
$(document).ready(function () {
  const proyectos = [
    {
      categoria: "web",
      imagen: "../assets/images/item1.jpeg",
      titulo: "Tienda Online",
      descripcion: "Desarrollo completo de e-commerce.",
    },
    {
      categoria: "apps",
      imagen: "../assets/images/item2.jpeg",
      titulo: "App de Gestión",
      descripcion: "App para administración de tareas y productividad.",
    },
    {
      categoria: "seo",
      imagen: "../assets/images/posicionamientoSeo.webp",
      titulo: "SEO Optimizado",
      descripcion: "Posicionamiento en buscadores y aumento de tráfico.",
    },
  ];

  const container = $(".gallery-container");
  const modal = $("#projectModal");
  const modalImg = $("#modalImg");
  const modalTitle = $("#modalTitle");
  const modalDesc = $("#modalDesc");

  proyectos.forEach((proyecto) => {
    container.append(`
      <div class="gallery-card" data-category="${proyecto.categoria}">
        <img src="${proyecto.imagen}" alt="${proyecto.titulo}" width="1024" height="1024">
        <h3>${proyecto.titulo}</h3>
        <p>${proyecto.descripcion}</p>
      </div>`);
  });

  $(".filter-btn").click(function () {
    const categoria = $(this).data("filter");
    $(".filter-btn").removeClass("active");
    $(this).addClass("active");

    $(".gallery-card").each(function () {
      const cardCategoria = $(this).data("category");
      categoria === "todos" || cardCategoria === categoria
        ? $(this).fadeIn()
        : $(this).fadeOut();
    });
  });

  container.on("click", ".gallery-card", function () {
    modalImg.attr("src", $(this).find("img").attr("src"));
    modalTitle.text($(this).find("h3").text());
    modalDesc.text($(this).find("p").text());
    modal.fadeIn();
    $("body").css("overflow", "hidden");
  });

  $(".close, #projectModal").click(function (e) {
    if ($(e.target).is("#projectModal") || $(e.target).hasClass("close")) {
      modal.fadeOut();
      $("body").css("overflow", "auto");
    }
  });
});

/*******************************
 * SLIDER NOTICIAS LOCALES
 *******************************/
$(document).ready(function () {
  const container = $("#news-container");
  const cardWidth = 316;
  let scrollAmount = 0;
  let autoScroll;

  const cargarNoticias = () => {
    $.getJSON("../data/news.json", function (data) {
      data.forEach((noticia) => {
        container.append(`
          <div class="news-card">
            <h3>${noticia.titulo}</h3>
            <p>${noticia.descripcion}</p>
            <span>${noticia.fecha}</span>
          </div>`);
      });
      iniciarAutoScroll();
    }).fail(() => {
      console.error("No se pudieron cargar las noticias.");
      container.html("<p>Error al cargar las noticias.</p>");
    });
  };

  const iniciarAutoScroll = () => {
    autoScroll = setInterval(() => {
      const maxScrollLeft = container[0].scrollWidth - container[0].clientWidth;
      scrollAmount =
        scrollAmount >= maxScrollLeft ? 0 : scrollAmount + cardWidth;
      container.animate({ scrollLeft: scrollAmount }, 600);
    }, 3000);
  };

  $(".carousel-btn.next").click(function () {
    clearInterval(autoScroll);
    scrollAmount += cardWidth;
    container.animate({ scrollLeft: scrollAmount }, 500);
    iniciarAutoScroll();
  });

  $(".carousel-btn.prev").click(function () {
    clearInterval(autoScroll);
    scrollAmount = Math.max(scrollAmount - cardWidth, 0);
    container.animate({ scrollLeft: scrollAmount }, 500);
    iniciarAutoScroll();
  });

  cargarNoticias();
});

/*******************************
 * SLIDER NOTICIAS API (RSS2JSON)
 *******************************/
function loadNews(rssUrl) {
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => showNews(data.items))
    .catch((error) => console.error("❌ Error cargando noticias:", error));
}

function showNews(newsItems) {
  const container = document.getElementById("news-container-api");
  container.innerHTML = "";

  newsItems.slice(0, 10).forEach((item) => {
    const { title, link, description } = item;

    const newsCard = document.createElement("div");
    newsCard.className = "news-card";

    newsCard.innerHTML = `
      <h3>${title}</h3>
      <p>${description || "Sin descripción"}</p>
      <a href="${link}" target="_blank">Leer más</a>
    `;

    container.append(newsCard);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("news-container-api");
  const prevBtn = document.querySelector(".prev-api");
  const nextBtn = document.querySelector(".next-api");

  const cardWidth = 316;
  let scrollAmount = 0;

  prevBtn.addEventListener("click", () => {
    scrollAmount = Math.max(scrollAmount - cardWidth, 0);
    container.scrollTo({ left: scrollAmount, behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    scrollAmount = Math.min(
      scrollAmount + cardWidth,
      container.scrollWidth - container.clientWidth
    );
    container.scrollTo({ left: scrollAmount, behavior: "smooth" });
  });

  // Auto-scroll
  setInterval(() => {
    scrollAmount += cardWidth;
    if (scrollAmount >= container.scrollWidth - container.clientWidth) {
      scrollAmount = 0;
    }
    container.scrollTo({ left: scrollAmount, behavior: "smooth" });
  }, 3000);

  loadNews("https://news.google.com/rss");
});

/*******************************
 * GOOGLE MAPS + DIRECTIONS
 *******************************/
import initMap from "./googleMap.js";
import { calcularRuta } from "./direction.js";
import {
  initAutocomplete,
  origenPlace,
  destinoPlace,
} from "./placesAutocomplete.js";

$(document).ready(function () {
  const startMap = () => {
    initMap();
    initAutocomplete();

    $("#btnCalcularRuta").on("click", () => {
      if (!origenPlace || !destinoPlace) {
        alert(
          "Por favor, selecciona el origen y el destino desde las sugerencias."
        );
        return;
      }

      calcularRuta(origenPlace.location, destinoPlace.location);
    });
  };

  if (typeof google !== "undefined" && google.maps) {
    startMap();
  } else {
    window.addEventListener("load", () => {
      if (typeof google !== "undefined" && google.maps) {
        startMap();
      } else {
        console.error("Google Maps API no se ha cargado.");
      }
    });
  }
});
