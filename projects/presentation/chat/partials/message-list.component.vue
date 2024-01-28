<script setup lang="ts">
import { type Ref, ref } from 'vue';
    import { type MessageDto } from 'domain/message';
    interface Props {
        messages: Ref<MessageDto[]>
    }

    withDefaults(defineProps<Props>(), {
        messages: () => ref([] as MessageDto[])
    });
</script>

<template>
    <ul>
        <li v-for="msg in messages.value">
            <strong>{{ msg.user}}:</strong> <span>{{ msg.message }}</span>
        </li>
    </ul>
</template>