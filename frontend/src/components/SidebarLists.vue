<template>
    <div class="lists">
        <div v-for="(list, index) in userLists" :key="index">
            <div @click="chatStore.toggleList(list.title)" class="list-header">
                <img src="../assets/icons/more2.png" :class="{ 'collapsed-icon': list.isOpen }">
                <p class="title-list">{{list.title}}</p>
            </div>
    
            <ul v-if="list.isOpen && list.items.length > 0" class="list-content">
                <li v-for="item in list.items" 
                    :key="item" 
                    class="menu-item"
                    @click="goToChat(item)" 
                    :class="{active: chatStore.activeRoom === item.name}">
                    
                    <p>{{item.name}}</p>
            
                </li>
            </ul>

             <ul v-else-if="list.isOpen && list.title === 'Favoritos'" class="list-content-empty">
                <p> Seus favoritos aparecerão aqui. </p>
            </ul>

            <ul v-else-if="list.isOpen && list.title === 'Mensagens Diretas'" class="list-content-empty">
                <p> Encontre amigos e inicie uma conversa </p>
            </ul>

            <ul v-else class="list-content">
                <li 
                    v-if="isActiveItem(list)"
                    class="menu-item active"
                    @click="goToChat(activeItem(list))">
                    <p>{{ activeItem(list).name }}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { useChatStore } from '@/stores/chat';

export default {
    computed: {
        chatStore() {
          return useChatStore();
        },
        userLists() {
            const userId = this.chatStore.loggedInUser?.nickname;
            
            const filteredLists = 
                this.chatStore.lists.map(list => {
                    if(list.title === 'Salas') {
                    // Adicione a sala Geral a todos os usuários
                        return {
                            ...list,
                            items: list.items.filter(item => item.participants.includes(userId) || item.name === 'Geral')
                        };
                    } 
                    return { 
                        ...list,
                        items: 
                        list.items.filter(item => item.participants.includes(userId))
                    };
                });
            console.log('Lista filtrada para o usuário:', filteredLists);
            return filteredLists;
        }
    },
    
    methods: {
        goToChat(item){
            this.$router.push({name: 'chat-room', params: {roomName: item.name} });
            this.chatStore.setActiveRoom(item.name);
            console.log("Entrou na sala:", item.name);
        },
        isActiveItem(list) {
            // Verifica se a lista tem o item ativo
            return list.items.some(item => this.chatStore.activeRoom === item.name);
        },
        activeItem(list) {
            // Retorna o item ativo da lista
            return list.items.find(item => this.chatStore.activeRoom === item.name);
        }
    },

}
</script>

<style scoped>
.lists{
   display: flex;
   flex-direction: column;
   padding: 20px 40px;
   box-sizing: border-box;

   max-width: 90%;

   gap: 20px;
   flex-grow: 1;
}

.list-header{
   display: flex;
   flex-direction: row; 
   align-items: center;
   overflow-wrap: break-word;
   margin-bottom: 8px;
   
   cursor: pointer;
}

.list-header img {
   margin-right: 10px;
   transition: transform 0.3s ease;
}

.list-header img.collapsed-icon {
    transform: rotate(90deg);
}

.list-header:hover{
   font-weight: 500;
}

.list-content {
   list-style: none; 
   padding: 0;
   margin-bottom: 10px;
   overflow: hidden; 
}

.list-content-empty{
    font-size: 12px;
    background-color: rgba(255, 255, 255, 5%);
    padding: 5px 15px;
    border-radius: 8px;
    /* color: ; */
}

.list-header, .menu-item{
    font-size: 14px;
   text-overflow: ellipsis;
   max-width: 100%;
}


.menu-item {
   display: flex;
   align-items: center;

   padding: 5px 15px;
   margin-bottom: 7px;
   

   border-radius: 8px;

   cursor: pointer;
   transition: background-color 0.2s ease;
}

.menu-item:hover {
   background-color: rgba(255, 255, 255, 0.1);
}

.active {
   background-color: rgba(255, 255, 255, 0.1);

}

@media (max-width: 425px){
    .list-header, .menu-item{
        white-space: normal;      /* Permite que o texto quebre a linha */
        overflow: visible;      /* Torna o texto visível */
        text-overflow: unset;    /* Reseta a propriedade de três pontos */
        overflow-wrap: break-word;   /* Força a quebra de palavras muito longas */
        max-width: 100%;
    }

    .list{
        padding: 20px;
        gap: 10;
    }

}
</style>