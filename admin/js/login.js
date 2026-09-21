sembrarDatosCompartidos();

const form = document.getElementById("formLogin");
const correo = document.getElementById("correo");
const password = document.getElementById("password");
const errorCorreo = document.getElementById("errorCorreo");
const errorPassword = document.getElementById("errorPassword");

if (sessionStorage.getItem(CLAVE_ADMIN)) {
    window.location.href = "panel.html";
}

form.addEventListener("submit", function (e) {
    e.preventDefault();

    let c = correo.value.trim().toLowerCase();
    let p = password.value;
    let hayError = false;

    errorCorreo.textContent = "";
    errorPassword.textContent = "";

    if (c === "" || !c.endsWith("@gmail.com")) {
        errorCorreo.textContent = "Correo inválido. Use un @gmail.com.";
        hayError = true;
    }

    if (p.length < 4 || p.length > 10) {
        errorPassword.textContent = "Debe tener entre 4 y 10 caracteres.";
        hayError = true;
    }

    if (hayError) {
        return;
    }

    let usuarios = obtenerUsuarios();
    let admin = null;

    for (let i = 0; i < usuarios.length; i++) {
        let u = usuarios[i];
        if (u.correo.toLowerCase() === c && u.password === p) {
            admin = u;
            break;
        }
    }

    if (!admin) {
        alert("Correo o contraseña incorrectos.");
        return;
    }

    if (admin.rol !== "Administrador") {
        alert("Este usuario no tiene acceso de administrador.");
        return;
    }

    sessionStorage.setItem(CLAVE_ADMIN, JSON.stringify(admin));
    window.location.href = "panel.html";
});
