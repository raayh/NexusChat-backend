<template>
    <div class="container-on">

        <p class="status-online"> Online - {{chatStore.onlineUsersCount}} </p>
        <div class="box-list" v-for="(user, index) in chatStore.activeRoomUsers" :key="index">
            <div class="list" v-if="user.online">
                <img :src="chatStore.avatarUrl(user.nickname)" class="user-avatar-image">
                <p class="user-name-message">{{user.nickname}} 
                    <span class="status-indicator" :class="{'online-status': user.online, 'offline-status': !user.online}"></span>
                </p>
            </div>
        </div>
        
        <p class="status-offline"> Offline - {{chatStore.offlineUsersCount}} </p>
        <div class="box-list" v-for="(user, index) in chatStore.activeRoomUsers" :key="index">
            <div class="list" v-if="!user.online">   
                <img :src="chatStore.avatarUrl(user.nickname)" class="user-avatar-image">
                <p class="user-name-message">{{user.nickname}} 
                      <span 
                        class="status-indicator" 
                        :class="{ 
                            'online-status': user.online, 
                            'offline-status': !user.online 
                        }"
                    ></span>
                </p>   
            </div>
        </div>

    </div>
</template>

<script>
import { useChatStore } from '@/stores/chat';

export default {
    props: {
        showOnlineModal:{
            type: Boolean
        }
    },
    components:{
    },
    computed: {
        chatStore (){
            return useChatStore();
        },
        currentMessages() {
            return this.chatStore.messagesByRoom[this.chatStore.activeRoom] || []
        } 
    },
    mounted(){
    }
}

</script>

<style>
.container-on {
    display: flex;
    flex-direction: column;

    padding: 25px;
    width: 20%;

    background-color: #C8BEEA;
    border-left: 1px solid #B4A7DF;  

    color: #3D2450;
    
    overflow-y: auto;
}
.close-icon{
    position: absolute;
    right: 20px;
    top: 85px;
}

.status-online, .status-offline{
    font-size: 14px;
    font-weight: 600;
}

.status-offline{
    margin-top: 15px;
}

.list {
    display: flex;
    flex-direction: row;
    align-items: center;

    margin-bottom: 10px;
    margin-top: 10px;

    color: #3D2450;
}

.user-avatar-image{
   width: 26px;
   height: 26px;

   border-radius: 50%; 
   object-fit: cover;

   margin-right: 10px;
}

.status-indicator {
  width: 10px;
  height: 10px;

  border-radius: 50%; /* Bolinha perfeita */
  display: inline-block; /* Para que fique na mesma linha que o texto */
  margin-left: 7px;
}

.online-status {
  background-color: #3D2450; 
}

.offline-status {
  background-color: #D9D9D9; 
}

@media(max-width: 425px){
    .container-on {
        position: absolute; /* Posição em relação ao .chat-body */
        top: 13%;
        right: 0;

        padding: 15px;
        
        width: 45%; /* Ocupa a largura total da tela */
        height: 100%; /* Ocupa a altura total do .chat-body */
        z-index: 99; /* Garante que o modal fique por cima de tudo */
        background-color: rgba(200, 190, 234, 0.9); /* Cor de fundo semi-transparente */
    }
}
</style>