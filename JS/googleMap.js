let mapInstance = null;
let directionsRenderer = null;
let userMarker = null;
let infoWindow = null;

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
  const mapElement = document.getElementById("map");

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

        if (userMarker) {
          userMarker.setPosition(userLocation);
        } else {
          userMarker = new google.maps.Marker({
            position: userLocation,
            map: map,
            title: "Ubicación de InnovaCode",
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
                Aquí está InnovaCode 🚀
              </div>
            `,
          });
        }

        userMarker.addListener("click", () => {
          infoWindow.open(map, userMarker);
        });

        console.log("Ubicación actual mostrada en el mapa:", userLocation);
      },
      (error) => {
        console.error("Error obteniendo ubicación:", error.message);

        // Mostrar el <dialog> sin necesidad de mucho JS
        const dialog = document.getElementById("mapDialog");
        if (dialog) dialog.showModal();
      }
    );
  } else {
    const dialog = document.getElementById("mapDialog");
    if (dialog) dialog.showModal();
  }
}
