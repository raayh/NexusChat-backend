# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

puts "🧹 Limpando dados antigos..."
Message.destroy_all
Membership.destroy_all
Room.destroy_all
User.destroy_all

puts "\n👤 Criando usuários..."

alice = User.find_or_create_by!(email: "alice@exemplo.com") do |user|
    user.password = '123456'
end

bob = User.find_or_create_by!(email: 'bob@exemplo.com') do |user|
    user.password = '234567'
end

carlos = User.find_or_create_by!(email: 'carlos@exemplo.com') do |user|
    user.password = '345678'
end

puts "✅ #{User.count} usuários criados!"

puts "\n🏠 Criando salas..."

geral = Room.find_or_create_by!(name: "Geral") do |room|
    room.is_private = false
end

devs = Room.find_or_create_by!(name: 'Devs') do |room|
    room.is_private = false
end

sala_vip = Room.find_or_create_by!(name: 'Sala Vip') do |room|
    room.is_private = true
end

puts "✅ #{Room.count} salas criados!"

puts "\n🔗 Conectando usuários ás salas..."

memberships = [
    {user: alice, room: geral},
    {user: alice, room: devs},
    {user: alice, room: sala_vip},
    {user: bob, room: geral},
    {user: bob, room: devs},
    {user: carlos, room: geral},
    {user: carlos, room: sala_vip},
    {user: carlos, room: devs}
]

memberships.each do |membership_data|
    Membership.find_or_create_by!(
        user: membership_data[:user],
        room: membership_data[:room]
    )
end

puts "✅ #{Membership.count} conexões criadas!"

puts "\n💬 Criando mensagens..."

messages_data = [
    { content: 'Olá, pessoal!', user: alice, room: geral },
    { content: 'Oi, Alice! Como vai?', user: bob, room: geral },
    { content: 'Tudo bem! E você?', user: alice, room: geral },
    { content: 'Vamos começar o projeto?', user: bob, room: devs },
    { content: 'Sim! Já comecei o backend', user: alice, room: devs },
    { content: 'Reunião VIP às 15h', user: bob, room: sala_vip }
]

messages_data.each do |msg_data|
    Message.create!(
        content: msg_data[:content],
        user: msg_data[:user],
        room: msg_data[:room]
    )
end

puts "✅ #{Message.count} mensagens criadas!"

puts "\n🎉 Concluído com sucesso!"
puts "📊 Resumo:"
puts "   - #{User.count} usuários"
puts "   - #{Room.count} salas"
puts "   - #{Membership.count} memberships"
puts "   - #{Message.count} mensagens"