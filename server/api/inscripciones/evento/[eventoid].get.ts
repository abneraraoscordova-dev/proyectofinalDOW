import { prisma } from '../../../utils/Prisma'

export default defineEventHandler(async (event) => {
    const eventoId = Number(event.context.params?.eventoId)

    if (!eventoId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Id de evento invalido'
        })
    }

    const evento = await prisma.evento.findUnique({
        where: {
            id: eventoId
        }
    })

    if (!evento) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Evento no encontrado'
        })
    }

    return await prisma.inscrito.findMany({
        where: {
            eventoId
        }
    })
})