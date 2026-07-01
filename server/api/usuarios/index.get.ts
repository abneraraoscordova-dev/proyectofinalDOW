import { prisma } from '../../utils/Prisma'

export default defineEventHandler(async () => {
    const usuarios = await prisma.usuario.findMany({
        select: {
            email: true,
            nombre: true,
            apellido: true,
            rol: true
        }
    })
    return usuarios
})