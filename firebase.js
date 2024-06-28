import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { addDoc, collection, deleteDoc, doc, getFirestore, onSnapshot, getDoc,  getDocs, query, where, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js"
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-storage.js";

 const firebaseConfig = {
    apiKey: "AIzaSyC7qcRgbqo6G9d4Dk1E3-z6A_7KKzuvenA",
    authDomain: "personajednd.firebaseapp.com",
    projectId: "personajednd",
    storageBucket: "personajednd.appspot.com",
    messagingSenderId: "235741430564",
    appId: "1:235741430564:web:90ef13b75e8d10ef8c69b1"
  };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
//getFirestore es una función que retorna la base de datos para su utilización
const db = getFirestore(app);
const storage = getStorage(app);
//export permite exportar solo las funciones que desean utilizar
//función para guardar los datos en la db
export const save = (per) => {
    //addDoc es una función de firestore que permite añadir un nuevo documento a la colección 
    //collection es una función de firestore que recibe la base de datos y el nombre de la colección
    addDoc(collection(db, 'Personajes'), per)
}

//función para traer los documentos de la colección 
export const getAll = (data) => {
    //onSnapshot es la función que permite retornar la colección y asignarla a una variable
    onSnapshot(collection(db, 'Personajes'), data)
}
//función para eliminar el documento seleccionado
export const remove = (id) => {
    //deleteDoc es una función de firestore que permite la eliminación de un documento
    //doc es una función firestore que permite buscar un documento por su id
    deleteDoc(doc(db, 'Personajes', id))
}

//función para seleccionar un elemento 
//getDoc es una función de firestore que permite retornar un documento
export const selectOne = (id) => getDoc(doc(db, 'Personajes', id))

//función para editar un registro
export const edit = (id, per) => {
    //función de firestore que permite actualizar el documento seleccionado 
    updateDoc(doc(db, 'Personajes', id), per)
}
export const checkarNombre = async (nombre) => {
    const q = query(collection(db, 'Personajes'), where('nombre', '==', nombre)); 
    const querySnapshot = await getDocs(q); 
    return !querySnapshot.empty;
}
onSnapshot(collection(db, 'Personajes'), (snapshot) => {
    const perData = [];
    snapshot.forEach(doc => {
        perData.push(doc.data());
    });
});
export async function subirImagen() {
    const fileInput = document.getElementById('imagenInput');
    const nombreper = document.getElementById('nombre');
    if (fileInput && fileInput.files.length > 0) {
        try {
            //URL de descarga
            const file = fileInput.files[0];
            const fileName = file.name;
            const storageRef = ref(storage, `Personajes/${nombreper}/${fileName}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            return downloadURL
        } catch (error) {
            console.error('Error al subir la imagen:', error);
            alert('Error al subir la imagen');
        }
    } else {
        alert('Por favor, selecciona una imagen');
    }
}
