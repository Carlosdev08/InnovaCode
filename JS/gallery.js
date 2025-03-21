$(document).ready(function () {
  console.log("✅ gallery.js cargado");

  const proyectos = [
    {
      categoria: "web",
      imagen: "https://via.placeholder.com/300x200?text=Web+1",
      titulo: "Tienda Online",
      descripcion:
        "Desarrollo completo de e-commerce. Adaptable a cualquier nicho.",
    },
    {
      categoria: "apps",
      imagen: "https://via.placeholder.com/300x200?text=App+1",
      titulo: "App de Gestión",
      descripcion: "Administra tus tareas y proyectos de forma intuitiva.",
    },
    {
      categoria: "seo",
      imagen: "https://via.placeholder.com/300x200?text=SEO+1",
      titulo: "SEO Optimizado",
      descripcion: "Posicionamiento en buscadores y aumento de tráfico.",
    },
  ];

  const container = $(".gallery-container");
  const modal = $("#projectModal");
  const modalImg = $("#modalImg");
  const modalTitle = $("#modalTitle");
  const modalDesc = $("#modalDesc");

  function renderProyectos() {
    container.empty();
    proyectos.forEach((proyecto) => {
      container.append(`
        <div class="gallery-card" data-category="${proyecto.categoria}">
          <img src="${proyecto.imagen}" alt="${proyecto.titulo}">
          <h3>${proyecto.titulo}</h3>
          <p>${proyecto.descripcion}</p>
        </div>
      `);
    });
  }

  renderProyectos();

  $(".filter-btn").click(function () {
    const categoria = $(this).data("filter");
    $(".filter-btn").removeClass("active");
    $(this).addClass("active");

    $(".gallery-card").each(function () {
      const cardCategoria = $(this).data("category");
      if (categoria === "todos" || cardCategoria === categoria) {
        $(this).fadeIn();
      } else {
        $(this).fadeOut();
      }
    });
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
