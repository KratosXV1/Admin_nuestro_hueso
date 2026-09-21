sembrarDatosCompartidos();

const adminGuardado = sessionStorage.getItem(CLAVE_ADMIN);
if (!adminGuardado) {
    window.location.href = "index.html";
}

const admin = JSON.parse(adminGuardado);
document.getElementById("saludoAdmin").textContent = "Hola, " + admin.nombre;

const tabProductos = document.getElementById("tabProductos");
const tabUsuarios = document.getElementById("tabUsuarios");
const vistaProductos = document.getElementById("vistaProductos");
const vistaUsuarios = document.getElementById("vistaUsuarios");
const formProducto = document.getElementById("formProducto");
const productoId = document.getElementById("productoId");
const nombre = document.getElementById("nombre");
const precio = document.getElementById("precio");
const descripcion = document.getElementById("descripcion");
const imagen = document.getElementById("imagen");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const cuerpoProductos = document.getElementById("cuerpoProductos");
const cuerpoUsuarios = document.getElementById("cuerpoUsuarios");

function mostrarProductos() {
    vistaProductos.classList.remove("oculto");
    vistaUsuarios.classList.add("oculto");
    tabProductos.classList.add("activo");
    tabUsuarios.classList.remove("activo");
}

function mostrarUsuarios() {
    vistaProductos.classList.add("oculto");
    vistaUsuarios.classList.remove("oculto");
    tabProductos.classList.remove("activo");
    tabUsuarios.classList.add("activo");
    renderizarUsuarios();
}

function limpiarErrores() {
    document.getElementById("errorNombre").textContent = "";
    document.getElementById("errorPrecio").textContent = "";
    document.getElementById("errorDescripcion").textContent = "";
    document.getElementById("errorImagen").textContent = "";
}

function resetFormulario() {
    formProducto.reset();
    productoId.value = "";
    btnGuardar.textContent = "Agregar producto";
    limpiarErrores();
}

function validarProducto() {
    limpiarErrores();
    let ok = true;

    if (nombre.value.trim() === "") {
        document.getElementById("errorNombre").textContent = "El nombre es obligatorio.";
        ok = false;
    }

    let precioNum = Number(precio.value);
    if (!precioNum || precioNum < 1) {
        document.getElementById("errorPrecio").textContent = "Ingrese un precio mayor a 0.";
        ok = false;
    }

    if (descripcion.value.trim() === "") {
        document.getElementById("errorDescripcion").textContent = "La descripción es obligatoria.";
        ok = false;
    }

    if (imagen.value.trim() === "") {
        document.getElementById("errorImagen").textContent = "Indique la ruta de la imagen.";
        ok = false;
    }

    return ok;
}

function renderizarProductos() {
    let lista = obtenerProductos();
    cuerpoProductos.innerHTML = "";

    if (lista.length === 0) {
        cuerpoProductos.innerHTML = '<tr><td colspan="5" class="vacio">No hay productos. Agregue el primero.</td></tr>';
        return;
    }

    for (let i = 0; i < lista.length; i++) {
        let p = lista[i];
        let tr = document.createElement("tr");
        tr.innerHTML =
            '<td><img class="mini" src="' + rutaImagenTienda(p.imagen) + '" alt=""></td>' +
            "<td>" + p.nombre + "</td>" +
            '<td class="precio-celda">$' + p.precio + " CLP</td>" +
            "<td>" + p.descripcion + "</td>" +
            '<td class="fila-botones">' +
                '<button type="button" data-editar="' + p.id + '">Editar</button>' +
                '<button type="button" data-precio="' + p.id + '">Precio</button>' +
                '<button type="button" class="peligro" data-borrar="' + p.id + '">Eliminar</button>' +
            "</td>";
        cuerpoProductos.appendChild(tr);
    }
}

