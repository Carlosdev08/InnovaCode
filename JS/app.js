/*******************************
 * NAVBAR Y MENÚ SCROLL EFFECT
 *******************************/
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const navLinksContainer = document.getElementById("nav-links");
  const navLinks = document.querySelectorAll(".nav-links a");
  const menuToggle = document.getElementById("menu-toggle");

  function scrollNavbar() {
    window.scrollY > 100
      ? navbar.classList.add("nav-scroll")
      : navbar.classList.remove("nav-scroll");
  }

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
    // Agrega más proyectos aquí...
  ];

  const container = $(".gallery-container");
  const modal = $("#projectModal");
  const modalImg = $("#modalImg");
  const modalTitle = $("#modalTitle");
  const modalDesc = $("#modalDesc");

  proyectos.forEach((proyecto) => {
    const card = `
      <div class="gallery-card" data-category="${proyecto.categoria}">
        <img src="${proyecto.imagen}" alt="${proyecto.titulo}" width="1024" height="1024">
        <h3>${proyecto.titulo}</h3>
        <p>${proyecto.descripcion}</p>
      </div>`;
    container.append(card);
  });

  $(".filter-btn").click(function () {
    const categoria = $(this).data("filter");
    $(".filter-btn").removeClass("active");
    $(this).addClass("active");

    if (categoria === "todos") {
      $(".gallery-card").fadeIn();
    } else {
      $(".gallery-card").each(function () {
        const cardCategoria = $(this).data("category");
        cardCategoria === categoria ? $(this).fadeIn() : $(this).fadeOut();
      });
    }
  });

  container.on("click", ".gallery-card", function () {
    const imgSrc = $(this).find("img").attr("src");
    const title = $(this).find("h3").text();
    const desc = $(this).find("p").text();

    modalImg.attr("src", imgSrc);
    modalTitle.text(title);
    modalDesc.text(desc);

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
  const cardWidth = 316; // 300px + 16px gap
  let scrollAmount = 0;
  let autoScroll;

  function cargarNoticias() {
    $.getJSON("../data/news.json", function (data) {
      data.forEach((noticia) => {
        const card = `
          <div class="news-card">
            <h3>${noticia.titulo}</h3>
            <p>${noticia.descripcion}</p>
            <span>${noticia.fecha}</span>
          </div>`;
        container.append(card);
      });
      iniciarAutoScroll();
    }).fail(function () {
      console.error("No se pudieron cargar las noticias.");
      container.html("<p>Error al cargar las noticias.</p>");
    });
  }

  function iniciarAutoScroll() {
    autoScroll = setInterval(() => {
      const maxScrollLeft = container[0].scrollWidth - container[0].clientWidth;
      scrollAmount =
        scrollAmount >= maxScrollLeft ? 0 : scrollAmount + cardWidth;
      container.animate({ scrollLeft: scrollAmount }, 600);
    }, 3000);
  }

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
 * SLIDER NOTICIAS API (GNews)
 *******************************/
$(document).ready(function () {
  const containerAPI = $("#news-container-api");
  const cardWidth = 316;
  let scrollAPI = 0;
  let autoScrollAPI;

  const apiKey = "1f9051fc25833d55d792fa46713c9825";
  const apiUrl = `https://gnews.io/api/v4/top-headlines?lang=en&country=us&max=10&token=${apiKey}`;

  function loadNewsAPI() {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const articles = data.articles || [];

        if (!articles.length) {
          containerAPI.html("<p>No hay noticias disponibles</p>");
          return;
        }

        containerAPI.empty();

        articles.forEach((item) => {
          const card = `
            <a href="${item.url}" target="_blank" class="news-card-link">
              <div class="news-card">
                <h3>${item.title}</h3>
                <p>${item.description || "Descripción no disponible"}</p>
                <span>${new Date(item.publishedAt).toLocaleDateString()}</span>
              </div>
            </a>`;
          containerAPI.append(card);
        });

        iniciarAutoScrollAPI();
      })
      .catch((error) => console.error("Error cargando noticias API:", error));
  }

  function iniciarAutoScrollAPI() {
    autoScrollAPI = setInterval(() => {
      const maxScroll =
        containerAPI[0].scrollWidth - containerAPI[0].clientWidth;
      scrollAPI = scrollAPI >= maxScroll ? 0 : scrollAPI + cardWidth;
      containerAPI.animate({ scrollLeft: scrollAPI }, 600);
    }, 3000);
  }

  $(".next-api").click(function () {
    clearInterval(autoScrollAPI);
    scrollAPI += cardWidth;
    containerAPI.animate({ scrollLeft: scrollAPI }, 500);
    iniciarAutoScrollAPI();
  });

  $(".prev-api").click(function () {
    clearInterval(autoScrollAPI);
    scrollAPI = Math.max(scrollAPI - cardWidth, 0);
    containerAPI.animate({ scrollLeft: scrollAPI }, 500);
    iniciarAutoScrollAPI();
  });

  loadNewsAPI();
});

/*******************************
 * GOOGLE MAPS + DIRECTIONS
 *******************************/
import initMap from "./googleMap.js";
import { calcularRuta } from "./direction.js";
import { initAutocomplete } from "./placesAutocomplete.js";

$(document).ready(function () {
  console.log("DOM listo para Google Maps");

  const startMap = () => {
    initMap();
    initAutocomplete();

    $("#btnCalcularRuta").on("click", () => {
      const origen = $("#origen").val();
      const destino = $("#destino").val();

      if (!origen || !destino) {
        alert("Por favor, completa el origen y el destino.");
        return;
      }

      calcularRuta(origen, destino);
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

  // Si quieres botones de ejemplo, descomenta:
  /*
  $("#btnMadridBarcelona").on("click", () => {
    calcularRuta("Madrid, España", "Barcelona, España");
  });

  $("#btnMadridValencia").on("click", () => {
    calcularRuta("Madrid, España", "Valencia, España");
  });
  */
});
