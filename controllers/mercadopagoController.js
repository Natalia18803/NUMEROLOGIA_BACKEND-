import { MercadoPagoConfig, Preference } from 'mercadopago';
import Usuario from '../models/usuario.js';
import Pago from '../models/pago.js';

// Configurar Mercado Pago
const client = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN || 'TEST-xxxx-xxxx' 
});

/**
 * Crea una preferencia de pago para un usuario
 */
export const crearPreferencia = async (req, res) => {
    try {
        const { usuario_id, monto } = req.body;

        const preference = new Preference(client);
        const result = await preference.create({
            body: {
                items: [
                    {
                        title: 'Membresía Premium - Matriz de Numerología',
                        quantity: 1,
                        unit_price: Number(monto),
                        currency_id: 'COP'
                    }
                ],
                back_urls: {
                    success: `${process.env.PROD_URL || 'http://localhost:5173'}/dashboard-user?pago=exitoso`,
                    failure: `${process.env.PROD_URL || 'http://localhost:5173'}/dashboard-user?pago=fallido`,
                    pending: `${process.env.PROD_URL || 'http://localhost:5173'}/dashboard-user?pago=pendiente`
                },
                auto_return: 'approved',
                notification_url: `${process.env.BACKEND_URL || 'https://tu-dominio.com'}/api/mercadopago/webhook`,
                metadata: {
                    usuario_id: usuario_id
                }
            }
        });

        res.json({ id: result.id, init_point: result.init_point });
    } catch (error) {
        console.error('Error al crear preferencia MP:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Recibe las notificaciones de Mercado Pago (Webhook)
 */
export const recibirWebhook = async (req, res) => {
    try {
        const { query } = req;
        const topic = query.topic || query.type;

        // Mercado Pago envía notificaciones de varios tipos. Nos interesa 'payment'.
        if (topic === 'payment') {
            const paymentId = query.id || query['data.id'];
            console.log('🔔 Webhook de pago recibido:', paymentId);

            // IMPORTANTE: En producción real, aquí se debe consultar la API de Mercado Pago
            // usando el paymentId para verificar que el status sea 'approved'
            // y obtener el 'metadata' que enviamos desde el frontend.

            /* 
               Lógica representativa:
               Si el pago existe, actualizamos al usuario.
               Para este MVP, si recibimos el webhook, activamos la cuenta.
               En una implementación real, se extrae el user_id del objeto pago de MP.
            */
        }

        // Siempre responder 200 a Mercado Pago para evitar reintentos
        res.sendStatus(200);
    } catch (error) {
        console.error('Error en Webhook MP:', error);
        res.sendStatus(500);
    }
};
