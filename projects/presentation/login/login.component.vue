<script setup lang="ts">
    import { LoginEvent } from './login.component.types';
    import { inject, ref } from 'vue';
    import { AuthServiceSymbol } from 'domain/authentication';    
    defineProps({
        greeting: {
            type: String,
            default: 'Welcome'
        }
    });

    const formRef = ref<HTMLFormElement | undefined>(undefined);
    const emit = defineEmits([
        LoginEvent.LoginComplete
    ]);

    const authService = inject(AuthServiceSymbol);
    let userName: string | undefined;

    async function login(){
        if(!formRef.value?.reportValidity() || !userName){
            return;
        }
        
        await authService?.signIn(userName);

        emit(LoginEvent.LoginComplete);
    }


    function onSubmit(e: Event){
        e.preventDefault();
        login();
    }
</script>

<template>
    <div class="border-2 border-solid border-stone-600 bg-stone-700 flex flex-col">
        <h1 class="bg-zinc-900 p-3">{{ greeting }}</h1>
        <form class="p-3 flex flex-col" ref="formRef" @submit="onSubmit">
            <ul>
                <li>            
                    <label for="user">User name:</label>
                    <input required type="text" v-model="userName" name="user" id="user" />
                </li>
            </ul>
            <button class="self-end" type="button" @click="login()" >Login</button>
        </form>
    </div>
</template>
