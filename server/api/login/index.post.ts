import { prisma } from '../../utils/Prisma'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (!body.email || !body.password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Debe ingresar email y contraseña'
        })
    }

    const usuario = await prisma.usuario.findUnique({
        where: {
            email: body.email
        }
    })

    if (!usuario || usuario.password !== body.password) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Datos Incorrectos'
        })
    }

    return {
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: usuario.rol
    }
})