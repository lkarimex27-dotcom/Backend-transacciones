import { body, param } from "express-validator";

// Validador para el ID de MongoDB (se mantiene igual)
export const idValidator = [
  param("id").isMongoId().withMessage("ID de registro inválido")
];

// Validador para CREAR una transacción
export const createTransactionValidator = [
  body('cuenta_origen')
    .trim()
    .notEmpty().withMessage('La cuenta de origen es obligatoria')
    .isLength({ min: 5, max: 30 }).withMessage('Número de cuenta origen inválido'),
    
  body('cuenta_destino')
    .trim()
    .notEmpty().withMessage('La cuenta de destino es obligatoria')
    .isLength({ min: 5, max: 30 }).withMessage('Número de cuenta destino inválido')
    // Validación extra: Que no sean la misma cuenta
    .custom((value, { req }) => {
      if (value === req.body.cuenta_origen) {
        throw new Error('La cuenta destino no puede ser igual a la de origen');
      }
      return true;
    }),

  body('monto')
    .notEmpty().withMessage('El monto es obligatorio')
    .isNumeric().withMessage('El monto debe ser un número')
    .custom((value) => {
      if (parseFloat(value) <= 0) {
        throw new Error('El monto debe ser mayor a cero');
      }
      return true;
    }),

  body('tipo')
    .optional()
    .trim()
    .isIn(['Transferencia', 'Deposito', 'Retiro'])
    .withMessage('Tipo de transacción no válido'),

  body('fecha_hora')
    .optional()
    .isISO8601().withMessage('Formato de fecha inválido')
];

// Validador para ACTUALIZAR (En transacciones suele ser limitado o nulo)
export const updateTransactionValidator = [
  ...idValidator,
  body('monto')
    .optional()
    .isNumeric().withMessage('El monto debe ser un número')
    .custom((value) => {
      if (parseFloat(value) <= 0) {
        throw new Error('El monto debe ser mayor a cero');
      }
      return true;
    }),
  body('tipo')
    .optional()
    .trim()
    .isIn(['Transferencia', 'Deposito', 'Retiro'])
    .withMessage('Tipo no válido'),
];