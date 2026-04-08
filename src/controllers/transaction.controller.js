import { validationResult } from "express-validator";
import Transaction from "../models/Transaction.js";

const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return true;
  }
  return false;
};

/** Crear Transacción */
export const createTransaction = async (req, res, next) => {
  try {
    if (handleValidation(req, res)) return;

    const payload = {
      cuenta_origen: req.body.cuenta_origen,
      cuenta_destino: req.body.cuenta_destino,
      monto: req.body.monto,
      tipo: req.body.tipo ?? 'Transferencia',
      fecha_hora: req.body.fecha_hora ?? new Date()
    };

    const created = await Transaction.create(payload);
    res.status(201).json(created);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: 'UUID de transacción duplicado',
        fields: err.keyValue
      });
    }
    next(err);
  }
};

/** Listar Transacciones (con búsqueda por cuenta o UUID) */
export const getTransactions = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    // Filtro para buscar en cuentas o UUID
    const filter = q
      ? {
          $or: [
            { cuenta_origen: new RegExp(q, 'i') },
            { cuenta_destino: new RegExp(q, 'i') },
            { transaccion_uuid: new RegExp(q, 'i') }
          ]
        }
      : {};

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Transaction.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Transaction.countDocuments(filter)
    ]);

    res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (err) {
    next(err);
  }
};

/** Obtener transacción por ID */
export const getTransactionById = async (req, res, next) => {
  try {
    const item = await Transaction.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Transacción no encontrada' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

/** Eliminar Transacción (Opcional, usualmente las transacciones no se borran) */
export const deleteTransaction = async (req, res, next) => {
  try {
    const deleted = await Transaction.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'No encontrada' });
    res.json({ message: 'Registro de transacción eliminado' });
  } catch (err) {
    next(err);
  }
};