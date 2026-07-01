import { prisma } from '../../utils/Prisma'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)

    if (!query.email) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Debe indicar un email'
        })
    }

    const inscripciones = await prisma.inscrito.findMany({
        where: {
            email: String(query.email)
        },
        include: {
            evento: true
        }
    })
    return inscripciones
}) 