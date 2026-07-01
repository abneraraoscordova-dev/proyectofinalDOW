<script setup lang="ts">
const { fetch } = useUserSession()

const email = ref('')
const password = ref('')
const loading = ref(false)

async function login() {
    loading.value = true

    try {
        await $fetch('/api/auth/login', {
            method: 'POST',
            body: {
                email: email.value,
                password: password.value
            }
        })

        await fetch()

        await navigateTo('/admin/admin')
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}
</script>>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <UCard class="w-full max-w-md">
            <template #header>
                <div class="text-center">
                    <h1 class="text-2xl font-bold">
                        Inicio de sesion
                    </h1>
                    <p class="text-sm text-gray-500">
                        Acceso para miembros de staff
                    </p>
                </div>
            </template>

            <UForm class="space-y-4 w-full flex flex-col">
                <UFormGroup label="Email" class="w-full">
                    <UInput v-model="email" type="email" placeholder="correo@ejemplo.com" />
                </UFormGroup>

                <UFormGroup label="Contraseña">
                    <UInput v-model="password" type="password" placeholder="Ingrese su contraseña" />
                </UFormGroup>

                <UButton block :loading="loading" @click="login">
                    Ingresar
                </UButton>
            </UForm>
        </UCard>
    </div>
</template>