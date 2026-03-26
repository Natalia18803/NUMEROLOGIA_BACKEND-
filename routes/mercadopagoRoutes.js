import express from 'express';
const router = express.Router();
import * as mercadopagoController from '../controllers/mercadopagoController.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

// Crear una preferencia de pago (Público o Privado según necesites)
// En este caso lo protegemos con JWT para asegurar que el usuario_id sea real
router.post('/create-preference', validarJWT, mercadopagoController.crearPreferencia);

// Webhook para Mercado Pago (Debe ser público para que MP pueda enviarlo)
router.post('/webhook', mercadopagoController.recibirWebhook);

export default router;
