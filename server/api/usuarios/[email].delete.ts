import { prisma } from '../../utils/Prisma'

export default defineEventHandler(async (event) => {
    const email = String(event.context.params?.email)

    if (!email) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Email invalido'
        })
    }

    const usuario = await prisma.usuario.findUnique({
        where: {
            email
        }
    })

    if (!usuario) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Mensaje no encontrado'
        })
    }

    return await prisma.usuario.delete({
        where: {
            email
        }
    })
})