# Guia Técnico Pessoal (Ficha Técnica): Backend

> [!TIP]
> **Este é o seu guia privado.** Ele contém o "passo a passo" técnico e os "porquês" por trás deste projeto. Para a documentação profissional externa, use o [README.md](README.md).

## 1. Como esta aplicação foi gerada?

Para começar este projeto do zero, os seguintes passos foram executados:

### Passo 1: Criação do Projeto Rails API
```bash
rails new backend --api --database=postgresql
```
- `--api`: Remove bibliotecas de visualização (HTML/CSS) que não usamos, foca apenas em JSON.
- `--database=postgresql`: Define o banco de dados que é padrão para aplicações profissionais e deploys (como no Heroku/Railway).

### Passo 2: Adição de Gemas Essenciais
No arquivo `Gemfile`, adicionamos:
- `gem 'devise'`: Base para autenticação.
- `gem 'devise_token_auth'`: Adapta o Devise para funcionar com Tokens (ideal para APIs e Frontends separados).
- `gem 'rack-cors'`: Permite que o seu Frontend (que roda em uma porta diferente) converse com o Backend.

### Passo 3: Configuração de Autenticação
Executamos o gerador do Devise Token Auth:
```bash
rails generate devise_token_auth:install User auth
```
Isso criou o modelo `User` e a tabela de usuários com suporte a tokens.

---

## 2. Estrutura do Projeto: Onde mexer?

### Modelagem: O que desenhamos?

![Meu Diagrama ER Finalizado](/home/note-rayssa/.gemini/antigravity/brain/5919e7df-eeac-48c2-bc16-84933c68015a/uploaded_image_1769523008846.png)

**Resumo das Conexões Técnicas:**
- **Propriedade**: `Messages` pertencem a um `User` e a uma `Room` (Chaves estrangeiras: `user_id`, `room_id`).
- **Participação**: Usamos a tabela `Membership` para conectar `Users` e `Rooms`, permitindo escalar para grupos ou DMs.
- **Estrutura**: Seguimos o padrão `snake_case` e tipos de dados Rails (`string`, `integer`, `boolean`, `text`).

### Comandos de Geração (Para o seu registro):
1. `rails generate model Room name:string is_private:boolean limit:integer`
2. `rails generate model Membership user:references room:references`
3. `rails generate model Message content:text user:references room:references`

> [!TIP]
> **Dica Sênior**: O comando `references` cria automaticamente o campo `_id` e configura a integridade referencial no banco de dados.

### Configuração do Banco de Dados

O banco de dados PostgreSQL está rodando via **Docker na porta 5433** (para não conflitar com o PostgreSQL local do trabalho).

**📚 Documentação Completa:** [DATABASE_SETUP.md](DATABASE_SETUP.md)

#### Resumo Rápido

```bash
# 1. Subir o Docker
docker compose up -d

# 2. Criar bancos
rails db:create

# 3. Rodar migrações
rails db:migrate

# 4. Verificar status
rails db:migrate:status
```

**Tabelas criadas:**
- ✅ `users` (autenticação com Devise Token Auth)
- ✅ `rooms` (salas de chat)
- ✅ `memberships` (relacionamento User ↔ Room)
- ✅ `messages` (mensagens enviadas)

**Associações configuradas:**
- `User` has_many `rooms` through `memberships`
- `User` has_many `messages`
- `Room` has_many `users` through `memberships`
- `Room` has_many `messages`
- `Membership` belongs_to `user` and `room`
- `Message` belongs_to `user` and `room`

**pgAdmin:** Configure servidor em `localhost:5433` com database `backend_development`

> [!NOTE]
> Para guia completo incluindo troubleshooting, exemplos de teste no console e explicações detalhadas, veja [DATABASE_SETUP.md](DATABASE_SETUP.md)

### Rotas (Endpoints)
- **Local**: `config/routes.rb`
- Atualmente, temos o `mount_devise_token_auth_for 'User', at: 'auth'`. Isso gera automaticamente rotas como `/auth` para login e cadastro.

