let spamKeywords = [];
let blockedUsers = new Set();
let spamPatterns = []; // Array para armazenar expressões regulares de spam

// Carregar configurações do armazenamento local
chrome.storage.local.get(['spamKeywords', 'blockedUsers', 'spamPatterns'], (data) => {
  if (data.spamKeywords) {
    spamKeywords = data.spamKeywords;
  }
  if (data.blockedUsers) {
    blockedUsers = new Set(data.blockedUsers);
  }
  if (data.spamPatterns) {
    spamPatterns = data.spamPatterns.map(pattern => new RegExp(pattern, 'i')); // 'i' para case-insensitive
  }
});

// Função para salvar as configurações
function saveSettings() {
  chrome.storage.local.set({
    'spamKeywords': spamKeywords,
    'blockedUsers': Array.from(blockedUsers),
    'spamPatterns': spamPatterns.map(regex => regex.source) // Salvar a string do regex
  });
}

// Ouvir mensagens do script de conteúdo
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'detectSpam') {
    const { author, content, postId } = request.data; // Assumindo que o ID do post é enviado
    if (isSpam(content)) {
      console.log(`Spam suspeito detectado: Post ID - ${postId}, Autor - ${author}`);
      suspectedPosts.push({ postElement: /* Elemento DOM será adicionado no content.js */ null, postId: postId });
      chrome.runtime.sendMessage({ action: 'spamDetected', data: { author, content, postId } });
      // Decidir se bloqueia automaticamente ou apenas marca para revisão no pop-up
      // Por enquanto, vamos apenas registrar e alertar no pop-up
    }
  } else if (request.action === 'getBlockedUsers') {
    sendResponse(Array.from(blockedUsers));
  } else if (request.action === 'addBlockedUser') {
    blockedUsers.add(request.userId);
    saveSettings();
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'blockUser', userId: request.userId });
    });
  } else if (request.action === 'removeBlockedUser') {
    blockedUsers.delete(request.userId);
    saveSettings();
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'unblockUser', userId: request.userId });
    });
  } else if (request.action === 'updateKeywords') {
    spamKeywords = request.keywords;
    saveSettings();
    console.log('Palavras-chave de spam atualizadas:', spamKeywords);
  } else if (request.action === 'updatePatterns') {
    spamPatterns = request.patterns.map(pattern => new RegExp(pattern, 'i'));
    saveSettings();
    console.log('Padrões de spam atualizados:', spamPatterns);
  }
});

function isSpam(text) {
  const lowerCaseText = text.toLowerCase();
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

let suspectedPosts = [];
