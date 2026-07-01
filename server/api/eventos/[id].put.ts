import { prisma } from '../../utils/Prisma'

export default defineEventHandler(async (event) => {
    const id = Number(event.context.params?.id)
    const body = await readBody(event)

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID invalido'
        })
    }

    const evento = await prisma.evento.findUnique({
        where: { id }
    })

    if (!evento) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Evento no enccontrado'
        })
    }

    const actualizado = await prisma.evento.update({
        where: { id },
        data: {
            titulo: body.titulo,
            fecha: new Date(body.fecha),
            lugar: body.lugar,
            imagen: body.imagen || '/default.jpg',
            valor: Number(body.valor)
        }
    })

    return actualizado
})