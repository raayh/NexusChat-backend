<template>
   <div class="body" :class="{'sidebar-collapsed': isSidebarCollapsed}">

      <div class="sidebar"  ref="sidebar">

         <div class="user-info">
            <div class="avatar" @click="toggleUserDetails">
               <img :src="chatStore.avatarUrl(chatStore.loggedInUser?.nickname)"  alt="" class="avatar-image">
               <p class="avatar-name">{{chatStore.loggedInUser?.nickname}}</p>
            </div>
            <!-- <img src="../assets/icons/more.png" alt="" class="more-image"> -->
         </div>

         <userDetails v-if="showUserDetails":isDirectMessage="isDirectMessage"/>

         <SidebarLists />

         <div class="logo">
            <img src="@/assets/images/logo.png" alt="" class="logo-image">
         </div>
        
      </div>

      <div class="chat">
         
         <div class="top-bar">

            <div class="menu-button" @click.stop="toggleSidebar">
                <img src="../assets/icons/menu.png" alt="Menu">
             </div>

            <div class="chat-info">
               <h3 class="room-name"> {{ chatStore.activeRoom || "Selecione uma sala" }} </h3>
               <p @click="toggleOnlineModal" v-if="!isDirectMessage" class="online"> {{chatStore.onlineUsersCount}} pessoas online  </p>
               <p v-else > {{ isDirectMessage.online ? 'Online' : 'Offline' }} </p>
            </div>

            <div class="topBar-actions">
               <div class="search" @click="toggleSearchModal">
                  <input type="text" v-model="searchText"  class="search-text" placeholder="Buscar">
                  <img v-if="searchText.length == 0" src="../assets/icons/search.png" alt="" class="search-icon">
                  <img v-if="searchText.length > 0" @click.stop="clearSearch" src="../assets/icons/close.png" alt="" class="close-icon">
               </div>

            </div>
         </div>

         <div class="chat-body">
            
            <div class="chat-content">
               <div class="messages-block" ref="messagesblock" @scroll="handleScroll" :class="{ 'is-scrolling': isScrolling }">
                  <div v-if="loadingMore" class="loading-more">Carregando mais...</div>
                  <ChatMessage />
               </div>
           
               <div class="message-bar">
                  <input 
                     type="text" 
                     class="new-message" 
                     v-model="newMessageText" 
                     @keyup.enter="sendMessage()"
                     placeholder="Digite sua mensagem aqui...">
                  <div class="new-message-icons">
                     <!-- <img src="" alt="" class="attchment">
                     <img src="" alt="" class="emoji">
                     <img src="" alt="" class="text-editor"> -->
   
                     <img src="../assets/icons/send_message.png" class="send" @click="sendMessage()">
                  </div>
               </div>
            </div>

            <Search v-if="showSearchModal" :searchText="searchText"/> 
            
            <OnlinePeopleList v-if="showOnlineModal" />

         </div>

      </div>
   </div>
</template>

<script>
import { useChatStore } from '../stores/chat';
import SidebarLists from '@/components/SidebarLists.vue';
import ChatMessage from '@/components/ChatMessage.vue';
import Search from '@/components/Search.vue';
import OnlinePeopleList from '@/components/OnlinePeopleList.vue';
import userDetails from '@/components/userDetails.vue';

