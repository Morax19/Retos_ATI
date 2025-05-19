// Configuración del idioma de la página
const pathName = window.location.pathname;
const fileName = pathName.substring(pathName.lastIndexOf('/') + 1);

const langPage = new URLSearchParams(window.location.search);

if (!langPage.has("lang")) {
    langPage.set("lang", "es");
    window.location.search = langPage.toString();
    console.log(langPage.get("lang"));
}

//  Carga del los datos iniciales
async function initData(lang) {
    console.log("Cargando JSON...");
    let idioma = lang;

    if (idioma === "es") {
        idioma = "configES.json";
    }
    else if (idioma === "en"){
        idioma = "configEN.json";
    }
    else if (idioma === "pt"){
        idioma = "configPT.json";
    }
    else{
        idioma = "configES.json";
    }

    try{
        const response = await fetch(`conf/${idioma}`);
        const data = await response.json();
        console.log("JSON Cargado");

        const dataColor = document.getElementById("favColor1");
        dataColor.textContent = data.color;

        const dataBook = document.getElementById("favBook1");
        dataBook.textContent = data.libro;

        const dataMusic = document.getElementById("favMusic1");
        dataMusic.textContent = data.musica;

        const dataGames = document.getElementById("favGames1");
        dataGames.textContent = data.video_juego;

        const dataLang = document.getElementById("favLang1");
        dataLang.textContent = data.lenguajes;

        const dataEmail = document.getElementById("email1");
        dataEmail.textContent = data.email;
    }
    catch (error){
        console.error("Error cargando el JSON:", error);
    }
}

//  Perfil.html
//  Carga de datos
async function fetchDataPerfil(cedula) {
    console.log("Cargando datos...");
    let CI = cedula ? cedula : "27795163";
    
    try {
        const response = await fetch(`${CI}/perfil.json`);
        const profileData = await response.json();
        console.log("Datos de perfil cargados.");

        const imgPerfil = document.getElementById("imgPerfil");
        imgPerfil.src = `${CI}/${profileData.imagen}`;
        imgPerfil.alt = `Imagen de perfil de ${profileData.nombre}`;

        const name = document.getElementById("name");
        name.textContent = profileData.nombre;

        const dataColor = document.getElementById("favColor2");
        dataColor.textContent = profileData.color;

        const dataBook = document.getElementById("favBook2");
        dataBook.textContent = profileData.libro;

        const dataMusic = document.getElementById("favMusic2");
        dataMusic.textContent = profileData.musica;

        const dataGames = document.getElementById("favGames2");
        dataGames.textContent = profileData.video_juego;

        const dataLang = document.getElementById("favLang2");
        dataLang.textContent = profileData.lenguajes;

        const dataEmail = document.getElementById("email2");
        dataEmail.textContent = profileData.email;

    } catch (error) {
        console.error("Error al cargar el archivo JSON:", error);
    }
}

if (fileName === "perfil.html") {
    document.addEventListener("DOMContentLoaded", function () {
        const URLParams = new URLSearchParams(window.location.search);
        const CI = URLParams.get("CI");
        const lang = URLParams.get("lang");
        initData(lang);
        fetchDataPerfil(CI);
    })
}

//  Index.html
//  Carga de datos
async function initIndex(lang) {
    console.log("Cargando JSON...");
    let idioma = lang;

    if (idioma === "es") {
        idioma = "configES.json";
    }
    else if (idioma === "en"){
        idioma = "configEN.json";
    }
    else if (idioma === "pt"){
        idioma = "configPT.json";
    }
    else{
        idioma = "configES.json";
    }

    try {
        const response = await fetch(`conf/${idioma}`);
        const index = await response.json();

        const profileData = await fetch("27795163/perfil.json");
        const profile = await profileData.json();
        
        console.log("JSON Cargado");

        const dataATI = document.getElementById("ATI");
        index.sitio.forEach(element => {dataATI.textContent = dataATI.textContent + ' ' + element});

        const dataSaludo = document.getElementById("Saludo");
        dataSaludo.textContent = index.saludo + ", " + profile.nombre;

        const dataSearch = document.getElementById("Bar");
        dataSearch.textContent = index.buscar;

        const dataFooter = document.getElementById("textFooter");
        dataFooter.textContent = index.copyRight;

    } catch (error) {
        console.error("Error al cargar el archivo index:", error);
    }
}

async function fecthStudentData() {
    console.log("Cargando alumnos...");

    try {
        const response = await fetch('datos/index.json');
        const studentData = await response.json();
        console.log("Alumnos cargados.");

        // Cargando los alumos en la pagina
        const contenedorPrincipal = document.getElementById('contenedor-principal'); // Asegúrate de tener un elemento con este ID en tu HTML

        if (contenedorPrincipal && Array.isArray(alumnos)) {
            alumnos.forEach(persona => {
                // Crear el elemento <ul>
                const ulElement = document.createElement('ul');
                ulElement.classList.add('cuadro-informativo');
                ulElement.addEventListener('click', function () {
                    const ci = persona.ci; // Cambia esto según la estructura de tu JSON
                    window.location.href = `perfil.html?ci=${persona.ci}`; // Cambia esto según la estructura de tu URL
                }
                );
                // Crear el elemento <li>
                const liElement = document.createElement('li');
                liElement.classList.add('titulo-cuadro');

                // Crear la imagen <img>
                const imgElement = document.createElement('img');
                imgElement.classList.add('img-index');
                imgElement.src = `${persona.imagen}`; // Usamos la ruta de la imagen del JSON
                imgElement.alt = persona.nombre; // Usamos el nombre como texto alternativo

                // Crear el párrafo <p> para el nombre
                const pElement = document.createElement('p');
                pElement.classList.add('contenido-cuadro');
                pElement.textContent = persona.nombre;

                // Agregar la imagen y el párrafo al <li>
                liElement.appendChild(imgElement);
                liElement.appendChild(pElement);

                // Agregar el <li> al <ul>
                ulElement.appendChild(liElement);

                // Agregar el <ul> al contenedor principal en tu HTML
                contenedorPrincipal.appendChild(ulElement);
            });
        } else {
            console.error('El contenedor principal no se encontró o los datos JSON no son un array.');
        }

    } catch (error) {
        console.error('Error al cargar el archivo JSON:', error);
    }
}