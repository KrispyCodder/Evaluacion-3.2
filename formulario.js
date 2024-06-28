import { edit, getAll, remove, save, selectOne, checkarNombre, subirImagen } from "./firebase.js";
let id = 0;
let originalName = "";

document.getElementById('btnGuardar').addEventListener('click', async () => {
    document.querySelectorAll('.form-control').forEach(item => {
        verificar(item.id);
    });

    const nombre = document.getElementById('nombre').value.trim();
    const isEditing = id !== 0;

    if (document.querySelectorAll('.is-invalid').length === 0) {
        // Checkar el nombre solo si no se está editando o si el nombre ha cambiado
        if (!isEditing || (isEditing && nombre !== originalName)) {
            if (await checkarNombre(nombre)) {
                Swal.fire({
                    title: "ERROR",
                    icon: "error",
                    text: "Se original, no repitas nombres",
                    confirmButtonColor: '#00ffe1',
                    customClass: {
                        confirmButton: 'swal2-confirmm'
                    }
                });
                return;
            }
        }

        const url = await subirImagen(); // Espera a que se suba la imagen y obtener la URL
        console.log(url);

        if (document.querySelectorAll('.is-invalid').length === 0) {
            const sexo = document.querySelector('input[name="sexo"]:checked');
            const sexoValue = sexo ? sexo.value : '';

            const per = {
                nombre: nombre,
                apellido: document.getElementById('apellido').value,
                clase: document.getElementById('clase').value,
                raza: document.getElementById('raza').value,
                fecha: document.getElementById('fecha').value,
                sexo: sexoValue,
                url: url
            };

            if (!isEditing) {
                save(per);
                Swal.fire('☺', 'Personaje Registrado', 'success');
            } else {
                edit(id, per);
                Swal.fire('☺', 'Personaje Editado', 'success');
                id = 0;
            }
            limpiar();
        }
    }
});

window.addEventListener('DOMContentLoaded', () => {
    getAll(personajes => {
        let tabla = '';
        personajes.forEach(doc => {
            const item = doc.data();
            tabla += `<tr>
                <td>${item.nombre}</td>
                <td>${item.apellido}</td>
                <td>${item.clase}</td>
                <td>${item.raza}</td>
                <td>${item.fecha}</td>
                <td>${item.sexo}</td>
                <td><img src="${item.url}" width="50" /></td>
                <td nowrap>
                    <button class="btn btn-danger" id="${doc.id}">Eliminar</button>
                    <button class="btn btn-warning" id="${doc.id}">Editar</button>
                </td>
            </tr>`;
        });
        document.getElementById('contenido').innerHTML = tabla;
        document.querySelectorAll('.btn-danger').forEach(btn => {
            btn.addEventListener('click', () => {
                Swal.fire({
                    title: "¿Está seguro que desea eliminar el registro?",
                    text: "No podrá revertir los cambios",
                    icon: "error",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Eliminar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        remove(btn.id);
                        Swal.fire({
                            title: "Eliminado!",
                            text: "Su registro ha sido eliminado.",
                            icon: "success"
                        });
                    }
                });
            });
        });
        document.querySelectorAll('.btn-warning').forEach(btn => {
            btn.addEventListener('click', async () => {
                const emp = await selectOne(btn.id);
                const item = emp.data();
                document.getElementById('nombre').value = item.nombre;
                document.getElementById('apellido').value = item.apellido;
                document.getElementById('clase').value = item.clase;
                document.getElementById('raza').value = item.raza;
                document.getElementById('fecha').value = item.fecha;
                document.querySelector(`input[name="sexo"][value="${item.sexo}"]`).checked = true;
                document.getElementById('btnGuardar').value = 'Editar';
                id = btn.id;
                originalName = item.nombre; // Guarda el nombre original del registro que se está editando
            });
        });
    });
});