export default{
   components:{
      SidebarLists,
      ChatMessage,
      Search,
      OnlinePeopleList,
      userDetails
   },
   data() {
      return {
        newMessageText: '',
        searchText: '',

        showSearchModal: false,
        showOnlineModal: false,
        showUserDetails: false,

        isSidebarCollapsed: true,
        isScrolling: false,
        scrollTimeout: null,
        loadingMore: false
      };
   },
   computed: {
      chatStore() {
         return useChatStore();
      },
      currentMessages() {
         const room = this.chatStore.activeRoom;
         const total = this.chatStore.messagesByRoom[room] || [];
         const count = this.chatStore.visibleMessagesCount[room] || 0;
         return total.slice(-count);       
      },
      isDirectMessage(){
        const roomTitle = this.chatStore.activeRoom;
         // Encontre a lista de "Mensagens Diretas" e armazene-a
        const dmsList = this.chatStore.lists.find(list => list.title === 'Mensagens Diretas');
        // Se a lista de DMs não existir, retorne falso
        if (!dmsList || !dmsList.items) {
            return false;
        }
        // Encontre o objeto do contato da DM
        const dmContact = dmsList.items.find(item => item.name === roomTitle);
        // Se o contato for encontrado, retorne o objeto dele, senão retorne falso
        if (dmContact) {
            return dmContact;
        }
        return false;
      }
   },
   methods: {
      sendMessage(){
         const room = this.chatStore.activeRoom;
         const messages = this.chatStore.messagesByRoom[room];
        
         if(!this.newMessageText == ''){
            const newMessage = {
               id: (Math.max(...messages.map(m => m.id)) + 1),
               nickname: this.chatStore.loggedInUser.nickname.trim().toLowerCase(),
               text: this.newMessageText,
               date: new Date().toISOString(),
            };

            if (this.chatStore.fayeClient) {
               this.chatStore.fayeClient.publish('/messages', newMessage);
             }

            // this.chatStore.addNewMessage(newMessage);
            this.newMessageText = '';


            //  console.log('this.fayeClient:', this.fayeClient);
            // console.log('this.chatStore.fayeClient:', this.chatStore.fayeClient);


            this.scrollToBottom();

         } else {
            alert("Digite alguma coisa para enviar")}
         
      },
      scrollToBottom() {
         // O $nextTick garante que a rolagem aconteça APÓS a nova mensagem ser renderizada
         this.$nextTick(() => {
            const container = this.$refs.messagesblock;
            if (container) {
               container.scrollTop = container.scrollHeight;
            }
         });
      },
      toggleSearchModal(){
         this.showOnlineModal = false;
         this.showSearchModal = true
      },
      clearSearch() {
         this.searchText = '';
         
         // this.showSearchModal = false;
      },
      toggleOnlineModal(){
         this.showSearchModal = false;
         this.showOnlineModal = !this.showOnlineModal
      },
      toggleUserDetails(){
         this.showSearchModal = false;
         this.showUserDetails = !this.showUserDetails
      },
      toggleSidebar() {
            this.isSidebarCollapsed = !this.isSidebarCollapsed;
      },
      handleEsc(event) {
         if (event.key === "Escape") {
            if (this.showUserDetails) {
               this.showUserDetails = false;
            }

            else if (this.showOnlineModal) {
               this.showOnlineModal = false;
            }

            else if (this.showSearchModal) {
               this.showSearchModal = false;
            }

            else if (!this.isSidebarCollapsed) {
               this.isSidebarCollapsed = true;
            }
         }
      },
      async handleScroll(e){
         this.isScrolling = true;

         if(this.scrollTimeout) clearTimeout(this.scrollTimeout);
         this.scrollTimeout = setTimeout(() => this.isScrolling = false, 1000);

         const container = e.target;
         if(container.scrollTop === 0 && !this.loadingMore){
            this.loadingMore = true; 
            const oldHeight = container.scrollHeight;

            // Chama a store, mas sem delay extra na store
            await this.chatStore.loadMoreMessages(this.chatStore.activeRoom);

            this.$nextTick(() => {
               const newHeight = container.scrollHeight;
               container.scrollTop = newHeight - oldHeight;
               this.loadingMore = false; 
            });    
         } 
      },
   },
   watch: {
    // O watcher observa a propriedade computada `currentMessages`
    currentMessages() {
      this.scrollToBottom();
    },
    newMessageText(newValue, oldValue) {
      // Se a nova mensagem for mais longa que a anterior
      if (newValue.length > oldValue.length) {
            // Capitaliza a primeira letra da string
            const firstChar = newValue.charAt(0).toUpperCase();
            const restOfString = newValue.slice(1);
            this.newMessageText = firstChar + restOfString;

            // // Capitaliza a primeira letra após um ponto final
            // const lastChar = oldValue.slice(-1);
            // if (lastChar === '.' || lastChar === '!' || lastChar === '?') {
            //    const lastDotIndex = newValue.lastIndexOf(lastChar);
            //    if (lastDotIndex !== -1 && lastDotIndex < newValue.length - 1) {
            //       const firstHalf = newValue.slice(0, lastDotIndex + 1);
            //       const secondHalf = newValue.slice(lastDotIndex + 1);
            //       const capitalizedSecondHalf = secondHalf.trim().charAt(0).toUpperCase() + secondHalf.trim().slice(1);
            //       this.newMessageText = firstHalf + ' ' + capitalizedSecondHalf;
            //    }
            // }
      }
   },
   },
   mounted() {
      this.chatStore.initFaye();

      document.addEventListener("keydown", this.handleEsc);

      this.scrollToBottom();
      this.$refs.messagesblock.addEventListener('scroll', this.handleScroll);
   },
   beforeUnmount(){
      document.removeEventListener("click", this.handleClickOutside);
      document.removeEventListener("keydown", this.handleEsc);

      this.$refs.messagesblock.removeEventListener('scroll', this.handleScroll);
   }
}
</script>

<style scoped>

.body {
  display: flex;
  flex-direction: row;        
  justify-content: space-between;   
  align-items: center;      
}

.sidebar{
   display: flex;
   flex-direction: column;        
   justify-content: space-between;   

   width: 25%;
   height: 100vh;            
  
   background-color: #583BBF;
   color: white;   
}

/* Cabeçalho do sidebar */

.user-info{
   display: flex;
   flex-direction: row; 
   justify-content: space-between; 

   padding: 8px 25px;

   border-bottom: 1px solid #C8BEEA;
}

.avatar{
   display: flex;
   flex-direction: row;
   align-items: center;

   border-radius: 8px;

   width: 100%;

   padding: 5px;
}

.avatar-image{
   width: 50px;
   height: 50px;

   border-radius: 50%; 
   object-fit: cover;

   margin-right: 20px;
}

