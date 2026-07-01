import { prisma } from '../../utils/Prisma'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (!body.email || !body.password || !body.nombre || !body.apellido) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Faltan Datos'
        })
    }

    const usuario = await prisma.usuario.create({
        data: {
            email: body.email,
            password: body.password,
            nombre: body.nombre,
            apellido: body.apellido,
            rol: body.rol ?? 'staff'
        }
    })
    return usuario
})