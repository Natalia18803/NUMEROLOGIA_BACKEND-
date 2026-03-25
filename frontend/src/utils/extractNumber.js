export const extraerNumero = (texto) => {
    if (!texto) return '?'
    const match = texto.match(/\d+/)
    return match ? match[0] : '?'
}
