import { prisma } from '../../utils/Prisma'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (!body.email || !body.eventoId || !body.nombre || !body.apellido) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Faltan Datos'
        })
    }

    const inscripcion = await prisma.inscrito.create({
        data: {
            email: body.email,
            nombre: body.nombre,
            apellido: body.apellido,
            eventoId: Number(body.eventoId)
        }
    })
    return inscripcion
})
