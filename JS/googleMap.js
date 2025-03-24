// ============================
// VARIABLES GLOBALES
// ============================
let mapInstance = null;
let directionsRenderer = null;
let directionsService = null;
let userMarker = null;
let infoWindow = null;

let origenAutocomplete = null;
let origenPlace = null;

const direccionEmpresa = { lat: 40.4168, lng: -3.7038 }; // Tu empresa

// ============================
// INICIALIZAR MAPA
// ============================
function initMap() {
  const mapElement = document.getElementById("map");

  if (!mapElement) {
    console.error("❌ No se encontró el div con id='map'");
    return;
  }

  mapInstance = new google.maps.Map(mapElement, {
    zoom: 15,
    center: direccionEmpresa,
  });

  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsService = new google.maps.DirectionsService();
  directionsRenderer.setMap(mapInstance);

  console.log("✅ Mapa inicializado");

  document.getElementById("btnMiUbicacion").addEventListener("click", () => {
    centrarEnMiUbicacion(() => {
      calcularRuta(userMarker.getPosition(), direccionEmpresa);
    });
  });

  initAutocomplete();

  document.getElementById("btnCalcularRuta").addEventListener("click", () => {
    if (origenPlace) {
      calcularRuta(origenPlace.location, direccionEmpresa);
    } else if (userMarker) {
      mostrarModalConfirmacion(
        "¿Quieres calcular la ruta desde tu ubicación actual?",
        () => calcularRuta(userMarker.getPosition(), direccionEmpresa)
      );
    } else {
      alert("Selecciona un origen o usa tu ubicación actual.");
    }
  });
}

// ============================
// CENTRAR EN MI UBICACIÓN
// ============================
function centrarEnMiUbicacion(callback) {
  if (!navigator.geolocation) {
    mostrarDialogoError();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      mapInstance.setCenter(userLocation);
      mapInstance.setZoom(15);

      if (userMarker) {
        userMarker.setPosition(userLocation);
      } else {
        userMarker = new google.maps.Marker({
          position: userLocation,
          map: mapInstance,
          title: "Ubicación actual",
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            scaledSize: new google.maps.Size(50, 40),
          },
        });
      }

      if (!infoWindow) {
        infoWindow = new google.maps.InfoWindow({
          content: `
      <div style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 10px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #fff;
        background: linear-gradient(135deg, #10408a, #007bff);
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        max-width: 200px;
      ">
        <p style="
          margin: 5px 0 0;
          font-size: 0.9rem;
          text-align: center;
        ">¡Aquí estás!</p>
        <h3 style="
          margin: 0;
          font-size: 1.2rem;
          font-weight: bold;
        ">InnovaCode 🚀</h3>
      </div>
    `,
        });
      }

      userMarker.addListener("click", () => {
        infoWindow.open(mapInstance, userMarker);
      });

      console.log("📍 Ubicación actual centrada:", userLocation);

      if (callback) callback(); // Llama a la función después de obtener la ubicación
    },
    (error) => {
      console.error("❌ Error obteniendo ubicación:", error.message);
      mostrarDialogoError();
    }
  );
}

function mostrarDialogoError() {
  const dialog = document.getElementById("mapDialog");
  if (dialog) dialog.showModal();
}

// ============================
// AUTOCOMPLETADO ORIGEN
// ============================
function initAutocomplete() {
  const inputOrigen = document.getElementById("origen");

  if (!inputOrigen) {
    console.warn("⚠️ No se encontró el input de origen.");
    return;
  }

  origenAutocomplete = new google.maps.places.Autocomplete(inputOrigen);

  origenAutocomplete.addListener("place_changed", () => {
    const place = origenAutocomplete.getPlace();
    if (!place.geometry) {
      alert("No se encontró la ubicación de origen.");
      return;
    }

    origenPlace = {
      location: place.geometry.location,
      name: place.name,
    };
  });
}

// ============================
// CALCULAR RUTA
// ============================
function calcularRuta(origen, destino) {
  const modo = document.getElementById("modoTransporte")?.value || "DRIVING";

  const request = {
    origin: origen,
    destination: destino,
    travelMode: google.maps.TravelMode[modo],
  };

  directionsService.route(request, (result, status) => {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsRenderer.setDirections(result);
      mostrarInfoRuta(result);
    } else {
      console.error("❌ No se pudo calcular la ruta:", status);
      alert("No se pudo calcular la ruta. Intenta de nuevo.");
    }
  });
}

function mostrarInfoRuta(result) {
  const route = result.routes[0].legs[0];
  const distancia = route.distance.text;
  const duracion = route.duration.text;

  const infoRuta = document.getElementById("infoRuta");
  if (infoRuta) {
    infoRuta.innerHTML = `
      <strong>Distancia:</strong> ${distancia}<br>
      <strong>Duración estimada:</strong> ${duracion}
    `;
  }
}

// ============================
// MODAL CONFIRMACIÓN REUTILIZABLE
// ============================
function mostrarModalConfirmacion(message, onConfirm) {
  const existingModal = document.querySelector(".modal-custom");
  if (existingModal) existingModal.remove();

  const modal = document.createElement("div");
  modal.classList.add("modal-custom");
  modal.innerHTML = `
    <div class="modal-content-custom">
      <h3>🗺️ Confirmación</h3>
      <p>${message}</p>
      <div class="modal-btn">
        <button id="confirmBtn">Aceptar</button>
        <button id="cancelBtn">Cancelar</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector("#confirmBtn").addEventListener("click", () => {
    onConfirm();
    modal.remove();
  });

  modal.querySelector("#cancelBtn").addEventListener("click", () => {
    modal.remove();
  });
}

// ============================
// INICIO
// ============================
window.addEventListener("load", () => {
  if (typeof google !== "undefined" && google.maps) {
    initMap();
  } else {
    console.error("❌ Google Maps API no cargada.");
  }
});
