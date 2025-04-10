# Community Guardian - Extensão para Google Community Console

**Descrição:**

O Community Guardian é uma extensão para o Google Chrome desenvolvida para auxiliar moderadores do Google Community Console na detecção e tratamento de spans. A extensão permite definir palavras-chave e padrões (regex) para identificar conteúdo suspeito e oferece a funcionalidade de marcar posts identificados como spam como obsoletos de forma rápida.

**Funcionalidades:**

* **Detecção de Spam:**
    * Permite configurar uma lista de palavras-chave que, se encontradas no conteúdo de um post, o marcam como suspeito.
    * Suporte para a definição de padrões de spam utilizando expressões regulares (regex) para uma detecção mais avançada.
* **Ações em Massa:**
    * Oferece um botão no pop-up da extensão para iniciar o processo de marcar todos os posts suspeitos detectados na página atual como obsoletos.
* **Gerenciamento de Usuários Bloqueados (Em Desenvolvimento):**
    * Permite visualizar e remover usuários que foram bloqueados pela extensão (a funcionalidade de bloqueio automático ainda está em desenvolvimento e depende da interação com a interface do site).
* **Interface de Configuração:**
    * Um pop-up intuitivo para gerenciar as palavras-chave de spam e os padrões regex.

**Como Instalar (Modo de Desenvolvedor):**

1.  **Baixe o código:**
    * Se você estiver usando o Git, clone o repositório para o seu computador:
        ```bash
        git clone [https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git](https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git)
        ```
        (Substitua `SEU_USUARIO` e `SEU_REPOSITORIO` pelos seus dados do GitHub).
    * Se não estiver usando o Git, vá para a página do repositório no GitHub e clique no botão verde "Code", depois selecione "Download ZIP". Extraia o arquivo ZIP para uma pasta no seu computador.

2.  **Abra a página de extensões do Chrome:**
    * Na barra de endereços do Chrome, digite `chrome://extensions/` e pressione Enter.

3.  **Ative o "Modo de desenvolvedor":**
    * No canto superior direito da página de extensões, clique no interruptor para ativar o "Modo de desenvolvedor".

4.  **Carregue a extensão:**
    * No canto superior esquerdo da página, clique no botão "Carregar sem compactação".
    * Selecione a pasta onde você clonou ou extraiu os arquivos da extensão (`SEU_REPOSITORIO` ou a pasta extraída do ZIP).

5.  **A extensão "Community Guardian" será instalada no seu Chrome.**

**Como Usar:**

1.  **Navegue para o Google Community Console** (qualquer página de discussão).
2.  **Abra o pop-up da extensão:** Clique no ícone do "Community Guardian" na barra de ferramentas do Chrome (geralmente um ícone novo que apareceu após a instalação).
3.  **Configure as palavras-chave e padrões de spam:**
    * Na seção "Palavras-chave de Spam", digite cada palavra-chave em uma linha separada.
    * Na seção "Padrões de Spam (Regex)", digite cada expressão regular em uma linha separada.
    * Clique nos botões "Salvar Palavras-chave" e "Salvar Padrões" para aplicar suas configurações.
4.  **Detecção Automática:** A extensão irá analisar o conteúdo das postagens na página e identificar aquelas que correspondem às suas configurações de spam. (Atualmente, a detecção é feita ao carregar a página e ao novas postagens serem carregadas dinamicamente).
5.  **Marcar Spam como Obsoleto:**
    * Se a extensão detectar posts suspeitos, você pode clicar no botão "Marcar Spam Suspeito como Obsoleto" no pop-up. A extensão tentará simular os cliques necessários para marcar esses posts como obsoletos na interface do Google Community Console.
6.  **Gerenciar Usuários Bloqueados:** A seção "Usuários Bloqueados" exibirá a lista de usuários que foram bloqueados (essa funcionalidade ainda está em desenvolvimento).

**Observações Importantes:**

* **Estrutura do Site:** A funcionalidade de marcar como obsoleto depende da estrutura HTML e CSS do Google Community Console. Qualquer alteração no site pode fazer com que essa funcionalidade pare de funcionar.
* **Seletores CSS:** Os seletores CSS utilizados para interagir com os elementos da página podem precisar ser atualizados no futuro se o site for modificado.
* **Bloqueio de Usuários:** A funcionalidade de bloqueio automático ainda não está totalmente implementada e requer mais investigação sobre a interface do site para realizar essa ação de forma eficiente e confiável.
* **Testes:** Esta extensão está em desenvolvimento e pode conter bugs. Use com cautela e relate quaisquer problemas encontrados.

**Contribuições:**

Contribuições para o projeto são bem-vindas! Se você tiver sugestões de melhorias, correções de bugs ou novas funcionalidades, sinta-se à vontade para abrir um problema (Issue) ou enviar um pull request no GitHub.

**Licença:**

[MIT License]

---