function renderizarUsuarios() {
    let lista = obtenerUsuarios();
    cuerpoUsuarios.innerHTML = "";

    if (lista.length === 0) {
        cuerpoUsuarios.innerHTML = '<tr><td colspan="7" class="vacio">No hay usuarios registrados.</td></tr>';
        return;
    }

    for (let i = 0; i < lista.length; i++) {
        let u = lista[i];
        let tr = document.createElement("tr");
        tr.innerHTML =
            "<td>" + (u.run || "-") + "</td>" +
            "<td>" + (u.nombre || "") + " " + (u.apellidos || "") + "</td>" +
            "<td>" + (u.correo || "") + "</td>" +
            "<td>" + (u.rol || "Cliente") + "</td>" +
            "<td>" + (u.region || "-") + "</td>" +
            "<td>" + (u.comuna || "-") + "</td>" +
            "<td>" + (u.direccion || "-") + "</td>";
        cuerpoUsuarios.appendChild(tr);
    }
}

function cargarEnFormulario(id) {
    let lista = obtenerProductos();
    for (let i = 0; i < lista.length; i++) {
        if (lista[i].id === id) {
            productoId.value = lista[i].id;
            nombre.value = lista[i].nombre;
            precio.value = lista[i].precio;
            descripcion.value = lista[i].descripcion;
            imagen.value = lista[i].imagen;
            btnGuardar.textContent = "Guardar cambios";
            mostrarProductos();
            nombre.focus();
            return;
        }
    }
}

function siguienteId(lista) {
    let max = 0;
    for (let i = 0; i < lista.length; i++) {
        if (lista[i].id > max) {
            max = lista[i].id;
        }
    }
    return max + 1;
}

tabProductos.addEventListener("click", function (e) {
    e.preventDefault();
    mostrarProductos();
});

tabUsuarios.addEventListener("click", function (e) {
    e.preventDefault();
    mostrarUsuarios();
});

document.getElementById("btnCerrar").addEventListener("click", function () {
    sessionStorage.removeItem(CLAVE_ADMIN);
    window.location.href = "index.html";
});

btnCancelar.addEventListener("click", resetFormulario);

formProducto.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validarProducto()) {
        return;
    }

    let lista = obtenerProductos();
    let idActual = productoId.value ? Number(productoId.value) : 0;

    if (idActual) {
        for (let i = 0; i < lista.length; i++) {
            if (lista[i].id === idActual) {
                lista[i].nombre = nombre.value.trim();
                lista[i].precio = Number(precio.value);
                lista[i].descripcion = descripcion.value.trim();
                lista[i].imagen = imagen.value.trim();
                break;
            }
        }
        guardarProductos(lista);
        alert("Producto actualizado.");
    } else {
        lista.push({
            id: siguienteId(lista),
            nombre: nombre.value.trim(),
            precio: Number(precio.value),
            descripcion: descripcion.value.trim(),
            imagen: imagen.value.trim()
        });
        guardarProductos(lista);
        alert("Producto agregado.");
    }

    resetFormulario();
    renderizarProductos();
});

cuerpoProductos.addEventListener("click", function (e) {
    let boton = e.target;
    if (boton.getAttribute("data-editar")) {
        cargarEnFormulario(Number(boton.getAttribute("data-editar")));
        return;
    }

    if (boton.getAttribute("data-precio")) {
        let id = Number(boton.getAttribute("data-precio"));
        let lista = obtenerProductos();
        for (let i = 0; i < lista.length; i++) {
            if (lista[i].id === id) {
                let nuevo = prompt("Nuevo precio para " + lista[i].nombre + " (CLP):", lista[i].precio);
                if (nuevo === null) {
                    return;
                }
                let valor = Number(nuevo);
                if (!valor || valor < 1) {
                    alert("Precio inválido.");
                    return;
                }
                lista[i].precio = valor;
                guardarProductos(lista);
                renderizarProductos();
                return;
            }
        }
    }

    if (boton.getAttribute("data-borrar")) {
        let id = Number(boton.getAttribute("data-borrar"));
        if (!confirm("¿Eliminar este producto?")) {
            return;
        }
        let lista = obtenerProductos();
        let filtrada = [];
        for (let i = 0; i < lista.length; i++) {
            if (lista[i].id !== id) {
                filtrada.push(lista[i]);
            }
        }
        guardarProductos(filtrada);
        resetFormulario();
        renderizarProductos();
    }
});

renderizarProductos();