### CORS (Segurança)
- **Local**: `config/initializers/cors.rb`
- **Dica**: Aqui é onde você autoriza o seu Frontend (`localhost:5173`) a acessar os dados do Rails.

---

## 3. Comandos Úteis do Dia a Dia

- **Subir o servidor**: `rails s` (ou via Docker: `docker-compose up`).
- **Criar Migração**: `rails g migration NomeDaMudanca`.
- **Console do Rails** (para testar código): `rails c`.
- **Status do Banco**: `rails db:migrate:status`.

---

## 4. Controllers e Rotas

### Rotas Configuradas

**Arquivo**: [config/routes.rb](config/routes.rb)

```ruby
Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'auth'
  
  resources :rooms do
    resources :messages, only: [:index, :create] # Rotas aninhadas
  end
end
```

**Servidor:** Porta `3001` (porta 3000 reservada para outro projeto)

```bash
rails server -p 3001
```

### Controllers de API

#### RoomsController

**Arquivo**: [app/controllers/rooms_controller.rb](app/controllers/rooms_controller.rb)

```ruby
class RoomsController < ApplicationController
    def index
        @rooms = Room.all       # Lista todas as salas
        render json: @rooms
    end

    def show
        @room = Room.find(params[:id])  # Busca uma sala pelo ID
        render json: @room
    rescue ActiveRecord::RecordNotFound
        render json: { error: "room_not_found" }, status: :not_found
    end
end
```

#### MessagesController

**Arquivo**: [app/controllers/messages_controller.rb](app/controllers/messages_controller.rb)

```ruby
class MessagesController < ApplicationController
    before_action :authenticate_user! # Protege contra acesso sem login

    def index
        @room = Room.find(params[:room_id])
        @messages = @room.messages
        render json: @messages
    end

    def create
        @room = Room.find(params[:room_id])
        # .build já cria associado à sala e mesclamos o usuário logado aos parâmetros
        @message = @room.messages.build(message_params.merge(user: current_user))

        if @message.save 
            render json: @message, status: :created
        else
            render json: @message.errors, status: :unprocessable_entity
        end
    end

    private

    def message_params
        # Strong Parameters: Impede Vulnerabilidade de Mass Assignment
        params.permit(:content) 
    end
end
```

**Endpoints funcionando:**

| Método | URL | Controller#Action | O que faz |
|--------|-----|-------------------|-----------|
| GET | `/rooms` | `rooms#index` | Lista todas as salas |
| GET | `/rooms/:id` | `rooms#show` | Mostra uma sala específica |
| GET | `/rooms/:room_id/messages` | `messages#index` | Lista mensagens da sala |
| POST | `/rooms/:room_id/messages` | `messages#create` | Cria mensagem na sala (requer Auth) |

**Teste Simples (Sem Auth):** `http://localhost:3001/rooms`

---

## 5. Próximos Passos

- [x] **`MessagesController`** → Listar e enviar mensagens ✅
- [x] **Autenticação e Proteção Básica** → Proteger rotas com Devise Token Auth ✅
- [x] **Seeds** → Dados de teste (`rails db:seed`) ✅
- [x] **Serializers (Blueprinter)** → Formatar as respostas JSON (Ocultar dados sensíveis e aninhar relacionamentos). *Status: Concluído. Instalamos a gem atraves do comando `bundle add blueprinter` e criamos `UserBlueprint` e `MessageBlueprint` com suas respectivas associações.* ✅
- [ ] **`create` em Rooms** → `POST /rooms` para criar salas (Deixaremos para a v2, não é prioridade do MVP agora).
- [x] **WebSockets / Action Cable** → Para não precisar recarregar a página ao receber mensagens. *Status: Concluído. Configurado `RoomChannel`, Broadcast no Controller e Autenticação no Connection.* ✅

---

### Notas de Mentoria:
Sempre que você olhar para este arquivo, lembre-se: o Rails é sobre **convenção**. Se você seguir o padrão de nomes (modelos no singular, tabelas no plural), ele fará 80% do trabalho chato por você!
