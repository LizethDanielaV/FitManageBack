import Suscripcion from "../models/Suscripcion.js";
import { calcularEstado } from "../models/Suscripcion.js";
import Cliente from "../models/Cliente.js";
import Membresia from "../models/Membresia.js";

import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from "../errors/Errores.js";

//Registrar nueva suscripcion
async function registrar(id_cliente, id_membresia) {
  if (!id_cliente || !id_membresia || isNaN(id_membresia)) {
    throw new BadRequestError("DNI o membresia no valida.");
  }
  try {
    const cliente = await Cliente.findByPk(id_cliente);
    if (!cliente) {
      throw new NotFoundError("Cliente no encontrado");
    }
    const membresia = await Membresia.findByPk(id_membresia);
    if (!membresia) {
      throw new NotFoundError("Membresia no encontrada");
    }
    const fechaInicio = new Date();
    const fechaFin = new Date(
      calcularFechafin(fechaInicio, parseInt(membresia.duracion))
    );
    //const estado = calcularEstado(fechaInicio, fechaFin);

    const suscripcion = await Suscripcion.create({
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      id_cliente: id_cliente,
      id_membresia: id_membresia,
    });
    return suscripcion;
  } catch (error) {
    throw error;
  }
}

function calcularFechafin(fechaInicio, dias) {
  const nuevaFecha = new Date(fechaInicio);
  nuevaFecha.setDate(nuevaFecha.getDate() + dias);
  return nuevaFecha;
}

async function obtenerUltimaSuscripcion(id_cliente) {
  try {
    const ultimaSuscripcion = await Suscripcion.findOne({
      where: { id_cliente },
      order: [["fecha_fin", "DESC"]],
    });

    if (!ultimaSuscripcion) {
      throw new NotFoundError("No se encontró ninguna membresía activa.");
    }

    return ultimaSuscripcion;
  } catch (error) {
    throw error;
  }
}

async function verificarMembresiaExpirada(id_cliente) {
  try {
    const ultimaSuscripcion = await obtenerUltimaSuscripcion(id_cliente);

    const hoy = new Date();
    const fechaFin = new Date(ultimaSuscripcion.fecha_fin);

    return fechaFin < hoy;
  } catch (error) {
    throw error;
  }
}

export default {
  registrar,
  obtenerUltimaSuscripcion,
  verificarMembresiaExpirada,
};
