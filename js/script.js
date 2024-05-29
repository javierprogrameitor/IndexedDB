
let btnAddNote = document.getElementById('btnAddNote');
let btnRemoveAll = document.getElementById('btnRemoveAll');
let notesContainer = document.getElementById('notesContainer');


function startBD() {
    let request = window.indexedDB.open("notas");
    request.addEventListener("error", viewError);
    request.addEventListener("success", startBDSuccess);
    request.addEventListener("upgradeneeded", wareHouse);
}

function viewError(event) {
    alert("Error: " + event.code + " - " + event.message);
}

function startBDSuccess(event) {
    bd = event.target.result;
    console.log("Base de datos abierta");
}

function wareHouse(event) {
    let ddbb = event.target.result;

    if (!ddbb.objectStoreNames.contains("Anotaciones")) {
        let objectStore = ddbb.createObjectStore("Anotaciones", { keyPath: "id", autoIncrement: true });
        objectStore.createIndex("Notes", "noteText", { unique: false });
        console.log("Base de datos creada");

    }
}

function addNoteToDB(note, callback) {
    let transaction = bd.transaction(["Anotaciones"], "readwrite");
    let objectStore = transaction.objectStore("Anotaciones");
    let request = objectStore.add(note);

    request.addEventListener("success", function (event) {
        let key = event.target.result;
        console.log("Nota agregada a la base de datos con clave: " + key);
        if (typeof callback === 'function') {
            callback(key);
        }
    });

    request.addEventListener("error", function () {
        console.log("Error al agregar nota a la base de datos");
    });
}

function removeNoteFromDB(noteId) {
    let transaction = bd.transaction(["Anotaciones"], "readwrite");
    let objectStore = transaction.objectStore("Anotaciones");
    let request = objectStore.delete(noteId);

    request.addEventListener("success", function () {
        console.log("Nota eliminada de la base de datos");
    });

    request.addEventListener("error", function () {
        console.log("Error al eliminar nota de la base de datos");
    });
}

function removeAllNotesFromDB() {
    let transaction = bd.transaction(["Anotaciones"], "readwrite");
    let objectStore = transaction.objectStore("Anotaciones");
    let request = objectStore.clear();

    request.addEventListener("success", function () {
        console.log("Todas las notas eliminadas de la base de datos");
    });

    request.addEventListener("error", function () {
        console.log("Error al eliminar todas las notas de la base de datos");
    });
}




// Mover la declaración de btnRemoveNote fuera de la función click de btnAddNote
let btnRemoveNote;

btnAddNote.addEventListener('click', function () {
    let note = document.createElement('div');
    note.classList.add('note');

    let textarea = document.createElement('textarea');
    textarea.placeholder = 'Escribe tu nota...';

    // Mover la declaración de btnRemoveNote aquí
    btnRemoveNote = document.createElement('button');
    btnRemoveNote.textContent = 'Eliminar Nota';

    btnRemoveNote.addEventListener('click', function () {
        let noteId = note.getAttribute('id');
        removeNoteFromDB(noteId);
        notesContainer.removeChild(note);
    });

    note.appendChild(textarea);
    note.appendChild(btnRemoveNote);

    notesContainer.appendChild(note);
    //nuevo codigo para obtener el id de la nota
    let noteText = textarea.value;
    addNoteToDB({ noteText: noteText }, function (key) {
        note.setAttribute('id', key);
    });

    // Guardar la nota cuando el textarea pierde el foco
    textarea.addEventListener('blur', function () {
        let noteText = textarea.value;

    if

        addNoteToDB({ noteText: noteText });
    });
});

btnRemoveAll.addEventListener('click', function () {
    removeAllNotesFromDB();
    notesContainer.innerHTML = '';
});



window.addEventListener("load", startBD);
