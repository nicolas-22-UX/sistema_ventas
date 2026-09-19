import { useEffect, useState } from 'react';
import api from '../services/api';
import './cliente.css';

const formVacio = {
  nomCliente: '',
  contacto: '',
  departamento: '',
  ciudad: '',
};

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const [form, setForm] = useState(formVacio);
  const [editandoId, setEditandoId] = useState(null); // null = modo agregar

  // ---------- LEER ----------
  const cargarClientes = () => {
    api.get('/clientes')
      .then(response => {
        setClientes(response.data);
        setCargando(false);
      })
      .catch(err => {
        setError('No se pudo cargar la lista de clientes');
        setCargando(false);
        console.error(err);
      });
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  // ---------- FORMULARIO ----------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const limpiarFormulario = () => {
    setForm(formVacio);
    setEditandoId(null);
  };

  // ---------- CREAR / ACTUALIZAR ----------
  const guardarCliente = () => {
    if (editandoId === null) {
      // Crear
      api.post('/clientes', form)
        .then(() => {
          setMensaje('Cliente guardado');
          limpiarFormulario();
          cargarClientes();
        })
        .catch(err => {
          setMensaje('Error al guardar el cliente');
          console.error(err);
        });
    } else {
      // Actualizar
      api.put(`/clientes/${editandoId}`, form)
        .then(() => {
          setMensaje('Cliente actualizado');
          limpiarFormulario();
          cargarClientes();
        })
        .catch(err => {
          setMensaje('Error al actualizar el cliente');
          console.error(err);
        });
    }
  };

  // ---------- EDITAR (carga los datos en el formulario) ----------
  const editarCliente = (c) => {
    setEditandoId(c.id_cliente);
    setForm({
      nomCliente: c.nomCliente,
      contacto: c.contacto,
      departamento: c.departamento,
      ciudad: c.ciudad,
    });
    setMensaje('');
  };

  // ---------- ELIMINAR ----------
  const eliminarCliente = (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este cliente?')) return;

    api.delete(`/clientes/${id}`)
      .then(() => {
        setMensaje('Cliente eliminado');
        if (editandoId === id) limpiarFormulario();
        cargarClientes();
      })
      .catch(err => {
        // Si tiene ventas asociadas, el backend responde 409 con el motivo
        const texto = typeof err.response?.data === 'string'
          ? err.response.data
          : 'Error al eliminar el cliente';
        setMensaje(texto);
        console.error(err);
      });
  };

  if (cargando) return <p>Cargando clientes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='clientes-page'>
      <div className='acciones'>
        <h2>{editandoId === null ? 'Agregar cliente' : `Editar cliente #${editandoId}`}</h2>

        <input
          name='nomCliente'
          placeholder='Nombre'
          value={form.nomCliente}
          onChange={handleChange}
        />
        <input
          name='contacto'
          placeholder='Contacto'
          value={form.contacto}
          onChange={handleChange}
        />
        <input
          name='departamento'
          placeholder='Departamento'
          value={form.departamento}
          onChange={handleChange}
        />
        <input
          name='ciudad'
          placeholder='Ciudad'
          value={form.ciudad}
          onChange={handleChange}
        />

        <button onClick={guardarCliente}>
          {editandoId === null ? 'Agregar' : 'Guardar cambios'}
        </button>

        {editandoId !== null && (
          <button className='btn-cancelar' onClick={limpiarFormulario}>Cancelar</button>
        )}

        {mensaje && <p className='mensaje'>{mensaje}</p>}
      </div>

      <div className='listado'>
        <h2>Listado de Clientes</h2>
        <table className='tabla'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Contacto</th>
              <th>Departamento</th>
              <th>Ciudad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id_cliente}>
                <td>{c.id_cliente}</td>
                <td>{c.nomCliente}</td>
                <td>{c.contacto}</td>
                <td>{c.departamento}</td>
                <td>{c.ciudad}</td>
                <td>
                  <button className='btn-editar' onClick={() => editarCliente(c)}>Editar</button>
                  <button className='btn-eliminar' onClick={() => eliminarCliente(c.id_cliente)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Clientes;