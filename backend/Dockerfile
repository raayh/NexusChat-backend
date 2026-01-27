FROM ruby:2.7.6

# Atualiza pacotes base e instala dependências
RUN apt-get update -qq && apt-get install -y nodejs yarn build-essential libpq-dev

WORKDIR /app

# Instala versões compatíveis dos gems
RUN gem install bundler -v 2.4.22
RUN gem install zeitwerk -v 2.6.18
RUN gem install nokogiri -v 1.15.7 --platform=ruby
RUN gem install net-protocol -v 0.2.2
RUN gem install net-imap -v 0.4.22

# Instala Rails
RUN gem install rails -v 7.0.3

# Cria o usuário padrão
# RUN adduser --disabled-password --gecos '' note-rayssa && \
#     chown -R note-rayssa:note-rayssa /usr/local/bundle /app

# USER note-rayssa

RUN useradd -ms /bin/bash nexus && \
    chown -R nexus:nexus /usr/local/bundle /app

    # chown -R note-rayssa:note-rayssa /usr/local/bundle /app

USER nexus

WORKDIR /app

EXPOSE 3000

# CMD ["bash", "-c", "rm -f tmp/pids/server.pid && rails s -b 0.0.0.0"]
CMD ["bash"]
