# Documentação Técnica: Backend (NexusChat)

Bem-vindo à documentação oficial do motor do NexusChat. Este documento detalha a arquitetura, as decisões técnicas e o funcionamento da nossa API.

## 1. Visão Geral da Arquitetura

O backend do NexusChat foi projetado para ser uma **API robusta e escalável**, focada na separação de responsabilidades e na entrega de dados em tempo real.

### Componentes Principais:
- **Framework**: Ruby on Rails 7 (API Mode).
- **Banco de Dados**: PostgreSQL.
- **Real-time Server**: Faye (Node.js/WebSockets).
- **Ambiente**: Docker & Docker Compose.

### Fluxo de Comunicação:
O sistema segue um modelo de arquitetura baseada em eventos (Event-driven):
1. O **Rails** processa a lógica de negócio e persiste os dados.
2. Após salvar eventos relevantes, o Rails publica uma notificação no servidor **Faye**.
3. O **Faye** distribui essa informação instantaneamente para os clientes conectados.

---

## 2. Modelagem de Dados (ERD)

Abaixo está o diagrama de Entidade-Relacionamento que define a estrutura do nosso banco de dados:

![Diagrama de Entidade-Relacionamento do NexusChat](/home/note-rayssa/.gemini/antigravity/brain/5919e7df-eeac-48c2-bc16-84933c68015a/uploaded_image_1769523008846.png)

### Resumo das Relações:
- **User -> Messages (1:N)**: Um usuário pode enviar múltiplas mensagens.
- **Room -> Messages (1:N)**: Uma sala centraliza o histórico de várias mensagens.
- **User <-> Room (N:N via Membership)**: Usuários e Salas possuem uma relação de muitos-para-muitos, permitindo que um usuário participe de vários chats e uma sala tenha múltiplos membros.

---

## 3. Fluxo de Autenticação
Implementado utilizando **Devise Token Auth**. Requer os headers `access-token`, `client`, e `uid` para requisições autenticadas.

---

## 4. Próximas Implementações
- Listagem de salas por usuário.
- Histórico de mensagens paginado.
- Broadcast de status online/offline.
