<script setup lang="ts">
    import { inject, ref, computed } from 'vue';
    import { MessageServiceSymbol } from 'domain/message';
    import { MessageList } from './partials';
    
    const messageService = inject(MessageServiceSymbol);
    const hasMessages = computed(() => {
        return messageService ? messageService.messages.value.length > 0 : false;
    });
    const inputRef = ref<HTMLInputElement | undefined>(undefined);
    const chatBoxRef = ref<HTMLDivElement | undefined>(undefined);
    let message: string | undefined;

    messageService?.message$.subscribe(() => {
        scrollToBottom();
    })

    async function sendMessage(e: Event){
        e.preventDefault();
        if(!message || message.length < 1) {
            return;
        }

        messageService?.sendMessage(message);

        const chatInput = inputRef.value;
        if(chatInput) {
            chatInput.value = message = '';
        }
    }

    function scrollToBottom(){
        const chatBox = chatBoxRef.value;
        if(chatBox){
            chatBox.scrollTo(0, chatBox.scrollHeight)
        }
    }
</script>

<template>
    <div class="flex flex-col space-y-5">
        <div id="chat-box" ref="chatBoxRef" class="bg-zinc-900 p-6 overflow-y-auto grow min-h-52 border-2 border-solid border-stone-600">
            <MessageList v-if="hasMessages" :messages="messageService?.messages" />
            <span v-else>No messages yet...</span>
        </div>
        <form class="bg-stone-700 flex flex-row justify-items-center items-center space-x-5 p-2 border-2 border-solid border-stone-600" ref="formRef" @submit="sendMessage">
            <input required 
                id="message-box"
                name="chat-box"
                ref="inputRef"
                v-model="message" 
                @keydown.enter="sendMessage" 
                class="grow" 
                type="text" 
                placeholder="Begin typing a message..." 
            />
            <button id="send-btn" type="button" @click="sendMessage">Send</button>
        </form>
    </div>
</template>