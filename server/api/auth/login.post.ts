import bcrypt from 'bcryptjs'
import { prisma } from '../../utils/Prisma'
import { setUserSession } from '#imports'

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

    if (!usuario) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Usuario no encontrado'
        })
    }

    const passwordCorrecta = await bcrypt.compare(
        body.password,
        usuario.password
    )

    if (!passwordCorrecta) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Contraseña incorrecta'
        })
    }

    await setUserSession(event, {
        user: {
            email: usuario.email,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            rol: usuario.rol
        }
    })


    return {
        success: true
    }
})