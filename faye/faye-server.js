// faye-server.js
import http from 'http';
import faye from 'faye';

const server = http.createServer();
const bayeux = new faye.NodeAdapter({ mount: '/faye', timeout: 45 });

bayeux.attach(server);
server.listen(8000, () => {
  console.log('Faye server rodando em http://localhost:8000/faye');
});
