import { getMap, getDirectionsRenderer } from "./googleMap.js";


export function calcularRuta(origen, destino, modo = "DRIVING") {
  const map = getMap();
  const directionsRenderer = getDirectionsRenderer();

  if (!map || !directionsRenderer) {
    console.error("Mapa o directionsRenderer no inicializados");
    return;
  }

  const directionsService = new google.maps.DirectionsService();

  const request = {
    origin: origen,
    destination: destino,
    travelMode: google.maps.TravelMode[modo],
  };

  directionsService.route(request, (result, status) => {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsRenderer.setDirections(result);
      console.log("Ruta calculada con éxito");
    } else {
      console.error("Error al calcular la ruta:", status);
    }
  });
}
