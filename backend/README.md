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
> [!NOTE]
> Seção em construção. Modelagem sendo definida para suportar salas privadas e públicas.

---

## 3. Fluxo de Autenticação
Implementado utilizando **Devise Token Auth**. Requer os headers `access-token`, `client`, e `uid` para requisições autenticadas.

---

## 4. Próximas Implementações
- Listagem de salas por usuário.
- Histórico de mensagens paginado.
- Broadcast de status online/offline.
