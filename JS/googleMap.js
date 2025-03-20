let mapInstance = null;
let directionsRenderer = null;
let userMarker = null;
let infoWindow = null; // Aquí guardamos el InfoWindow

export function setMap(map) {
  mapInstance = map;
}

export function getMap() {
  return mapInstance;
}

export function setDirectionsRenderer(renderer) {
  directionsRenderer = renderer;
}

export function getDirectionsRenderer() {
  return directionsRenderer;
}

export default function initMap() {
  const defaultLocation = { lat: 40.4168, lng: -3.7038 }; // Madrid
  const mapElement = $("#map")[0];

  if (!mapElement) {
    console.error("No se encontró el div con id='map'");
    return;
  }

  const map = new google.maps.Map(mapElement, {
    zoom: 15,
    center: defaultLocation,
  });

  setMap(map);

  const directionsRendererInstance = new google.maps.DirectionsRenderer();
  directionsRendererInstance.setMap(map);
  setDirectionsRenderer(directionsRendererInstance);

  console.log("Mapa y DirectionsRenderer inicializados.");

  // 👉 Escuchamos el botón de ubicación
  const btnUbicacion = document.getElementById("btnMiUbicacion");
  btnUbicacion.addEventListener("click", () => {
    centrarEnMiUbicacion(map);
  });
}

function centrarEnMiUbicacion(map) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        map.setCenter(userLocation);
        map.setZoom(15);

        // Si ya existe el marcador, lo movemos
        if (userMarker) {
          userMarker.setPosition(userLocation);
        } else {
          userMarker = new google.maps.Marker({
            position: userLocation,
            map: map,
            title: "Ubicación de InnovaCode",
            icon: {
              url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              scaledSize: new google.maps.Size(40, 40),
            },
          });
        }

        // Crea el InfoWindow si no existe
        if (!infoWindow) {
          infoWindow = new google.maps.InfoWindow({
            content: `
  <div style="font-weight: bold; color: #007bff; text-align: center;">
    Aquí está InnovaCode 🚀
  </div>
`,
          });
        }

        // Añade el evento click al marcador para mostrar el InfoWindow
        userMarker.addListener("click", () => {
          infoWindow.open(map, userMarker);
        });

        console.log("Ubicación actual mostrada en el mapa:", userLocation);
      },
      (error) => {
        console.error("Error obteniendo ubicación:", error.message);
        alert("No se pudo obtener tu ubicación.");
      }
    );
  } else {
    alert("Tu navegador no soporta la geolocalización.");
  }
}
