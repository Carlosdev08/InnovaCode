/*******************************
 * NAVBAR Y MENÚ SCROLL EFFECT
 *******************************/
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const navLinksContainer = document.getElementById("nav-links");
  const navLinks = document.querySelectorAll(".nav-links a");
  const menuToggle = document.getElementById("menu-toggle");

  // Efecto al hacer scroll
  function scrollNavbar() {
    if (window.scrollY > 100) {
      navbar.classList.add("nav-scroll");
    } else {
      navbar.classList.remove("nav-scroll");
    }
  }

  // Menú hamburguesa (móvil)
  menuToggle.addEventListener("click", () => {
    navLinksContainer.classList.toggle("active");
  });

  // Activar enlaces del menú
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      navLinks.forEach((link) => link.classList.remove("active"));
      this.classList.add("active");
      navLinksContainer.classList.remove("active"); // Cierra menú
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
    {
      categoria: "web",
      imagen: "../assets/images/landingpage.jpeg",
      titulo: "Landing Page",
      descripcion: "Página para captación de clientes potenciales.",
    },
    {
      categoria: "web",
      imagen: "../assets/images/porfolioProfesional.jpeg",
      titulo: "Portfolio Profesional",
      descripcion:
        "Sitio web para mostrar el trabajo de diseñadores y freelancers.",
    },
    {
      categoria: "apps",
      imagen: "../assets/images/app_salud.jpeg",
      titulo: "App Salud",
      descripcion:
        "Aplicación para seguimiento de hábitos saludables y citas médicas.",
    },
    {
      categoria: "seo",
      imagen: "../assets/images/seo_blog.jpeg",
      titulo: "Optimización Blog SEO",
      descripcion:
        "Mejora de posicionamiento orgánico para blogs de contenido técnico.",
    },
    {
      categoria: "web",
      imagen: "../assets/images/ecommerce_fashion.webp",
      titulo: "E-commerce de Ropa",
      descripcion: "Tienda online especializada en moda y complementos.",
    },
    {
      categoria: "apps",
      imagen: "../assets/images/app_reservas.webp",
      titulo: "App de Reservas",
      descripcion: "App para gestionar reservas en restaurantes y hoteles.",
    },
    {
      categoria: "seo",
      imagen: "../assets/images/seo_analytics.webp",
      titulo: "Análisis SEO Avanzado",
      descripcion: "Herramienta de auditoría SEO y análisis de palabras clave.",
    },
  ];

  const container = $(".gallery-container");
  const modal = $("#projectModal");
  const modalImg = $("#modalImg");
  const modalTitle = $("#modalTitle");
  const modalDesc = $("#modalDesc");

  // Pintar las cards
  proyectos.forEach((proyecto) => {
    const card = `
      <div class="gallery-card" data-category="${proyecto.categoria}">
        <img src="${proyecto.imagen}" alt="${proyecto.titulo}" width="1024" height="1024">
        <h3>${proyecto.titulo}</h3>
        <p>${proyecto.descripcion}</p>        
      </div>
    `;
    container.append(card);
  });

  // Filtros
  $(".filter-btn").click(function () {
    const categoria = $(this).data("filter");

    $(".filter-btn").removeClass("active");
    $(this).addClass("active");

    if (categoria === "todos") {
      $(".gallery-card").fadeIn();
    } else {
      $(".gallery-card").each(function () {
        const cardCategoria = $(this).data("category");
        if (cardCategoria === categoria) {
          $(this).fadeIn();
        } else {
          $(this).fadeOut();
        }
      });
    }
  });

  // Modal click en card
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

  // Cerrar modal
  $(".close").click(() => {
    modal.fadeOut();
    $("body").css("overflow", "auto");
  });

  modal.click((e) => {
    if ($(e.target).is("#projectModal")) {
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
  const cardWidth = 300 + 16;
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
          </div>
        `;
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

      if (scrollAmount >= maxScrollLeft) {
        scrollAmount = 0;
      } else {
        scrollAmount += cardWidth;
      }

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
    scrollAmount -= cardWidth;
    if (scrollAmount < 0) scrollAmount = 0;
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
  const cardWidth = 300 + 16; 
  let scrollAPI = 0;
  let autoScrollAPI;

  const apiKey = "1f9051fc25833d55d792fa46713c9825";
  const apiUrl = `https://gnews.io/api/v4/top-headlines?lang=en&country=en&max=10&token=${apiKey}`;

  function loadNews() {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (!data.articles || data.articles.length === 0) {
          console.warn("No hay noticias en español, buscando en inglés...");
          return fetch(
            `https://gnews.io/api/v4/top-headlines?lang=en&max=10&token=${apiKey}`
          ).then((response) => response.json());
        }
        return data;
      })
      .then((data) => {
        const articles = data.articles || [];
        const container = document.getElementById("news-container-api");

        if (articles.length === 0) {
          container.innerHTML = "<p>No hay noticias disponibles</p>";
          return;
        }

        // Limpio el contenido anterior, por si acaso
        container.innerHTML = "";

        articles.forEach((item) => {
          const card = `
        <a href="${item.url}" target="_blank" class="news-card-link">
          <div class="news-card">
            <h3>${item.title}</h3>
            <p>${item.description || "Descripción no disponible"}</p>
            <span>${new Date(item.publishedAt).toLocaleDateString()}</span>
          </div>
        </a>
      `;
          container.innerHTML += card;
        });
      })
      .catch((error) => console.error("Error cargando noticias:", error));
  }

  function iniciarAutoScrollAPI() {
    autoScrollAPI = setInterval(() => {
      const maxScroll =
        containerAPI[0].scrollWidth - containerAPI[0].clientWidth;

      if (scrollAPI >= maxScroll) {
        scrollAPI = 0;
      } else {
        scrollAPI += cardWidth;
      }

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
    scrollAPI -= cardWidth;
    if (scrollAPI < 0) scrollAPI = 0;
    containerAPI.animate({ scrollLeft: scrollAPI }, 500);
    iniciarAutoScrollAPI();
  });

  loadNews(); 
});

