// Variables globales o en un scope accesible
export let origenPlace = null;
export let destinoPlace = null;


export function initAutocomplete() {
  const inputOrigen = document.getElementById("origen");
  const inputDestino = document.getElementById("destino");

  if (!inputOrigen || !inputDestino) {
    console.error("Inputs de origen/destino no encontrados en el DOM");
    return;
  }

  const autocompleteOrigen = new google.maps.places.Autocomplete(inputOrigen);
  const autocompleteDestino = new google.maps.places.Autocomplete(inputDestino);

  autocompleteOrigen.addListener("place_changed", () => {
    const place = autocompleteOrigen.getPlace();

    if (!place.geometry) {
      console.error(
        "El lugar seleccionado en ORIGEN no tiene detalles de ubicación."
      );
      origenPlace = null;
      return;
    }

    origenPlace = {
      location: place.geometry.location, // LatLng
      address: place.formatted_address, // Dirección
    };

    console.log("Origen seleccionado:", origenPlace);
  });

  autocompleteDestino.addListener("place_changed", () => {
    const place = autocompleteDestino.getPlace();

    if (!place.geometry) {
      console.error(
        "El lugar seleccionado en DESTINO no tiene detalles de ubicación."
      );
      destinoPlace = null;
      return;
    }

    destinoPlace = {
      location: place.geometry.location, // LatLng
      address: place.formatted_address, // Dirección
    };

    console.log("Destino seleccionado:", destinoPlace);
  });

  console.log("Autocomplete inicializado correctamente");
}
