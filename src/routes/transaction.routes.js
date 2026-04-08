import { Router } from "express";
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  deleteTransaction
} from "../controllers/transaction.controller.js";

// Nota: Deberás crear o renombrar este validador también
import {
  createTransactionValidator,
  idValidator
} from "../validators/transaction.validator.js";

import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// Todas las rutas de transacciones requieren estar logueado
router.use(protect);

/** Rutas para /api/transacciones */
router.get("/", getTransactions);
router.post("/", createTransactionValidator, createTransaction);
router.get("/:id", idValidator, getTransactionById);
router.delete("/:id", idValidator, deleteTransaction);

export default router;
