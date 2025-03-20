import {
  getMap,
  getDirectionsRenderer,
  setDirectionsRenderer,
} from "./googleMap.js";
import { API_KEYS } from "../assets/apis/config.js"; // Asegúrate de que la ruta es correcta

export async function calcularRuta(origen, destino, modo = "DRIVE") {
  const apiKey = API_KEYS.API_KEYSGOOGLE_MAPS;
  const map = getMap();

  if (!map) {
    console.error("El mapa no está inicializado");
    return;
  }

  const url = `https://routes.googleapis.com/directions/v2:computeRoutes?key=${apiKey}`;

  const data = {
    origin: {
      location: {
        latLng: {
          latitude: origen.lat(),
          longitude: origen.lng(),
        },
      },
    },
    destination: {
      location: {
        latLng: {
          latitude: destino.lat(),
          longitude: destino.lng(),
        },
      },
    },
    travelMode: modo,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-FieldMask":
          "routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("📨 Respuesta Routes API:", result);

    if (!result.routes || result.routes.length === 0) {
      console.warn("No se encontró ninguna ruta.");
      alert("No se encontró ninguna ruta disponible.");
      return;
    }

    const route = result.routes[0];
    const distance = route.distanceMeters;
    const duration = parseInt(route.duration); // <- Asegúrate de que es número en segundos

    // ✅ Conversión de duración:
    const duracionMinutos = Math.floor(duration / 60);
    const duracionHoras = Math.floor(duracionMinutos / 60);
    const duracionFinal =
      duracionHoras > 0
        ? `${duracionHoras}h ${duracionMinutos % 60}m`
        : `${duracionMinutos} min`;

    // ✅ Actualiza el contenido en tu div #infoRuta
    const infoDiv = document.getElementById("infoRuta");
    if (infoDiv) {
      infoDiv.innerHTML = `
        <p><strong>Distancia:</strong> ${(distance / 1000).toFixed(2)} km</p>
        <p><strong>Duración estimada:</strong> ${duracionFinal}</p>
      `;
    }

    // ✅ Decodifica y dibuja la polyline
    const decodedPath = google.maps.geometry.encoding.decodePath(
      route.polyline.encodedPolyline
    );

    new google.maps.Polyline({
      path: decodedPath,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 2.0,
      strokeWeight: 5,
      map: map,
    });
  } catch (error) {
    console.error("❌ Error en Routes API:", error);
    alert("No se pudo calcular la ruta. Intenta de nuevo.");
  }
}



