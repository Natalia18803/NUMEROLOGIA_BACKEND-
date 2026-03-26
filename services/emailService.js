import nodemailer from 'nodemailer';

/**
 * Servicio de E-mail para la Matriz de Numerología
 */
class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT),
            secure: parseInt(process.env.EMAIL_PORT) === 465, // true para 465, false para otros
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    /**
     * Envía un correo de bienvenida a un nuevo usuario
     * @param {string} email - Correo del destinatario
     * @param {string} nombre - Nombre del usuario
     */
    async enviarBienvenida(email, nombre) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_FROM || '"Matriz de Numerología" <no-reply@tu-dominio.com>',
                to: email,
                subject: '✨ Bienvenida a la Matriz de Numerología ✨',
                html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a10; color: #f8f8f8; padding: 40px; border-radius: 15px; border: 1px solid #d4af37; max-width: 600px; margin: auto;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #d4af37; text-transform: uppercase; letter-spacing: 3px; margin: 0;">Portal Místico</h1>
                    </div>
                    
                    <div style="background: rgba(255, 255, 255, 0.05); padding: 30px; border-radius: 10px;">
                        <h2 style="color: #fff; margin-top: 0;">¡Hola, ${nombre}! 👋</h2>
                        <p style="font-size: 1.1rem; line-height: 1.6;">Bienvenido/a al universo de la sabiduría numérica. Las constelaciones se han alineado para que hoy comiences tu viaje de autodescubrimiento.</p>
                        
                        <p style="font-size: 1.1rem; line-height: 1.6;">A partir de ahora, tendrás acceso a:</p>
                        <ul style="color: #d4af37; font-size: 1.05rem;">
                            <li>Tus Lecturas Diarias personalizadas.</li>
                            <li>El cálculo de tu Número Espiritual Maestro.</li>
                            <li>Un portal de sabiduría reservado solo para los buscadores de la verdad.</li>
                        </ul>

                        <div style="text-align: center; margin-top: 40px;">
                            <a href="${process.env.FRONTEND_URL || '#'}" style="background-color: #d4af37; color: #000; padding: 15px 35px; text-decoration: none; border-radius: 30px; font-weight: bold; text-transform: uppercase;">Ingresar al Portal</a>
                        </div>
                    </div>

                    <div style="text-align: center; margin-top: 30px; color: #a39cb6; font-size: 0.9rem;">
                        <p>Este es un mensaje automático de la Matriz. No es necesario responder.</p>
                        <hr style="border: 0.5px solid rgba(212, 175, 55, 0.2); margin: 20px 0;">
                        <p>&copy; 2024 Matriz de Numerología - El Destino en tus Cifras</p>
                    </div>
                </div>
                `,
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('✅ Correo de bienvenida enviado a:', email, 'ID:', info.messageId);
            return info;
        } catch (error) {
            console.error('❌ Error al enviar correo de bienvenida:', error);
            // No lanzamos el error para no bloquear el flujo principal de registro
            return null;
        }
    }
}

export default new EmailService();
