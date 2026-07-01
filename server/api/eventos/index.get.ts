import { prisma } from '../../utils/Prisma'

export default defineEventHandler(async () => {
    const eventos = await prisma.evento.findMany({
        include: {
            inscritos: true 
        }
    })

    return eventos
})