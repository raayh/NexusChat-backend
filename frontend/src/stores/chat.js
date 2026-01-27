import { defineStore } from 'pinia'
import axios from 'axios';
import Faye from 'faye';

export const useChatStore = defineStore("chat", {
   state: () => ({
      users: [
         { nickname: 'rafinha', password: '123', online: true, avatarId: 1 },
         { nickname: 'carlos', password: '123', online: true, avatarId: 2 },
         { nickname: 'ana', password: '123', online: false, avatarId: 30 },
         { nickname: 'raayh', password: '123', online: false, avatarId: 10 },
         { nickname: 'leo', password: '123', online: false, avatarId: 5 },
         { nickname: 'mat', password: '123', online: false, avatarId: 6 }
      ],
      loggedInUser: null,
      lists: [
          { 
            title: 'Favoritos', 
            items: [ 
               {name: "(Eu)", participants: []},
               {name: "BFFs", participants: ["raayh", "mat", "ana"]}, 
            ], 
            isOpen: false
         },
          { 
            title: 'Salas', 
            items: [ 
               {name: "Geral", participants: ["raayh", "ana", "carlos", "rafinha", "leo", "mat"]}, 
               {name: "Músicas", participants: ["carlos", "leo", "raayh", "ana"]}, 
               {name: "BFFs", participants: ["raayh", "mat", "ana"]}
            ], 
            isOpen: false
         },
         { 
            title: 'Mensagens Diretas', 
            items: [ 
               { name: "Mat", participants: ["raayh"] },
               { name: "Ana", participants: ["raayh"] },
               { name: "Raayh", participants: ["mat"] }
            ], 
            isOpen: false
         },
      ],
      activeRoom: 'Geral',       
      messagesByRoom: {},
      newMessage: [],
      visibleMessagesCount: {},
      fayeClient: null,
    }),

    getters: {
      avatarUrl: (state) => (nickname) => {
            const user = state.users.find(u => u.nickname === nickname)
            if (!user) return "https://i.pravatar.cc/150?img=4" // fallback
            return `https://i.pravatar.cc/150?img=${user.avatarId}`
      },
      activeRoomUsers(state) { // retorna os usuários no chat
            const roomName = state.activeRoom
            // pega todas as salas/favoritos/diretas
            const allRooms = state.lists.flatMap(l => l.items)
            // acha a sala pelo "name"
            const current = allRooms.find(i => i.name === roomName)

            if (!current) return []

            // para cada nickname nos participants, busca no array de users
            return current.participants.map(nickname => {
                const user = state.users.find(u => u.nickname === nickname)
                return {
                    nickname: user?.nickname || nickname,
                    online: user?.online || false
                }
            })
            
      },
      onlineUsersCount() { // retorna a qtd de usuários onlines
            // 1. Usa o resultado de `activeRoomUsers`.
            // 2. Filtra a lista, mantendo apenas os que têm `online: true`.
         // 3. Retorna o número de itens na lista filtrada.
            return this.activeRoomUsers.filter(user => user.online).length;
      },
      offlineUsersCount() { //retorna a qtd de usuários offlines
            // 1. Usa o resultado de `activeRoomUsers`.
            // 2. Filtra a lista, mantendo apenas os que têm `online: true`.
            // 3. Retorna o número de itens na lista filtrada.
            return this.activeRoomUsers.filter(user => !user.online).length;
      }
   },
    actions: {
     // Inicializa a store carregando do localStorage
      async init() {
         this.users = JSON.parse(localStorage.getItem("users")) || this.users;
         this.loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || null;
         this.activeRoom = JSON.parse(localStorage.getItem("activeRoom")) || "Geral";
         this.messagesByRoom = JSON.parse(localStorage.getItem("messagesByRoom")) || {};
         this.lists = JSON.parse(localStorage.getItem("lists")) || this.lists;
         
         // Se não tiver nada no localStorage ainda, carrega do arquivo JSON
         if (Object.keys(this.messagesByRoom).length === 0) {
            try {
               const response = await axios.get('/messages.json');
               this.messagesByRoom = response.data;
               localStorage.setItem("messagesByRoom", JSON.stringify(this.messagesByRoom));
            } catch (error) {
               console.error("Erro ao carregar mensagens:", error);
            }
         }

         Object.keys(this.messagesByRoom).forEach(room => {
            if (!this.visibleMessagesCount[room]) {
               this.visibleMessagesCount[room] = Math.min(10, this.messagesByRoom[room].length);
            }
         });
      },
      initFaye() {
         if (!this.fayeClient){
            this.fayeClient = new Faye.Client('http://localhost:8000/faye');

            this.fayeClient.subscribe('/messages', message => {
               console.log('Nova mensagem do Faye:', message);
               this.addNewMessage(message); // aqui o `this` é a store
            });
         }

         console.log('Cliente Faye inicializado')
      },
     // ---------- AUTH ----------
      login(nickname, password) {
         const user = this.users.find(user => user.nickname === nickname);
         
         if(!user) return { status: "not-found" }; 
         if (user.password !== password) return { status: "wrong-password" };
         if(user) {user.online = true}
         this.loggedInUser = user;
         
         
         localStorage.setItem("loggedInUser", JSON.stringify(this.loggedInUser));
         return { status: "success", user };
      },
      addUser(nickname, password) {

         const exists = this.users.find(user => user.nickname === nickname);
         if(exists) return { status: "already-exists" };

         const newUser = { 
            nickname, 
            password, 
            online: true,
            avatarId: Math.floor(Math.random() * 70) + 1
         };
         
         this.addUserToGeneral(newUser.nickname)
         this.users.push(newUser);
         this.loggedInUser = newUser;
            
         localStorage.setItem("users", JSON.stringify(this.users));
         localStorage.setItem("loggedInUser", JSON.stringify(this.loggedInUser));
         localStorage.setItem("lists", JSON.stringify(this.lists));

         return { status: "created", user: newUser };
      },
      logout(){
         const nickname = this.loggedInUser.nickname;

         // Marca o usuário como offline
         const user = this.users.find(u => u.nickname === nickname);
         if (user) {
            user.online = false;
         }

         // Mantém o objeto no localStorage mas sem status online
         this.loggedInUser.online = false;
         localStorage.setItem("users", JSON.stringify(this.users));
         localStorage.removeItem("loggedInUser");

         // Reseta o loggedInUser na store
         this.loggedInUser = null;
      },
      changeStatus(nickname){
         const user = this.users.find(user => user.nickname == nickname);
          if (user) {
            user.online = !user.online;
         }
         // Se for o usuário logado, sincroniza
         if (this.loggedInUser?.nickname === nickname) {
            this.loggedInUser.online = user.online;
         }
         localStorage.setItem("users", JSON.stringify(this.users));
         localStorage.setItem("loggedInUser", JSON.stringify(this.loggedInUser));
      },
      // ---------- ROOMS ----------
      setActiveRoom(room){
         this.activeRoom = room;
         if (!this.visibleMessagesCount[room]){
            this.visibleMessagesCount[room] = 10; //inicia o chat com 10 mensagens.
         }
         localStorage.setItem("activeRoom", JSON.stringify(this.activeRoom));
      },
      async loadMoreMessages(room){
         const totalMessages = this.messagesByRoom[room]?.length || 0;
         const currentVisible = this.visibleMessagesCount[room] || 0;

         if(currentVisible < totalMessages){
            const increment = 10;
            const nextCount = Math.min(currentVisible + increment, totalMessages);
            await new Promise(resolve => setTimeout(resolve, 1000)); // ajuste o tempo aqui
            
            this.visibleMessagesCount[room] = nextCount;
         }
      },
      toggleList(listTitle) {
         // Encontra a lista no estado da store
         const list = this.lists.find(list => list.title === listTitle);
         // Se a lista for encontrada, altera o estado
         if (list) {
            list.isOpen = !list.isOpen;
         }
      },
      addUserToGeneral(userNickname) {
         const roomsList = this.lists.find(list => list.title === 'Salas');
         
         if (roomsList) {
            const generalRoom = roomsList.items.find(item => item.name === 'Geral');
         
         if (generalRoom && !generalRoom.participants.includes(userNickname)) {
               generalRoom.participants.push(userNickname);
            }
         }
      },
      // ---------- MESSAGES ----------
      addNewMessage(newMessage){
         if (!this.messagesByRoom[this.activeRoom]) {
            this.messagesByRoom[this.activeRoom] = [];
         }
         this.messagesByRoom[this.activeRoom].push(newMessage);
         localStorage.setItem("messagesByRoom", JSON.stringify(this.messagesByRoom));


      }
    }
})