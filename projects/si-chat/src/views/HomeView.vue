<script setup lang="ts">
    import { ChatComponent } from 'presentation/chat';
    import { UserListComponent } from 'presentation/user-list';
    import { SiLogoIcon } from '../icons';
</script>

<template>
    <main>
        <div class="flex flex-row h-full space-x-5">
            <div flex-col class="space-y-5">
                <SiLogoIcon class="w-fit bg-zinc-900" />
                <UserListComponent id="user-list" class="max-h-[75%]"/>
            </div>
            <ChatComponent class="grow"/>
        </div>
    </main>
</template>
