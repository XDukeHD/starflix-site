Esse aqui será o futuro site de filmes chamado StarFlix, e sim, ele será código aberto. o front-end no caso esse site será sim totalmente código aberto e está aberto para contribuições, no entando todo o back-end do site como (API, CDN, SRT-CDN, Proxy, etc) não serão código aberto, isso por motivos óbvios, como ressaltado no termo de serviço do site, a starflix NÃO HOSPEDA ARQUIVOS DE VÍDEO EM SEUS SERVIDORES, não hospedamos nenhum arquivo protegido por direitos autorais, e não hospedamos nenhum arquivo que seja ilegal ou infrinja os direitos de terceiros, o site é apenas um agregador de conteúdo, ou seja, ele apenas agrega links de filmes e séries disponíveis na internet, apartir disso, fazemos o streaming desses arquivos e ofuscamos os links reais, os unicos arquivos que hospedamos são arquivos de legenda srt para ultilizar nos conteúdos do site, e esses arquivos são hospedados em um servidor público.

Dito tudo isso, esse site é totalmente código aberto, e está aberto para contribuições, então se você tem alguma sugestão ou quer contribuir com o projeto, fique a vontade para abrir uma issue ou um pull request, e se você quiser contribuir com o projeto, mas não sabe como, fique a vontade para entrar em contato comigo, eu estou sempre disposto a ajudar, também é permitido ultilizar o código do projeto para criar seu próprio site de filmes, contanto, nesse caso fica proibido ultilizar o nome StarFlix e sua api, também não dou suporte para modificações do código para criar um site de filmes. 

# StarFlix

Para usar o projeto, basta clonar o repositório e instalar as dependências, para isso, basta rodar os seguintes comandos:

```bash
git clone https://github.com/XDukeHD/starflix-site.git
cd starflix-site
bun install # ou npm install ou yarn install
```

Depois disso, basta rodar o comando para iniciar o projeto:

```bash
bun dev # ou npm run dev ou yarn dev
```

Para buildar o projeto, basta rodar o comando:

```bash
bun build # ou npm run build ou yarn build
```
E para rodar o projeto em produção, basta rodar o comando:

```bash 
bun start # ou npm start ou yarn start
```

