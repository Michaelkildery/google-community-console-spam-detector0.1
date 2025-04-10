let suspectedPosts = []; // Array para armazenar informações de posts suspeitos COM o elemento DOM

function detectPosts() {
  const posts = document.querySelectorAll('.js-thread-entry'); // Ajuste este seletor para identificar cada postagem individualmente
  posts.forEach(post => {
    const authorElement = post.querySelector('.user-name a');
    const contentElement = post.querySelector('.post-body');
    const postIdElement = post.querySelector('[data-post-id]');
    const postHeaderActionsButton = post.querySelector('body > ec-app > ec-shell > div > div > main > ec-thread > div > div > div:nth-child(2) > sc-tailwind-thread-thread > sc-tailwind-thread-thread-content > div > div > article > sc-tailwind-thread-question-question-card > sc-shared-material-card > div > div.scTailwindThreadQuestionQuestioncardcontent > sc-tailwind-thread-post-header > div > div.scTailwindThreadPostheaderrow-end > sc-tailwind-thread-post_header-question-overflow-menu > sc-tailwind-thread-post_header-overflow-menu > div > div > sc-shared-material-button > div > button');

    if (authorElement && contentElement && postIdElement && postHeaderActionsButton) {
      const author = authorElement.textContent.trim();
      const content = contentElement.textContent.trim();
      const postId = postIdElement.getAttribute('data-post-id');
      if (isSpam(content)) { // Assumindo que a função isSpam está definida no background
        console.log(`Spam suspeito detectado: Post ID - ${postId}, Autor - ${author}`);
        suspectedPosts.push({ postElement: post, postId: postId }); // Armazenar o elemento do post
        chrome.runtime.sendMessage({ action: 'spamDetected', data: { author, content, postId } });
      }
    }
  });
}

async function markAsObsolete(postElement) {
  try {
    // Seletor para o botão de menu de ações
    const headerActionsButtonSelector = 'body > ec-app > ec-shell > div > div > main > ec-thread > div > div > div:nth-child(2) > sc-tailwind-thread-thread > sc-tailwind-thread-thread-content > div > div > article > sc-tailwind-thread-question-question-card > sc-shared-material-card > div > div.scTailwindThreadQuestionQuestioncardcontent > sc-tailwind-thread-post-header > div > div.scTailwindThreadPostheaderrow-end > sc-tailwind-thread-post_header-question-overflow-menu > sc-tailwind-thread-post_header-overflow-menu > div > div > sc-shared-material-button > div > button';
    const headerActionsButton = postElement.querySelector(headerActionsButtonSelector);

    if (headerActionsButton) {
      headerActionsButton.click();
      await new Promise(resolve => setTimeout(resolve, 500)); // Esperar o menu abrir

      // Seletor para o botão "Marcar como obsoleta"
      const obsoleteButtonSelector = 'body > ec-app > ec-shell > div > div > main > ec-thread > div > div > div:nth-child(2) > sc-tailwind-thread-thread > sc-tailwind-thread-thread-content > div > div > article > sc-tailwind-thread-question-question-card > sc-shared-material-card > div > div.scTailwindThreadQuestionQuestioncardcontent > sc-tailwind-thread-post-header > div > div.scTailwindThreadPostheaderrow-end > sc-tailwind-thread-post_header-question-overflow-menu > sc-tailwind-thread-post_header-overflow-menu > div > sc-shared-material-menu > sc-shared-material-popup > div > div > div > div:nth-child(7) > button';
      const obsoleteButton = document.querySelector(obsoleteButtonSelector);

      if (obsoleteButton) {
        obsoleteButton.click();
        console.log(`Post marcado como obsoleto.`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar um pouco após a ação

        // Lógica para lidar com confirmação (se necessário - inspecione o site!)
        // Exemplo hipotético:
        // const confirmButton = document.querySelector('...');
        // if (confirmButton) {
        //   confirmButton.click();
        //   console.log("Confirmação de obsoletar clicada.");
        //   await new Promise(resolve => setTimeout(resolve, 500));
        // }

      } else {
        console.warn("Botão 'Marcar como obsoleta' não encontrado.");
      }
    } else {
      console.warn("Botão de ações do post não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao marcar post como obsoleto:", error);
  }
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'markSuspectedAsObsolete') {
    console.log("Iniciando o processo de marcar posts suspeitos como obsoletos...");
    const postsToMark = suspectedPosts.slice(); // Criar uma cópia para evitar problemas assíncronos
    suspectedPosts = []; // Limpar a lista imediatamente para evitar duplicatas

    for (const postInfo of postsToMark) {
      await markAsObsolete(postInfo.postElement);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Aumentar o tempo de espera para estabilidade
    }
    console.log("Processo de marcar posts como obsoletos concluído.");
  }
});

function isSpam(text) {
  const lowerCaseText = text.toLowerCase();
  const spamKeywords = []; // Carregar do storage
  const spamPatterns = []; // Carregar do storage

  chrome.storage.local.get(['spamKeywords', 'spamPatterns'], (data) => {
    if (data.spamKeywords) {
      spamKeywords.push(...data.spamKeywords);
    }
    if (data.spamPatterns) {
      spamPatterns.push(...data.spamPatterns.map(pattern => new RegExp(pattern, 'i')));
    }
  });

  // Verificar palavras-chave
  if (spamKeywords.some(keyword => lowerCaseText.includes(keyword.toLowerCase()))) {
    return true;
  }
  // Verificar padrões (regex)
  if (spamPatterns.some(pattern => pattern.test(text))) {
    return true;
  }
  return false;
}

const observer = new MutationObserver(detectPosts);
const targetNode = document.body;
const observerConfig = { childList: true, subtree: true };

detectPosts();
observer.observe(targetNode, observerConfig);