.avatar-name{
   display: block;
   font-size: 20px;
   font-weight: bold;

   color: #C8BEEA;

   /* ... seus estilos existentes ... */
   white-space: nowrap;          /* Impede que o texto quebre a linha */
   overflow: hidden;             /* Oculta o texto que excede o contêiner */
   text-overflow: ellipsis;      /* Adiciona '...' ao final do texto cortado */
   max-width: 150px;
}

.avatar:hover{
   background-color: rgba(255, 255, 255, 0.1);
   cursor: pointer;
}

/* Rodapé sidebar */

.logo{
   padding: 0px 0px 10px 25px;
}

.logo-image{
   width: 44px;
}

.menu-button {
    display: none; /* Escondido por padrão */
}



/* Lado da conversa */

.chat{
   position: relative;
   display: flex;
   flex-direction: column;
   font-size: 14px;

   width: 75%;
   height: 100vh;            

   background-color: #C8BEEA;
   color: white;
}

/* Div que contem o conteudo(mensagens e input) e o modal */
.chat-body{ 
   display: flex;
   flex: 1; /* ocupa o espaço abaixo da top-bar */
   overflow: hidden;
}

/* Menagens e input */
.chat-content{
   display: flex;
   flex-direction: column;
   flex: 1;
}

/* Cabeçalho da conversa */
.top-bar{
   display: flex;
   flex-direction: row;
   flex: 0 0 auto;

   justify-content: space-between;
   
   padding: 18px 40px;

   border-bottom: 1px solid #B4A7DF;

   color: #3D2450;
}

.chat-info > .online{
   opacity: 60%;
}

.online:hover{
   font-weight: 500;
   cursor: pointer;
}

/* Icones de ação */

.topBar-actions{
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   align-items: center;
}

.notifications, .participants{
   padding: 10px;
}

.search{
   display: flex;
   flex-direction: row;

   position: relative;
   display: inline-block;

   padding-left: 10px;
}

.search-text{
   border: 1px solid #BBAFE3;
   border-radius: 8px;

   background-color: #C3B9E4;
   color: #3D2450;

   padding: 6px 21px 6px 15px;
}

.search-text:focus{
   outline: none;
}

.search-text::placeholder{
   color: #3D2450;
}

.search-icon, .close-icon{
   position: absolute;

   right: 10px;
   top: 25%;
}

/* Bloco das mensagens */
.messages-block{
   display: flex;
   flex-direction: column;
   flex: 1;

   overflow-y: auto;

   gap: 20px;
   padding: 30px 40px;
}

/* Estilizações do scroll */
.messages-block::-webkit-scrollbar {
  width: 10px; /* Largura do scrollbar */
}

.messages-block.is-scrolling::-webkit-scrollbar-thumb{
  background: #583BBF; /* Largura do scrollbar */
  border-radius: 10px;
  border: 2px solid #C8BEEA;
  opacity: 1; /* Opacidade total */
   transition: opacity 0.5s ease-in-out;
}
.messages-block.is-scrolling.fade-out::-webkit-scrollbar-thumb{
  background-color: transparent ;
  transition: background-color 3s ease-in-out;/* Largura do scrollbar */
}

.loading-more {
  text-align: center;
  padding: 5px;
  color: #3D2450;
  font-weight: bold;
}

/* .loading-more::after {
  animation: blink 1s infinite;
} */

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}


/* Input de mensagem */

.message-bar {
   flex: 0 0 auto;
   display: flex;
   justify-content: space-around;
   margin: 0px 35px 19px 35px;
   position: relative;
   /* max-width: 100%; */
}

.new-message {
   flex: 1;
   border: none;
   border-radius: 10px;

   background-color: white;
   color: #3D2450;

   padding: 18px 45px;
}

.new-message:focus{
   outline: none;
}

.new-message-icons{
   position: absolute;
   top: 22%;
   right:2%;
}
@media (max-width: 425px) {
   .sidebar {
      position: fixed;
      left: 0;
      top: 0;

      width: 45%;
      z-index: 100;

      transform: translateX(0); /* Esconde a sidebar */
      transition: transform 0.3s ease-in-out;
   }
   .sidebar-collapsed .sidebar {
      transform: translateX(-100%); /* Mostra a sidebar ao clicar */
   }
   .avatar-name{
      display: none;
   }
   /* .chat-info{
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 5px;
   } */ 
    .top-bar {
      padding: 10px 20px; /* Reduz o padding da barra superior */
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }
   .chat {
      width: 100%; /* O chat ocupa a tela toda */
   }
   .menu-button {
      display: block; /* Mostra o botão de menu */
      /* position: fixed;
      top: 18px;
      left: 10px;
      z-index: 101; */
   }
   .search-text {
      width: 150px; /* Reduz a largura */
      font-size: 12px;
    }

   .messages-block{
      padding: 30px 20px;
      
   }

   .message-bar{
      margin: 5px;
   }
    .new-message {
      padding: 10px 20px; /* Reduz o padding */
      font-size: 12px;
    }

   .new-message-icons{
      position: absolute;
      top: 5%;
      right: 3%;
   }
   
}

</style>
