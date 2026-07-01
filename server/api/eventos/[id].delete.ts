import { prisma } from '../../utils/Prisma'

export default defineEventHandler(async (event) => {
    const id = Number(event.context.params?.id)

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID invalido'
        })
    }

    const evento = await prisma.evento.findUnique({
        where: {
            id
        }
    })


    if (!evento) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Evento no encontrado'
        })
    }

    return await prisma.evento.delete({
        where: {
            id
        }
    })

})