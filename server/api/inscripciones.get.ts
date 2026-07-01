export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const email = query.email as string

  if (!email) return []


  return await prisma.inscrito.findMany({
    where: { email: email },
    include: { evento: true }
  })
})