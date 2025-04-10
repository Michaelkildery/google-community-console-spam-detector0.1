const spamKeywordsInput = document.getElementById('spamKeywords');
const saveKeywordsButton = document.getElementById('saveKeywords');
const spamPatternsInput = document.getElementById('spamPatterns');
const savePatternsButton = document.getElementById('savePatterns');
const markObsoleteButton = document.getElementById('markObsoleteButton');
const blockedUsersList = document.getElementById('blockedUsersList');

// Carregar palavras-chave salvas
chrome.storage.local.get('spamKeywords', (data) => {
  if (data.spamKeywords) {
    spamKeywordsInput.value = data.spamKeywords.join('\n');
  }
});

// Salvar palavras-chave
saveKeywordsButton.addEventListener('click', () => {
  const keywords = spamKeywordsInput.value.split('\n').map(k => k.trim()).filter(k => k !== '');
  chrome.runtime.sendMessage({ action: 'updateKeywords', keywords: keywords });
});

// Carregar padrões de spam salvos
chrome.storage.local.get('spamPatterns', (data) => {
  if (data.spamPatterns) {
    spamPatternsInput.value = data.spamPatterns.join('\n');
  }
});

// Salvar padrões de spam
savePatternsButton.addEventListener('click', () => {
  const patterns = spamPatternsInput.value.split('\n').map(p => p.trim()).filter(p => p !== '');
  chrome.runtime.sendMessage({ action: 'updatePatterns', patterns: patterns });
});

markObsoleteButton.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'markSuspectedAsObsolete' });
  });
});

// Carregar e exibir usuários bloqueados
function loadBlockedUsers() {
  blockedUsersList.innerHTML = '';
  chrome.runtime.sendMessage({ action: 'getBlockedUsers' }, (blockedUsers) => {
    blockedUsers.forEach(userId => {
      const listItem = document.createElement('li');
      listItem.textContent = userId;
      const unblockButton = document.createElement('button');
      unblockButton.textContent = 'Desbloquear';
      unblockButton.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'removeBlockedUser', userId: userId });
        loadBlockedUsers(); // Recarregar a lista após desbloquear
      });
      listItem.appendChild(unblockButton);
      blockedUsersList.appendChild(listItem);
    });
  });
}

loadBlockedUsers();

// Ouvir mensagens de spam detectado (opcional)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'spamDetected') {
    console.log('Spam detectado no pop-up:', request.data);
    // Você pode exibir uma notificação visual no pop-up aqui
  }
});
