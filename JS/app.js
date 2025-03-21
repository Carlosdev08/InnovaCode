/*******************************
 * NAVBAR Y MENÚ SCROLL EFFECT
 *******************************/
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const navLinksContainer = document.getElementById("nav-links");
  const menuToggle = document.getElementById("menu-toggle");

  if (!menuToggle || !navLinksContainer) {
    console.warn("❌ No se encontró el menú o los enlaces.");
  } else {
    menuToggle.addEventListener("click", () => {
      navLinksContainer.classList.toggle("active");
    });

    const navLinks = navLinksContainer.querySelectorAll("a");

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navLinksContainer.classList.remove("active");
        navLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      });
    });
  }

  const scrollNavbar = () => {
    if (window.scrollY > 100) {
      navbar.classList.add("nav-scroll");
    } else {
      navbar.classList.remove("nav-scroll");
    }
  };

  window.addEventListener("scroll", scrollNavbar);
  scrollNavbar(); // iniciar en el load

  /*******************************
   * PÁGINAS SEGÚN BODY CLASS
   *******************************/
  const body = document.body;

  if (body.classList.contains("home-page")) {
    // initHomePage(); // Aquí iría tu función si existe
    console.log("🏠 Home Page");
  }

  if (body.classList.contains("galeria-page")) {
    // initGaleriaPage(); // Comenta o implementa
    console.log("🖼️ Galería Page");
  }

  if (body.classList.contains("contacto-page")) {
    // initContactoPage();
    console.log("📍 Contacto Page");
  }

  if (body.classList.contains("presupuesto-page")) {
    // initPresupuestoPage();
    console.log("💼 Presupuesto Page");
  }
});

/*******************************
 * GALERÍA, FILTROS Y MODAL
 *******************************/
$(document).ready(function () {
  const $gallery = $(".gallery-container");

  if ($gallery.length > 0) {
    console.log("🎨 Galería detectada");

    $(".filter-btn").click(function () {
      const categoria = $(this).data("filter");
      console.log("🔎 Filtrando categoría:", categoria);

      $(".filter-btn").removeClass("active");
      $(this).addClass("active");

      $(".gallery-card").each(function () {
        const cardCategoria = $(this).data("category");

        if (categoria === "todos" || cardCategoria === categoria) {
          $(this).fadeIn(300);
        } else {
          $(this).fadeOut(300);
        }
      });
    });
  }
});

/*******************************
 * SLIDER NOTICIAS LOCALES
 *******************************/
$(document).ready(function () {
  const $container = $("#news-container");

  if ($container.length === 0) {
    console.warn("❌ news-container no encontrado.");
    return;
  }

  const cardWidth = 316;
  let scrollAmount = 0;
  let autoScroll;

  const cargarNoticias = () => {
    $.getJSON("../data/news.json", function (data) {
      data.forEach((noticia) => {
        $container.append(`
          <div class="news-card">
            <h3>${noticia.titulo}</h3>
            <p>${noticia.descripcion}</p>
            <span>${noticia.fecha}</span>
          </div>`);
      });
      iniciarAutoScroll();
    }).fail(() => {
      console.error("❌ No se pudieron cargar las noticias locales.");
      $container.html("<p>Error al cargar las noticias.</p>");
    });
  };

  const iniciarAutoScroll = () => {
    clearInterval(autoScroll);

    autoScroll = setInterval(() => {
      const maxScrollLeft =
        $container[0].scrollWidth - $container[0].clientWidth;

      scrollAmount =
        scrollAmount >= maxScrollLeft ? 0 : scrollAmount + cardWidth;

      $container.animate({ scrollLeft: scrollAmount }, 600);
    }, 3000);
  };

  $(".carousel-btn.next").click(function () {
    clearInterval(autoScroll);
    scrollAmount += cardWidth;
    $container.animate({ scrollLeft: scrollAmount }, 500);
    iniciarAutoScroll();
  });

  $(".carousel-btn.prev").click(function () {
    clearInterval(autoScroll);
    scrollAmount = Math.max(scrollAmount - cardWidth, 0);
    $container.animate({ scrollLeft: scrollAmount }, 500);
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
    .catch((error) => console.error("❌ Error cargando noticias API:", error));
}

function showNews(newsItems) {
  const container = document.getElementById("news-container-api");

  if (!container) {
    console.warn("❌ news-container-api no encontrado.");
    return;
  }

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

  if (!container || !prevBtn || !nextBtn) {
    console.warn("❌ No se encontraron los controles del carrusel API.");
    return;
  }

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
