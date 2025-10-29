Lead‑Desafio
🧾 Visão geral

Este repositório contém a implementação concluída do desafio para a empresa DTI Digital. 
GitHub

O projeto engloba uma API em C# (provavelmente ASP.NET Core) e uma parte front‑end em JavaScript/HTML/CSS, para gerenciar “leads” (potenciais clientes) ou “leads manager”.

🚀 Tecnologias utilizadas

Back‑end: C# / ASP.NET Core (arquivo LeadManagerAPI.csproj)

Front‑end: JavaScript, HTML, CSS

Banco de dados: arquivo leadmanager.db sugere uso de SQLite ou similar

Configuração: arquivos appsettings.json, appsettings.Development.json

API testing: LeadManagerAPI.http (provavelmente via HTTP client ou VSCode REST Client)

Estrutura de pastas: LeadManagerAPI/, Properties/, wwwroot/ 
GitHub

📁 Estrutura do projeto
Lead‑Desafio/
│
├─ LeadManagerAPI/
│   ├─ LeadManagerAPI.csproj
│   ├─ appsettings.json
│   ├─ appsettings.Development.json
│   ├─ LeadManagerAPI.http
│   └─ … outros arquivos de API
│
├─ Properties/
│   └─ … configuração de projeto
│
├─ wwwroot/
│   └─ … arquivos estáticos para front‑end
│
├─ leadmanager.db
├─ .gitignore
└─ … outros arquivos

🛠 Como rodar localmente

Clone o repositório:

git clone https://github.com/maneloliv/Lead‑Desafio.git


No diretório LeadManagerAPI/, restaure os pacotes e compile a API (assumindo uso de dotnet CLI):

cd LeadManagerAPI
dotnet restore
dotnet build


Configure o banco de dados ou assegure que leadmanager.db está acessível.

Execute a API:

dotnet run


A API estará disponível em http://localhost:<porta> (ver no appsettings.json ou saída do terminal).

Abra o front‑end: acesse wwwroot/index.html via browser ou configure para servir via a API.

✅ Funcionalidades principais

Gerenciamento de leads — criação, leitura, atualização, deleção (CRUD)

Interface web simples para interação com a API

Banco de dados local

Configurações diferenciadas para ambiente de desenvolvimento

🤝 Como contribuir

Se você quiser ajudar a melhorar este projeto:

Fork este repositório.

Crie uma nova branch: git checkout ‑b feature/minha‑nova‑funcionalidade.

Faça suas modificações.

Submeta um pull request com descrição clara da funcionalidade ou correção.

Certifique‑se de que está funcionando em ambiente local e que não quebra funcionalidades existentes.

📋 Licença

Este projeto usa a licença MIT (ou especifique outra que for aplicável). Se nenhuma estiver definida, você pode adicionar um arquivo LICENSE com os termos.

📝 Notas finais

Este desafio foi concluído para a empresa DTI, conforme indicado no repositório. 
GitHub

Se houver instruções específicas adicionais (ex: variáveis de ambiente, dependências extras, deploy em produção), adicione‑as nesta seção.
