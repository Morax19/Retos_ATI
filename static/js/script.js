// Configuración del idioma de la página
const pathName = window.location.pathname;
const fileName = pathName.substring(pathName.lastIndexOf('/') + 1);


// Redirect to default URL if pathname is empty or doesn't include a filename
if (!fileName || fileName === "") {
    window.location.pathname = "/index.html";
}


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
        const response = await fetch(`/data/conf/${idioma}`);
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
        dataEmail.textContent = data.email + ": ";
    }
    catch (error){
        console.error("Error cargando el JSON:", error);
    }
}

//  Carga de datos
async function fetchDataPerfil(cedula) {
    console.log("Cargando datos...");
    let CI = cedula ? cedula : "27795163";
    
    try {
        const response = await fetch(`/data/${CI}/perfil.json`);
        const profileData = await response.json();
        console.log("Datos de perfil cargados.");

        document.title = `${profileData.nombre}`;

        const imgPerfil = document.getElementById("imgPerfil");
        imgPerfil.src = `/data/${CI}/${profileData.imagen}`;
        imgPerfil.alt = `Imagen de perfil de ${profileData.nombre}`;

        const name = document.getElementById("name");
        name.textContent = profileData.nombre;

        const description = document.getElementById("description");
        description.textContent = profileData.descripcion;

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
        dataEmail.href = `mailto:${profileData.email}`;

    } catch (error) {
        console.error("Error al cargar el archivo JSON:", error);
    }
}

// SPA: Render de perfil de forma dinámica
function renderProfileView(profileData) {
    const profileView = document.getElementById("profileView");
    profileView.innerHTML = `
    <div class="main">
        <picture class="imgContainer">
            <img id="imgPerfil" src="/data/${profileData.ci}/${profileData.imagen}" alt="Imagen de perfil de ${profileData.nombre}">
        </picture>
        <div class="textContainer">
            <h1 id="name">${profileData.nombre}</h1>
            <p id="description">${profileData.descripcion}</p>
            <table>
                <tr><td id="favColor2">${profileData.color}</td></tr>
                <tr><td id="favBook2">${profileData.libro}</td></tr>
                <tr><td id="favMusic2">${profileData.musica}</td></tr>
                <tr><td id="favGames2">${profileData.video_juego}</td></tr>
                <tr><td id="favLang2"><b>${profileData.lenguajes}</b></td></tr>
            </table>
            <div class="emailContainer">
                <a id="email2" href="mailto:${profileData.email}">${profileData.email}</a>
            </div>
            <button id="backButton">Volver</button>
        </div>
    </div>
    `;
    document.getElementById("mainView").style.display = "none";
    profileView.style.display = "block";
    document.getElementById("backButton").onclick = function() {
        history.pushState({}, '', '/');
        showMainView();
    };
}

function showMainView() {
    document.getElementById("profileView").style.display = "none";
    document.getElementById("mainView").style.display = "block";
}

// SPA: Render perfil al hacer click a un estudiante
async function fecthStudentData() {
    console.log("Cargando alumnos...");
    try {
        const response = await fetch('/data/index.json');
        const studentData = await response.json();
        console.log("Alumnos cargados.");
        const mainContainer = document.getElementById("mainContainer");
        mainContainer.innerHTML = '';
        if (mainContainer && Array.isArray(studentData)) {
            studentData.forEach(student => {
                const ulProfile = document.createElement("ul");
                ulProfile.classList.add("profileContainer");
                ulProfile.addEventListener("click", function (e) {
                    e.preventDefault();
                    history.pushState({ci: student.ci}, '', `?ci=${student.ci}`);
                    loadProfile(student.ci);
                });
                const titleProfile = document.createElement("li");
                titleProfile.classList.add("titleContainer");
                const imgProfile = document.createElement("img");
                imgProfile.classList.add("studentImg");
                imgProfile.src = `/data/${student.imagen}`;
                imgProfile.alt = `Imagen de perfil de ${student.nombre}`;
                const profileName = document.createElement("p");
                profileName.classList.add("studentName");
                profileName.textContent = student.nombre;
                titleProfile.appendChild(imgProfile);
                titleProfile.appendChild(profileName);
                ulProfile.appendChild(titleProfile);
                mainContainer.appendChild(ulProfile);
            });
        } else {
            console.error("Error al cargar la lista de estudiantes.");
        }
    } catch (error) {
        console.error("Error cargando el JSON: ", error);
    }
}

