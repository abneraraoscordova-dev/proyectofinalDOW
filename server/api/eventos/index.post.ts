import { prisma } from '../../utils/Prisma'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const nuevoEvento = await prisma.evento.create({
        data: {
            titulo: body.titulo,
            fecha: new Date(body.fecha),
            lugar: body.lugar,
            imagen: body.imagen || '/default.jpg',
            valor: Number(body.valor)

        }
    })
    return nuevoEvento
})