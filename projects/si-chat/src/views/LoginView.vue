<script setup lang="ts">
    import { LoginComponent } from 'presentation/login';
    import { useRouter } from 'vue-router'
    import { Route } from '../setup';

    const router = useRouter();
    function navigateHome(){
        router.push(Route.Home);
    }
</script>

<template>
    <div class="flex justify-center items-center">
        <LoginComponent @login-complete="navigateHome()" class="w-1/2" greeting="Welcome to System Initiative!"></LoginComponent>
    </div>
</template>