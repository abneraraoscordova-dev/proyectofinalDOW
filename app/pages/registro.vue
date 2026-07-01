<script setup lang="ts">



const route = useRoute();
const toast = useToast();
const loading = ref(false);

interface InscripcionState {
    nombre: string
    apellido: string
    email: string
    eventoId: number

}

const state = reactive<InscripcionState>({
    nombre: '',
    apellido: '',
    email: '',
    eventoId: Number(route.query.id || 0)
});

const onSubmit = async () => {
    loading.value = true

    try {
        if (!state.nombre || !state.apellido || !state.email) {

            toast.add({
                title: 'Faltan datos',
                description: 'Completa todos los campos',
                color: 'error'
            })
            return
        }

        if (isNaN(state.eventoId) || state.eventoId <= 0) {

            toast.add({
                title: 'Error',
                description: 'ID de evento invalido',
                color: 'error'
            })
            return
        }

        await $fetch('/api/inscripciones', {
            method: 'POST',
            body: state
        })

        toast.add({
            title: 'Inscripcion exitosa',
            description: 'Te inscribiste correctamente',
            color: 'success'
        })

    } catch (e: any) {
        toast.add({
            title: 'Error',
            description: e?.data?.statusMessage || 'No se pudo inscribir',
            color: 'error'
        })
    } finally {
        loading.value = false
    }

}

</script>

<template>
    <UContainer>
        <UCard>
            <template #header>
                <h1 class="text-2xl font-bold text-center"> Inscripcion al Evento</h1>
            </template>
            <UForm :state="state" @submit="onSubmit" class="space-y-6">

                <UFormGroup label="Nombre" name="nombre" required>
                    <UInput v-model="state.nombre" placeholder="Tu nombre" />
                </UFormGroup>

                <UFormGroup label="Apellido" name="apellido" required>
                    <UInput v-model="state.apellido" placeholder="Tu apellido" />
                </UFormGroup>

                <UFormGroup label="Email" name="email" required>
                    <UInput v-model="state.email" type="email" placeholder="correo@ejejemplo.com" />
                </UFormGroup>

                <UButton type="submit" block color="primary" :loading="loading">
                    Confirmar Inscripcion
                </UButton>

            </UForm>
        </UCard>
    </UContainer>
</template>