// SPA: Cargar perfil y renderizar info
async function loadProfile(ci) {
    try {
        const response = await fetch(`/data/${ci}/perfil.json`);
        const profileData = await response.json();
        renderProfileView({...profileData, ci});
    } catch (error) {
        console.error("Error al cargar el perfil:", error);
    }
}

// SPA: Manejo de rutas
function handleRoute() {
    const params = new URLSearchParams(window.location.search);
    const ci = params.get('ci');
    if (ci) {
        loadProfile(ci);
    } else {
        showMainView();
    }
}

window.addEventListener('popstate', handleRoute);

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
        const response = await fetch(`/data/conf/${idioma}`);
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

// Cargando los alumos en la pagina
async function fecthStudentData() {
    console.log("Cargando alumnos...");

    try {
        const response = await fetch('/data/index.json');
        const studentData = await response.json();
        console.log("Alumnos cargados.");

        const mainContainer = document.getElementById("mainContainer");

        if (mainContainer && Array.isArray(studentData)) {
            studentData.forEach(student => {
                const ulProfile = document.createElement("ul");
                ulProfile.classList.add("profileContainer");
                ulProfile.addEventListener("click", function () {
                    const CI = student.ci;
                    window.location.href = `perfil.html?ci=${CI}`;
                });

                const titleProfile = document.createElement("li");
                titleProfile.classList.add("titleContainer");

                const imgProfile = document.createElement("img");
                imgProfile.classList.add("studentImg");
                imgProfile.src = `${student.imagen}`;
                imgProfile.alt = `Imagen de perfil de ${student.nombre}`

                const profileName = document.createElement("p");
                profileName.classList.add("studentName");
                profileName.textContent = student.nombre;

                titleProfile.appendChild(imgProfile);
                titleProfile.appendChild(profileName);

                ulProfile.appendChild(titleProfile);

                mainContainer.appendChild(ulProfile);
            });
        } else {
            console.error("Error al cargar la lista de estudiantes.");
        }

    } catch (error) {
        console.error("Error cargando el JSON: ", error);
    }
}

if (fileName === "index.html") {
    document.addEventListener("DOMContentLoaded", function () {
        const urlParams = new URLSearchParams(window.location.search);
        const lang = urlParams.get('lang'); 
        initIndex(lang);
        fecthStudentData();
        handleRoute();

        indexButton = document.getElementById("Button");

        indexButton.addEventListener("click", function () {
            if (document.getElementById("errorMsg")) {
                document.getElementById("errorMsg").remove();
            }

            const inputData = document.getElementById("Bar");
            strData = (inputData.value).toString();
            strData = strData.toUpperCase();
            console.log(strData);

            const mainContainer = document.getElementById("mainContainer");
            const ulStudents = mainContainer.querySelectorAll("ul");
            let it = 0;
            
            ulStudents.forEach(function (lista) {
                const studentName = lista.querySelector(".studentName").textContent;
                const studentNameUPPER = studentName.toUpperCase();
                const isIn = studentNameUPPER.includes(strData);
                console.log(isIn);
             if (!isIn) {
                    lista.style.display = 'none';
                    it++;
                }else {
                    lista.style.display = 'block';
                }
            });

            if (it === ulStudents.length) {
                document.getElementById("mainContainer").insertAdjacentHTML("beforeend", `<h2 id="errorMsg">No hay alumnos que tengan en su nombre: ${strData}</h2>`);
                document.getElementById("errorMsg").style.color = rgb(49, 50, 53);
            }
        });
    })
}