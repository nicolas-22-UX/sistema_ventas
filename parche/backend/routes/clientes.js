var express = require('express');
var router = express.Router();
var db = require('../db');



// Obtener todos los clientes
router.get('/', function(req, res, next) {
  db.query('SELECT * FROM clientes', function(err, results) {
    if (err) return next(err);
    res.json(results);
  });
});

// Insertar cliente
router.post('/', function(req, res) {
  const sql = `INSERT INTO clientes (nomCliente, contacto, departamento, ciudad) VALUES ('${req.body.nomCliente}', '${req.body.contacto}', '${req.body.departamento}', '${req.body.ciudad}')`;

  db.query(sql, function(err, result) {
    if (err) return res.send(err);
    res.send('Cliente guardado');
  });
});

// Actualizar cliente
router.put('/:id_cliente', function(req, res) {
  console.log('PUT recibido:', req.params.id_cliente, req.body);

  const sql = `UPDATE clientes SET nomCliente = '${req.body.nomCliente}', contacto = '${req.body.contacto}', departamento = '${req.body.departamento}', ciudad = '${req.body.ciudad}' WHERE id_cliente = ${req.params.id_cliente}`;

  db.query(sql, function(err, result) {
    if (err) return res.send(err);
    res.send('Cliente actualizado');
  });
});


// Eliminar cliente
router.delete('/:id_cliente', function(req, res) {
  const sql = `DELETE FROM clientes WHERE id_cliente = ${req.params.id_cliente}`;
  db.query(sql, function(err, result) {
    if (err) {
      // Cliente con ventas asociadas (llave foránea)
      if (err.errno === 1451) {
        return res.status(409).send('No se puede eliminar: el cliente tiene registros asociados');}
      return res.status(500).send(err);}
    if (result.affectedRows === 0) {
      return res.status(404).send('Cliente no encontrado');}
    res.send('Cliente eliminado');
  });
});

console.log('Rutas clientes:', router.stack.map(l => l.route && (Object.keys(l.route.methods) + ' ' + l.route.path)));

module.exports = router;