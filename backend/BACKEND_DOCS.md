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

### Modelagem (Banco de Dados)
- **Local**: `app/models/`
- **O que fizemos**:
  - Criamos `User` (Usuários).
  - Criamos `Room` (Salas): `rails g model Room name:string is_private:boolean`.
  - Criamos `Message` (Conteúdo): `rails g model Message content:text user:references room:references`.
  - Criamos `Membership` (Ligação): `rails g model Membership user:references room:references`.

> [!IMPORTANT]
> Sempre que criar um modelo, não esqueça de rodar `rails db:migrate` para que as tabelas sejam criadas de verdade no banco.

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

## 4. Próximos Passos Recomendados
1. **Modelagem de Banco de Dados**: Finalizar a estrutura que você está desenhando.
2. **Controllers**: Criar a lógica para criar salas e listar mensagens.
3. **Serializers**: Formatar o JSON que vai para o Frontend (usando a gem `jbuilder` ou `blueprinter`).

---

### Notas de Mentoria:
Sempre que você olhar para este arquivo, lembre-se: o Rails é sobre **convenção**. Se você seguir o padrão de nomes (modelos no singular, tabelas no plural), ele fará 80% do trabalho chato por você!
