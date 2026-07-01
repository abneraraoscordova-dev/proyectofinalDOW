<script setup lang="ts">
import { ref } from 'vue'

const { data: eventos, pending } = await useFetch('/api/eventos')


const eventoSeleccionado = ref<any>(null)
const errorFormulario = ref('')

const abrirInscripcion = (evento: any) => {
  eventoSeleccionado.value = evento
  errorFormulario.value = ''
}


const form = ref({ nombre: '', apellido: '', email: '' })

const guardarInscripcion = async () => {

  if (!form.value.nombre || !form.value.apellido || !form.value.email) {
    errorFormulario.value = 'Error: Debes completar todos los campos.'
    return
  }

  try {

    await $fetch('/api/inscripciones', {
      method: 'POST',
      body: {
        nombre: form.value.nombre,
        apellido: form.value.apellido,
        email: form.value.email,
        eventoId: eventoSeleccionado.value?.id
      }
    })

    alert('Inscripción lista')


    form.value.nombre = ''
    form.value.apellido = ''
    form.value.email = ''


    eventoSeleccionado.value = null
  } catch (error) {
    errorFormulario.value = 'Hubo un error al procesar la inscripción.'
  }
}


</script>


<template>


  <div>
    <section class="py-16 px-6">
      <div class="max-w-7xl mx-auto">

        <div class="flex items-end justify-between mb-8">
          <div>
            <h2 class="text-3xl font-bold text-gray-900">Próximos eventos</h2>

          </div>
        </div>

        <div v-if="pending" class="text-gray-500 animate-pulse">
          Cargando información...
        </div>

        <div v-else-if="eventos && eventos.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6">

          <UCard v-for="evento in eventos" :key="evento.id"
            class="transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <template #header>
              <h3 class="text-xl font-bold truncate">{{ evento.titulo }}</h3>
            </template>

            <img v-if="evento.imagen" :src="evento.imagen" class="w-full h-48 object-cover rounded-md shadow-sm"
              alt="Portada" />
            <div v-else
              class="w-full h-48 bg-gray-200 flex items-center justify-center rounded-md text-gray-500 shadow-sm">
              <span>Sin imagen</span>
            </div>

            <div class="text-sm flex flex-col gap-2 mt-4">
              <p><strong>Fecha:</strong> {{ new Date(evento.fecha).toLocaleString('es-CL') }}</p>
              <p><strong>Lugar:</strong> {{ evento.lugar }}</p>
              <p><strong>Valor:</strong> {{ evento.valor === 0 ? 'Gratis' : '$' + evento.valor }}</p>
              <p><strong>Inscritos:</strong> {{ evento.inscritos?.length || 0 }}</p>
            </div>

            <template #footer>
             
              <UButton color="primary" block @click="abrirInscripcion(evento)">Inscribirse</UButton>
            </template>
          </UCard>
        </div>

        <div v-else class="text-gray-500">
          <p>No hay eventos publicados.</p>
        </div>

        <UCard v-if="eventoSeleccionado" class="mt-12 border-2 border-primary-500">
          <template #header>
            <h2 class="text-xl font-bold">Inscribirse en: {{ eventoSeleccionado.titulo }}</h2>
          </template>

          <div class="space-y-4">
            <p v-if="errorFormulario" class="text-red-500 text-sm font-semibold">{{ errorFormulario }}</p>

            <UInput v-model="form.nombre" placeholder="Nombre" />
            <UInput v-model="form.apellido" placeholder="Apellido" />
            <UInput v-model="form.email" placeholder="Correo Electrónico" />

            <UButton color="primary" block @click="guardarInscripcion">Confirmar Inscripción</UButton>
          </div>
        </UCard>

      </div>
    </section>
  </div>
  


</template>
