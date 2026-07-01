import { prisma } from '../../utils/Prisma'

export default defineEventHandler(async (event) => {
    const id = Number(event.context.params?.id)

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID invalido'
        })
    }

    const inscripcion = await prisma.inscrito.findUnique({
        where: {
            id
        }
    })

    if (!inscripcion) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Inscripcion no encontrada'
        })
    }

    return await prisma.inscrito.delete({
        where: {
            id
        }
    })
})