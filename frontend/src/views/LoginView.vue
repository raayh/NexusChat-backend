<template>
  <div class="body">

      <div class="topbar">
        <img src="@/assets/images/logo.png" alt="" class="img-logo">
        <h1 class="text-logo">Nexus</h1>
      </div>

      <div class="box-login">
        
        <p class="title-login">Faça login ou cadastre-se</p>
        
        <input type="text" v-model="nickname" placeholder="Insira seu nickname">
        
        <div class="password-container">
          <input :type="isPasswordVisible ? 'text' : 'password'" v-model="password" placeholder="Insira sua senha">
          
          <img 
            :src="isPasswordVisible ? 'src/assets/icons/eye.png' : 'src/assets/icons/hiddenEye.png'" 
            class="toggle-password"
            @click="isPasswordVisible = !isPasswordVisible"
          >
        </div>

        <div class="btn">
          <button @click="addUser()" class="create">Criar</button>
          <button @click="login()" class="login">Login</button>
        </div>

      </div>
    </div>
</template>

  <script>
    import { useChatStore } from '../stores/chat';
    import { useToast } from "vue-toastification";
     
    export default {
      
      data (){
        return {
          nickname: '',
          password: '',
          isPasswordVisible: false
        };
      },

      computed: {
        chatStore() {
          return useChatStore();
        },
      },
      watch: {
      nickname(newValue) {
        const lowercaseValue = newValue.toLowerCase();
        const trimmedValue = lowercaseValue.trim();
        this.nickname = trimmedValue;
      },
      password(newValue) {
        const trimmedValue = newValue.trim();
        this.password = trimmedValue;
      }
    },
    methods: {
        
        login() {
          const toast = useToast();
          const result = this.chatStore.login(this.nickname, this.password);

          if(result.status === "success"){
            toast.success(`Bem-vindo(a), ${result.user.nickname} !`);
            this.$router.replace('/chat');
          } else if (result.status === "wrong-password"){
            toast.error("Senha incorreta. Tente novamente.");
          } else if (result.status === "not-found"){
            toast.warning("Usuário não encontrado. Clique em 'Criar' para se cadastrar.");
          }
        },
        addUser(){
          const toast = useToast();
          const result = this.chatStore.addUser(this.nickname, this.password);
          if(result.status === "created"){
            toast.success(`Bem-vindo, ${result.user.nickname} !`);
            this.$router.replace('/chat');
          } else if (result.status === "already-exists"){
            toast.warning("Esse nickname já está em uso, escolha outro para continuar.");
          }
        }
      },
    mounted() {
      // Carrega o estado inicial da store
      // this.chatStore.init();
      // Se houver um usuário logado, redireciona para o chat
      // if (this.chatStore.loggedInUser) {
      //   this.$router.replace('/chat');
      // }
    },
    };
  </script>

<style scoped>
.body {
  display: flex;
  flex-direction: column;     /* empilha os elementos: cabeçalho em cima, box embaixo */
  justify-content: center; /*distribui espaço entre topo e meio */
  align-items: center;        /* centraliza horizontal */
  
  padding: 25px;
  height: 100vh;            /* ocupa altura total da tela */
  
  background-color: #583BBF;
  color: white;

  /* Imagem de fundo */
  background-image: url('@/assets/images/fundo.png');  /* caminho da imagem */
  background-size: cover;                          /* cobre toda a tela */
  background-position: center;                     /* centraliza a imagem */
  background-repeat: no-repeat;                    /* não repete */
}

.topbar {
  display: flex;
  flex-direction: row;
  align-items: center;

  position: fixed;
  top: 25px;
}

.img-logo{
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.text-logo{
  font-size: 60px;
  font-weight: bold;
  margin:auto;
}

.box-login{
  display: flex;
  flex-direction: column;

  /* width: 496px; */

  padding: 39px 80px;
  margin: 250px 0px;
  align-items: center;

  border-radius: 15px;
  background-color: rgba(200, 190, 234, 76%);
}

.title-login{
  color:black;
  font-size: 24px;
  font-weight: bold;

  margin-bottom: 25px;
}

input{
  border: none;
  border-radius: 5px;

  margin-bottom: 8px;
  padding-left: 10px;

  min-height: 40px;
  min-width: 280px;
}

input:focus{
   outline: none;
}
.password-container {
  position: relative;
  /* min-width: 280px; 
  margin-bottom: 8px; */
}

.password-container img {
  position: absolute; 
  right: 10px;        
  top: 10%;
  cursor: pointer;
}
.btn{
  display: flex;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  max-width: 280px; /* mesma largura dos inputs */

  padding: 15px;
}

button{
  /* flex: 1; */
  border: none;
  border-radius: 20px;

  color: white;
  
  background-color: #583BBF;
  font-size: 16px;
  font-weight: bold;

  padding: 8px 40px;
}

</style>