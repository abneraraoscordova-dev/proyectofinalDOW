<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const isActive = (ruta) => route.path === ruta


const navigationLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Mis Eventos', to: '/misEventos' }
]
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200 shadow-sm">
      <UContainer class="flex justify-between items-center py-4">
        <NuxtLink to="/" class="text-2xl font-bold text-primary-600">
          Smart Events
        </NuxtLink>

        <nav class="flex flex-wrap items-center justify-end gap-2 sm:gap-4 text-sm sm:text-base w-full">
          <NuxtLink v-for="link in navigationLinks" :key="link.to" :to="link.to"
            :class="isActive(link.to) ? 'text-black font-bold' : 'text-gray-500 hover:text-black'">
            {{ link.label }}
          </NuxtLink>

          <NuxtLink to="/admin/admin">Área Staff</NuxtLink>
        </nav>
      </UContainer>
    </header>

    

    <main>
      <slot />
    </main>


  
  </div>
</template>
