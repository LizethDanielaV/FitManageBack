import { DataTypes } from "sequelize";
import db from "../db/db.js";
import Cliente from "./Cliente.js";
import Membresia  from "./Membresia.js";

const Suscripcion = db.define("Cliente_Membresia", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    fecha_inicio: {type: DataTypes.DATE, allowNull: false},
    fecha_fin:{type: DataTypes.DATE, allowNull: false},
},{
    timestamps: false,
    freezeTableName: true
});

//Relacion con Cliente
Cliente.hasMany(Suscripcion, {
    foreignKey: "id_cliente"
});

Suscripcion.belongsTo(Cliente, {
    foreignKey: "id_cliente"
});

//Relacion con Membresia

Membresia.hasMany(Suscripcion, {
    foreignKey: "id_membresia"
});
Suscripcion.belongsTo(Membresia, {
    foreignKey: "id_membresia"
});

export function calcularEstado(fechaInicio, fechaFin){
    const fecha1 = new Date(fechaInicio);
    const fecha2 = new Date(fechaFin);
    if (isNaN(fecha1.getTime()) || isNaN(fecha2.getTime())) {
        throw new Error("Fechas inválidas");
    }
    const diferenciaMs = fecha2 - fecha1;
    const diferenciaDias = diferenciaMs / (1000 * 60 * 60 * 24);
    const estado = diferenciaDias > 0 ? "activo" : "inactivo";
    return estado;
}
export default Suscripcion;
