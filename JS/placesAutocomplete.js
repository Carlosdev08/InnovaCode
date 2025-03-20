

export function initAutocomplete() {
  const inputOrigen = document.getElementById("origen");
  const inputDestino = document.getElementById("destino");

  if (!inputOrigen || !inputDestino) {
    console.error("Inputs de origen/destino no encontrados en el DOM");
    return;
  }

  const autocompleteOrigen = new google.maps.places.Autocomplete(inputOrigen);
  const autocompleteDestino = new google.maps.places.Autocomplete(inputDestino);

  console.log("Autocomplete inicializado correctamente");
}
