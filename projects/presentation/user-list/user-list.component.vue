<script setup lang="ts">
    import { inject, ref, computed } from 'vue';
    import { UserServiceSymbol, UserEntity } from 'domain/user';
    import { AuthServiceSymbol } from 'domain/authentication';
    
    const userService = inject(UserServiceSymbol);
    const authService = inject(AuthServiceSymbol);

    function getUserEmblem(user: UserEntity){
        return user.name === authService?.user?.name ? '*' : '';
    }

</script>
<template>
    <div class="bg-stone-700 p-4 flex shrink flex-col border-2 border-solid border-stone-600 min-h-52 overflow-y-auto">
        <ul>
            <li v-for="user in userService?.users.value">
                <span>{{ getUserEmblem(user) }}{{ user.name }}</span>
            </li>
        </ul>
    </div>
</template>