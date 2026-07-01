<script setup lang="ts">
const emailBusqueda = ref('')
const eventosInscritos = ref([])
const pending = ref(false)

const buscarEventos = async () => {
  if (!emailBusqueda.value) return alert('Ingresa un correo')

  pending.value = true
  try {
    
    const { data } = await useFetch(`/api/inscripciones?email=${emailBusqueda.value}`)

    
    eventosInscritos.value = data.value || []

    if (eventosInscritos.value.length === 0) {
      alert('No se encontraron inscripciones para este correo.')
    }
  } catch (error) {
    alert('Error al buscar eventos.')
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <UContainer class="py-10">
    <h1 class="text-3xl font-bold mb-8 text-white">Mis Eventos Inscritos</h1>

    <div class="mb-10 flex gap-2">
      <UInput v-model="emailBusqueda" placeholder="aaaa.aaa@gmail.com" class="flex-1" color="white" />




      <UButton @click="buscarEventos" :loading="pending">Buscar</UButton>

    </div>

    <div v-if="eventosInscritos.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UCard v-for="inscripcion in eventosInscritos" :key="inscripcion.id"
        class="transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl">
        <template #header>
          <h3 class="text-xl font-bold truncate">{{ inscripcion.evento.titulo }}</h3>
        </template>

        <img :src="inscripcion.evento.imagen" class="w-full h-48 object-cover rounded-md" />

        <div class="text-sm flex flex-col gap-2 mt-4 text-black">
          <p><strong>Fecha:</strong> {{ new Date(inscripcion.evento.fecha).toLocaleString('es-CL') }}</p>
          <p><strong>Lugar:</strong> {{ inscripcion.evento.lugar }}</p>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>