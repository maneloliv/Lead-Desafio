# Lead‑Desafio

## 🧾 Visão geral  
Este repositório contém a implementação concluída do desafio para a empresa DTI Digital.  
O projeto engloba uma API em C# (ASP.NET Core) e uma parte front‑end em JavaScript/HTML/CSS, para gerenciar leads (potenciais clientes).

## 🚀 Tecnologias utilizadas  
- Back‑end: C# / ASP.NET Core  
- Front‑end: JavaScript, HTML, CSS  
- Banco de dados: SQLite (`leadmanager.db`)  
- Configuração: `appsettings.json`, `appsettings.Development.json`  
- Testes de API: `LeadManagerAPI.http`  
- Estrutura de pastas: `LeadManagerAPI/`, `Properties/`, `wwwroot/`

🛠 Como rodar localmente


## 🛠 Como rodar localmente  

1.Instalar o SDK do .NET 9.0

   Acesse: https://aka.ms/dotnet/download
   
   Baixe e instale o .NET 9.0 SDK.
   
2. Clone o repositório:  
   ```bash
   git clone https://github.com/maneloliv/Lead-Desafio.git
   ```
3. No diretório LeadManagerAPI/, restaure os pacotes e compile a API:
   ```bash
   -cd LeadManagerAPI
   -dotnet restore
   -dotnet build
   ```
4.Certifique-se de que leadmanager.db está acessível.

5.Execute a API:
   ```bash
   -dotnet run
   ou
   dotnet run --urls "http://localhost:5000
   ```
A API estará disponível em http://localhost:<porta> (verifique o terminal ou appsettings.json).
6.Abra o front‑end: acesse wwwroot/index.html via browser ou configure para servir via a API.

✅ Funcionalidades principais

Gerenciamento de leads — criação, leitura, atualização, deleção (CRUD)

Interface web simples para interação com a API

Banco de dados local

Configurações diferenciadas para ambiente de desenvolvimento


📝 Notas finais

Este desafio foi concluído para a empresa DTI, conforme indicado no repositório. 
GitHub

