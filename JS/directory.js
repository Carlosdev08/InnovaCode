import { getMap } from "./googleMap.js";

export function calcularRuta(origen, destino) {
  const map = getMap();

  if (!map) {
    console.error("El mapa no está inicializado");
    return;
  }

  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer({
    suppressMarkers: false, // Puedes poner true si quieres añadir tus propios iconos
  });

  directionsRenderer.setMap(map);

  const request = {
    origin: origen, // Texto o coordenadas { lat, lng }
    destination: destino,
    travelMode: google.maps.TravelMode.DRIVING, // Otras opciones: WALKING, BICYCLING, TRANSIT
  };

  directionsService.route(request, (result, status) => {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsRenderer.setDirections(result);

      // 🔥 Obtener el primer "leg" (tramo) de la ruta
      const leg = result.routes[0].legs[0];
      const distancia = leg.distance.text; // Ejemplo: "32 km"
      const duracion = leg.duration.text; // Ejemplo: "28 min"

      

      // ✅ Mostrar info en el DOM
      const infoDiv = document.getElementById("infoRuta");

      if (infoDiv) {
        infoDiv.innerHTML = `
          <p><strong>Distancia:</strong> ${distancia}</p>
          <p><strong>Duración estimada:</strong> ${duracion}</p>
        `;
      } else {
        console.warn("No se encontró el div con id='infoRuta'");
      }
    } else if (status === "ZERO_RESULTS") {
      alert("No se encontró ruta disponible entre esos puntos.");
    } else {
      console.error("Error al calcular la ruta:", status);
      alert("No se pudo calcular la ruta, revisa los datos.");
    }
  });
}
