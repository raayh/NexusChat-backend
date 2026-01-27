<template>
    <div class="container-details">

       <div class="banner"></div>

        <!-- Infos -->
        <div class="infos">
            <div class="avatar-container">
                <img :src="chatStore.avatarUrl(chatStore.loggedInUser?.nickname)" alt="" class="avatar-image">
            </div>
            <!-- <p class="avatar-name">Rayssa Guerra</p> -->
            <p class="avatar-nickname">{{chatStore.loggedInUser?.nickname}}</p>
        </div>

       <ul class="actions">
            <li class="status" @click="toggleStatus">
                <span class="status-indicator" :class="{'online-status': status=='Online', 'offline-status': status=='Offline'}"></span>
                <p>{{status}}</p>
                <!-- <img src="../assets/icons/more3.png"> -->
            </li>
            <li class="logout" @click="logout()">
                <img src="../assets/icons/logout.png">
                <p>Sair</p>
            </li>
        </ul>

    </div>
</template>

<script>
import { useChatStore } from '../stores/chat';

export default{

    computed: {
        chatStore() {
          return useChatStore();
        },
        status(){
            const userLogado = this.chatStore.loggedInUser;
            const users = this.chatStore.users;
            const user = users.find(user => user.nickname == userLogado?.nickname); 
            if(user){
                return user.online ? 'Online' : 'Offline'
            }
            return user;
        },
        logout(){
            this.chatStore.logout();
            this.$router.replace('/');
        },
        toggleStatus(){
            this.chatStore.changeStatus(this.chatStore.loggedInUser.nickname);
        }
     }
}
</script>

<style>
.container-details {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    position: absolute;
    top: 10%;
    left: 2.5%;

    gap: 10px;

    width: 20%;

    border-radius: 10px;

    /* margin: 10px; */
    /* padding: 16px; */

    background-color: #C8BEEA;
    color: #3D2450;

    overflow: hidden;
}

/* Banner */
.banner {
  width: 100%;
  height: 100px;
  background-color:  #3D2450;
  position: relative;
  border-radius: 10px;
}

/* Avatar em cima do banner */
.avatar-container {
  position: absolute;
  top: 60px; /* metade dentro do banner */
  left: 20px;
}
.avatar-image {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 4px solid #C8BEEA; /* mesma cor do fundo */
  object-fit: cover;
}

/* Infos */
.infos {
  margin-top: 8px; /* espaço pro avatar não sobrepor */
  padding: 16px 0px 8px 16px;
}

/* .avatar-name {
  font-weight: bold;
  font-size: 16px;
  margin: 0;
} */

.avatar-nickname {
  font-weight: bold;
  font-size: 16px;
  padding-left: 12px;
}

.avatar-nickname::first-letter {
  text-transform: uppercase;
}

/* Ações */
.actions {
  display: flex;
  flex-direction: column;
  
  gap: 12px;
  border-radius: 10px;

  width: calc(100% - 32px);
  box-sizing: border-box;

  overflow: hidden; /* corta caso estoure */
  word-break: break-word;

  margin: 0px 16px 16px;
  padding: 10px;

  background-color: #D9D9D9;
  list-style: none;
  font-size: 14px;
}

.status,
.logout {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  padding: 8px;
}

.status span{
    margin: 0;
}

.status:hover,
.logout:hover {
  background-color: rgba(61, 36, 80, 7%);
  border-radius: 10px;
  cursor: pointer;
  font-weight: 620;
}

@media(max-width: 425px){
  .container-details{
    width: 90%;
  }

  .banner{
    height: 80px;
  }

  .avatar-container{
    top: 35px; /* metade dentro do banner */
  }

}

@media(max-width: 768px){
  .container-details{
    width: 20%;
  }

  .banner{
    height: 80px;
  }

  .avatar-container{
    top: 35px; /* metade dentro do banner */
  }

}

@media(max-width: 2560px){
  .container-details{
    width: 15%;
    top: 5%;
  }

  .banner{
    height: 80px;
  }

  .avatar-container{
    top: 35px; /* metade dentro do banner */
  }

}


</style>
