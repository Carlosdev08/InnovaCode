// ============================
// VARIABLES GLOBALES
// ============================
let mapInstance = null;
let directionsRenderer = null;
let directionsService = null;
let userMarker = null;
let infoWindow = null;

let origenAutocomplete = null;
let destinoAutocomplete = null;

let origenPlace = null;
let destinoPlace = null;

// ============================
// INICIALIZAR MAPA
// ============================
function initMap() {
  const defaultLocation = { lat: 40.4168, lng: -3.7038 }; // Madrid
  const mapElement = document.getElementById("map");

  if (!mapElement) {
    console.error("❌ No se encontró el div con id='map'");
    return;
  }

  mapInstance = new google.maps.Map(mapElement, {
    zoom: 15,
    center: defaultLocation,
  });

  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsService = new google.maps.DirectionsService();

  directionsRenderer.setMap(mapInstance);

  console.log("✅ Mapa y DirectionsRenderer inicializados.");

  const btnUbicacion = document.getElementById("btnMiUbicacion");
  if (btnUbicacion) {
    btnUbicacion.addEventListener("click", centrarEnMiUbicacion);
  }

  initAutocomplete();

  const btnCalcularRuta = document.getElementById("btnCalcularRuta");
  if (btnCalcularRuta) {
    btnCalcularRuta.addEventListener("click", () => {
      if (!origenPlace || !destinoPlace) {
        alert(
          "Por favor, selecciona el origen y el destino desde las sugerencias."
        );
        return;
      }

      calcularRuta(origenPlace.location, destinoPlace.location);
    });
  }
}

// ============================
// CENTRAR EN MI UBICACIÓN
// ============================
function centrarEnMiUbicacion() {
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
            <div style="font-weight: bold; color: #007bff; text-align: center;">
              Aquí estás 🚀
            </div>
          `,
        });
      }

      userMarker.addListener("click", () => {
        infoWindow.open(mapInstance, userMarker);
      });

      console.log("📍 Ubicación actual mostrada en el mapa:", userLocation);
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
// AUTOCOMPLETADO ORIGEN / DESTINO
// ============================
function initAutocomplete() {
  const inputOrigen = document.getElementById("origen");
  const inputDestino = document.getElementById("destino");

  if (!inputOrigen || !inputDestino) {
    console.warn("⚠️ No se encontraron los inputs de origen/destino.");
    return;
  }

  origenAutocomplete = new google.maps.places.Autocomplete(inputOrigen);
  destinoAutocomplete = new google.maps.places.Autocomplete(inputDestino);

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

    console.log("✅ Origen seleccionado:", origenPlace);
  });

  destinoAutocomplete.addListener("place_changed", () => {
    const place = destinoAutocomplete.getPlace();
    if (!place.geometry) {
      alert("No se encontró la ubicación de destino.");
      return;
    }

    destinoPlace = {
      location: place.geometry.location,
      name: place.name,
    };

    console.log("✅ Destino seleccionado:", destinoPlace);
  });
}

// ============================
// CALCULAR RUTA ENTRE PUNTOS
// ============================
function calcularRuta(origen, destino) {
  if (!directionsService || !directionsRenderer) {
    console.error(
      "❌ DirectionsService o DirectionsRenderer no inicializados."
    );
    return;
  }

  const request = {
    origin: origen,
    destination: destino,
    travelMode: google.maps.TravelMode.DRIVING,
  };

  directionsService.route(request, (result, status) => {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsRenderer.setDirections(result);
      mostrarInfoRuta(result);
      console.log("🚗 Ruta calculada correctamente");
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
// ESPERAR A CARGAR GOOGLE MAPS Y LA PÁGINA
// ============================
window.addEventListener("load", () => {
  if (typeof google !== "undefined" && google.maps) {
    initMap();
  } else {
    console.error("❌ Google Maps API no se ha cargado correctamente.");
  }
});
