// Para acceder a los elementos del HTML ya no usamos document.getElementById —
// usamos document.querySelector, que acepta cualquier selector CSS (#id, .clase,
// etiqueta...) y no solo ids. Por ejemplo: document.querySelector("#filtro-nombre").

async function obtenerPersonajes() {
  const respuesta = await fetch("https://rickandmortyapi.com/api/character");
  const datos = await respuesta.json();
  return datos.results;
}

function filtrarPorEstado(personajes, estado) {
  if (estado === ""){
    return personajes;
  }
  else {
    return personajes.filter(function (personaje) {
    return personaje.status.toLowerCase() === estado;
  });
  } 
}

function filtrarPorEspecie(personajes, especie) {
  if (especie === ""){
    return personajes;
  }
  else {
    return personajes.filter(function (personaje) {
      return personaje.species === especie;
    });
  }
}

/* function obtenerNombres(personajes) {
  return personajes.map(function (personaje) {
    return personaje.name;
  });
} */

function hayPersonajesMuertos(personajes) {
  return personajes.some(function (personaje) {
    return personaje.status === "Dead";
  });
}

function todosVivos(personajes) {
  return personajes.every(function (personaje) {
    return personaje.status === "Alive";
  });
}


function ordenarPorNombre(personajes) {
  return [...personajes].sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });
}

function primeros(personajes, cantidad) {
  return personajes.slice(0,cantidad);
}

/* function posicionDeNombre(nombres, nombre) {
  return nombres.indexOf(nombre);
} */

function contarVivos(personajes) {
  return personajes.reduce(function (total, personaje) {
    return personaje.status === "Alive" ? total + 1 : total;
  }, 0);
}

function contarMuertos(personajes) {
  return personajes.reduce(function (total, personaje) {
    return personaje.status === "Dead" ? total + 1 : total;
  }, 0);
}

function contarDesconocidos(personajes) {
  return personajes.reduce(function (total, personaje) {
    return personaje.status === "unknown" ? total + 1 : total;
  }, 0);
}

let personajes = [];
let ordenAscendente = false;

function limpiarFiltros() {
  document.querySelector("#filtro-nombre").value = "";
  document.querySelector("#filtro-estado").value = "";
  document.querySelector("#filtro-especie").value = "";
  document.querySelector("#solo-diez-personajes").checked = false;
  document.querySelector("#orden-alfabetico").textContent = "ordenar A-Z";
  ordenAscendente = false;
  aplicarFiltros();
}

function aplicarFiltros() {
  const nombre = document.querySelector("#filtro-nombre").value.trim().toLowerCase();
  const estado = document.querySelector("#filtro-estado").value;
  const especie = document.querySelector("#filtro-especie").value;
  const mostrarSoloDiez = document.querySelector("#solo-diez-personajes").checked;

  let filtrados = filtrarPorEstado(personajes, estado);
  filtrados = filtrarPorEspecie(filtrados, especie);
  filtrados = filtrados.filter(function (personaje) {
    return personaje.name.toLowerCase().includes(nombre);
  });

  if (ordenAscendente) {
    filtrados = ordenarPorNombre(filtrados);
  }

  if (mostrarSoloDiez) {
    filtrados = primeros(filtrados, 10)
  }

  pintarResultados(filtrados);
}

function pintarResultados(lista) {
  const contenedor = document.querySelector("#resultados");
  const estadisticas = document.querySelector("#estadisticas");

  document.querySelector("#contador").textContent = lista.length + " personajes encontrados";

  const vivos = contarVivos(lista);

  const muertos = contarMuertos(lista);

  const desconocidos = contarDesconocidos(lista);

  if (todosVivos(lista)) {
    estadisticas.textContent = vivos + " vivos · " + muertos + " muertos · " + desconocidos + " desconocidos" + ". Todos vivos";
  }   else if (hayPersonajesMuertos(lista)) {
    estadisticas.textContent = vivos + " vivos · " + muertos + " muertos · " + desconocidos + " desconocidos" + ". Hay muertos";
  } else {
    estadisticas.textContent = vivos + " vivos · " + muertos + " muertos · " + desconocidos + " desconocidos"
  }

  contenedor.innerHTML = lista
    .map(function (personaje) {
      return (
        '<article class="personaje-card">' +
        '<img src="' + personaje.image + '" alt="' + personaje.name + '" />' +
        "<h3>" + personaje.name + "</h3>" +
        "<p>" + personaje.status + " · " + personaje.species + "</p>" +
        "</article>"
      );
    })
    .join("");
}


document.querySelector("#filtro-nombre").addEventListener("input", aplicarFiltros);
document.querySelector("#filtro-estado").addEventListener("change", aplicarFiltros);
document.querySelector("#filtro-especie").addEventListener("change", aplicarFiltros);
document.querySelector("#solo-diez-personajes").addEventListener("change", aplicarFiltros);
document.querySelector("#limpiar-filtros").addEventListener("click", limpiarFiltros);
document.querySelector("#orden-alfabetico").addEventListener("click", function () {
  ordenAscendente = !ordenAscendente;
  this.classList.toggle("activo", ordenAscendente);
  aplicarFiltros();
});

const botonOrden = document.querySelector("#orden-alfabetico");
if (ordenAscendente) {
  botonOrden.classList.add("activo");
}

obtenerPersonajes().then(function (datos) {
  personajes = datos;
  aplicarFiltros();
});