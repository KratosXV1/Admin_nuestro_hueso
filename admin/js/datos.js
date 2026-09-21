const CLAVE_PRODUCTOS = "productos";
const CLAVE_USUARIOS = "usuarios";
const CLAVE_ADMIN = "adminActivo";

const PRODUCTOS_INICIALES = [
    {
        id: 1,
        nombre: "PEDIGREE CACHORRO",
        precio: 25000,
        descripcion: "Alimento completo y balanceado para cachorros.",
        imagen: "img/comida_perro.png"
    },
    {
        id: 2,
        nombre: "PURINA CAT CHOW",
        precio: 25000,
        descripcion: "Nutrición especializada para gatos adultos.",
        imagen: "img/comida_gato.png"
    },
    {
        id: 3,
        nombre: "SNACK DENTAL PERRO",
        precio: 6000,
        descripcion: "Snack para cuidado oral diario de tu mascota.",
        imagen: "img/snack.png"
    },
    {
        id: 4,
        nombre: "ARENA SANITARIA GATO",
        precio: 10000,
        descripcion: "Arena aglomerante de alta absorción y control de olor.",
        imagen: "img/arena.png"
    }
];

const ADMIN_INICIAL = {
    run: "11111111",
    nombre: "Admin",
    apellidos: "Nuestro Hueso",
    correo: "admin@gmail.com",
    password: "admin123",
    telefono: "",
    fechaNacimiento: "",
    direccion: "Av. Las Huellitas 1024",
    region: "Región Metropolitana de Santiago",
    comuna: "Santiago",
    rol: "Administrador"
};

function sembrarDatosCompartidos() {
    if (!localStorage.getItem(CLAVE_PRODUCTOS)) {
        localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(PRODUCTOS_INICIALES));
    }

    let usuarios = JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
    let hayAdmin = false;
    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].correo && usuarios[i].correo.toLowerCase() === ADMIN_INICIAL.correo) {
            hayAdmin = true;
            break;
        }
    }
    if (!hayAdmin) {
        usuarios.push(ADMIN_INICIAL);
        localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
    }
}

function obtenerProductos() {
    sembrarDatosCompartidos();
    return JSON.parse(localStorage.getItem(CLAVE_PRODUCTOS)) || [];
}

function guardarProductos(lista) {
    localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(lista));
}

function obtenerUsuarios() {
    sembrarDatosCompartidos();
    return JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
}

function rutaImagenTienda(ruta) {
    if (!ruta) return "";
    if (ruta.indexOf("http://") === 0 || ruta.indexOf("https://") === 0 || ruta.indexOf("data:") === 0) {
        return ruta;
    }
    return "../pets/" + ruta;
}
