<script setup lang="ts">

interface Inscrito { id: number; nombre: string; apellido: string; email: string }
interface Evento { id: number; titulo: string; fecha: string; lugar: string; imagen: string | null; valor: number; inscritos?: Inscrito[] | null }
interface Usuario { email: string; nombre: string; apellido: string }

const { user, clear } = useUserSession()


const eventos = ref<Evento[]>([])
const modoedit = ref(false)
const idedit = ref<number | null>(null)
const archivo = ref<File>()
const form = reactive({ titulo: '', fecha: '', lugar: '', imagen: '', valor: 0 })


const usuarios = ref<Usuario[]>([])
const formUsuario = reactive({ nombre: '', apellido: '', email: '', password: '' })


const cargarEventos = async () => {
  eventos.value = await $fetch<Evento[]>('/api/eventos')
}

const subirImagen = async () => {
  const formData = new FormData()
  formData.append('file', archivo.value!)
  const respuesta = await $fetch<{ Imagen: string }>('/api/upload', { method: 'POST', body: formData })
  form.imagen = respuesta.Imagen
}

const guardarEvento = async () => {
  if (archivo.value) await subirImagen()

  if (modoedit.value) {
    await $fetch(`/api/eventos/${idedit.value}`, { method: 'PUT', body: form })
    alert('Evento actualizado correctamente')
  } else {
    await $fetch('/api/eventos', { method: 'POST', body: form })
    alert('Evento creado exitosamente')
  }

  form.titulo = ''; form.fecha = ''; form.lugar = ''; form.imagen = ''; form.valor = 0
  archivo.value = undefined
  modoedit.value = false
  idedit.value = null

  await cargarEventos()
}

const editarEvento = (evento: Evento) => {
  modoedit.value = true
  idedit.value = evento.id
  form.titulo = evento.titulo
  form.lugar = evento.lugar
  form.imagen = evento.imagen || ''
  form.valor = evento.valor
  form.fecha = evento.fecha ? new Date(evento.fecha).toISOString().split('T')[0] : ''
}

const eliminarEvento = async (id: number) => {
  await $fetch(`/api/eventos/${id}`, { method: 'DELETE' })
  await cargarEventos()
}

const eliminarInscrito = async (id: number) => {
  await $fetch(`/api/inscripciones/${id}`, { method: 'DELETE' })
  await cargarEventos()
}


const cargarUsuarios = async () => {
  usuarios.value = await $fetch<Usuario[]>('/api/usuarios')
}

const crearStaff = async () => {
  if (!formUsuario.email || !formUsuario.password) {
    return alert('Faltan datos obligatorios para crear el usuario')
  }

  await $fetch('/api/usuarios', { method: 'POST', body: formUsuario })
  alert('Staff creado exitosamente')

  formUsuario.nombre = ''; formUsuario.apellido = ''; formUsuario.email = ''; formUsuario.password = ''
  await cargarUsuarios()
}

const eliminarStaff = async (email: string) => {
  await $fetch(`/api/usuarios/${email}`, { method: 'DELETE' })
  await cargarUsuarios()
}

const cerrarSesion = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await clear()
  return navigateTo('/login')
}

await cargarEventos()
await cargarUsuarios()
</script>

<template>
  <UContainer class="py-8">

    <UCard>
      <template #header>
        <h1 class="text-2xl font-bold">Administración de Eventos</h1>
      </template>
      <div class="space-y-4">
        <UInput v-model="form.titulo" placeholder="Titulo" />
        <UInput v-model="form.fecha" type="date" />
        <UInput v-model="form.lugar" placeholder="Lugar" />
        <UFileUpload v-model="archivo" label="Imagen del evento" accept="image/*" />
        <UInput v-model="form.valor" type="number" placeholder="Valor" />
        <UButton block class= text-white " @click="guardarEvento">
          {{ modoedit ? 'Actualizar Evento' : 'Crear Evento' }}
        </UButton>
      </div>
    </UCard>

    <UCard class="mt-6">
      <template #header>
        <h2 class="text-xl font-bold">Lista de Eventos</h2>
      </template>

      <div v-for="evento in eventos" :key="evento.id" class="border rounded p-4 mb-4">
        <h3 class="font-bold">{{ evento.titulo }}</h3>
        <p class="text font-bold">
          {{ new Date(evento.fecha).toLocaleDateString() }} - {{ evento.lugar }} ${{ evento.valor }}
        </p>
        <img v-if="evento.imagen" :src="evento.imagen" class="w-40 rounded mt-3" />

        <div class="mt-4 flex gap-2">
          <UButton class=" text-white" @click="editarEvento(evento)">Editar</UButton>
          <UButton class="bg-red-600 hover:bg-red-700 text-white" @click="eliminarEvento(evento.id)">Eliminar</UButton>
        </div>

        <div v-if="evento.inscritos" class="mt-4 bg-gray-50 p-3 rounded border text-sm">
          <div v-for="inscrito in evento.inscritos" :key="inscrito.id"
            class="flex flex-col sm:flex-row justify-between items-center py-2 border-b gap-2">
            <span>{{ inscrito.nombre }} {{ inscrito.apellido }} ({{ inscrito.email }}) </span>
            <UButton @click="eliminarInscrito(inscrito.id)" class="bg-red-600 hover:bg-red-700 text-white">
              Eliminar
            </UButton>
          </div>
          <div v-if="evento.inscritos.length === 0" class="text-gray-400 italic py-2">
            Sin inscritos.
          </div>
        </div>
      </div>
    </UCard>

    <UCard class="mt-12 border-2 border-gray-200">
      <template #header>
        <h2 class="text-2xl font-bold">Administración de Staff</h2>
      </template>

      <div class="space-y-4 mb-8">
        <h3 class="font-bold text-gray-700">Agregar nuevo miembro</h3>
        <UInput v-model="formUsuario.nombre" placeholder="Nombre" />
        <UInput v-model="formUsuario.apellido" placeholder="Apellido" />
        <UInput v-model="formUsuario.email" type="email" placeholder="Correo electrónico" />
        <UInput v-model="formUsuario.password" type="password" placeholder="Contraseña de acceso" />
        <UButton block class=" text-white flex justify-center" @click="crearStaff">
          Crear Cuenta
        </UButton>
      </div>

      <h3 class="font-bold text-gray-700 mb-4">Cuentas Registradas</h3>
      <div class="space-y-2">
        <div v-for="usuario in usuarios" :key="usuario.email"
          class="flex flex-col sm:flex-row justify-between items-center p-3 border rounded bg-white gap-2">
          <span class="text-sm">
            <strong>{{ usuario.nombre }} {{ usuario.apellido }}</strong> ({{ usuario.email }})
          </span>
          <UButton size="xs" class="bg-red-600 hover:bg-red-700 text-white" @click="eliminarStaff(usuario.email)">
            Eliminar
          </UButton>
        </div>
        <div v-if="usuarios.length === 0" class="text-gray-400 italic text-sm">
          No hay más miembros registrados.
        </div>
      </div>
    </UCard>

    <div v-if="user" class="flex items-center gap-4 mt-8 justify-end">
      <span class="text-gray-700 font-medium">
        {{ user.nombre }} {{ user.apellido }}
      </span>
      <button @click="cerrarSesion"
        class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors">
        Cerrar Sesión
      </button>
    </div>

  </UContainer>
</template>