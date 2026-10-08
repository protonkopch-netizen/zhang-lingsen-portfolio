const questionInput = document.querySelector('#question');
const answerPanel = document.querySelector('#answerPanel');
const suggestions = document.querySelector('#suggestions');
const toast = document.querySelector('#toast');

function normalize(text) {
  return text.toLowerCase().replace(/[\s，。！？、,.!?；;：:]/g, '');
}

function findEntry(query) {
  const normalized = normalize(query);
  let best = null;
  let bestScore = 0;
  for (const entry of window.SOP_KNOWLEDGE) {
    const score = entry.tags.reduce((sum, tag) => {
      const normalizedTag = normalize(tag);
      if (!normalized.includes(normalizedTag)) return sum;
      return sum + (normalizedTag.length === 1 ? 1 : normalizedTag.length);
    }, 0);
    if (score > bestScore) { best = entry; bestScore = score; }
  }
  return bestScore >= 2 ? best : null;
}

function renderAnswer(query) {
  const entry = findEntry(query);
  suggestions.classList.add('hidden');
  answerPanel.classList.remove('hidden');
  if (!entry) {
    answerPanel.innerHTML = `<div class="answer-top"><div><div class="answer-kicker">需要补充依据</div><h2>当前资料没有可靠答案</h2></div><span class="answer-status">已保护</span></div><p class="answer-query">你的问题：${escapeHtml(query)}</p><div class="refusal">我没有在当前设备的模拟资料中找到足够依据，因此不会推测操作步骤。请补充设备型号、报警代码或现象；涉及安全、参数调整或拆机时，请停止操作并联系班组长/授权维修人员。</div><div class="answer-actions"><button data-feedback="没帮助">反馈未解决</button><button id="backToExamples">查看常见问题</button><span class="feedback-message"></span></div>`;
  } else {
    const safe = entry.id === 'SOP-LB-021';
    answerPanel.innerHTML = `<div class="answer-top"><div><div class="answer-kicker">${safe ? '安全异常处置' : '已找到相关作业依据'}</div><h2>${entry.title}</h2></div><span class="answer-status">${safe ? '安全优先' : '资料匹配'}</span></div><p class="answer-query">你的问题：${escapeHtml(query)}　·　设备：${entry.device}</p><div class="safety-note">${entry.safety}</div><ol class="steps">${entry.answer.map((step, i) => `<li><span>${String(i + 1).padStart(2, '0')}</span><div>${step}</div></li>`).join('')}</ol><div class="source-card"><span class="source-doc">▤</span><div><b>${entry.title}</b><small>${entry.id}　·　${entry.section}　·　${entry.version}</small></div><span class="source-tag">模拟资料</span></div><div class="answer-actions"><button data-feedback="有帮助">👍 有帮助</button><button data-feedback="没帮助">👎 没帮助</button><button id="backToExamples">返回常见问题</button><span class="feedback-message"></span></div>`;
  }
  answerPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1900);
}

document.querySelector('#askButton').addEventListener('click', () => {
  const query = questionInput.value.trim();
  if (!query) { questionInput.focus(); showToast('先描述一个现场问题'); return; }
  renderAnswer(query);
});

questionInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') document.querySelector('#askButton').click();
});

document.querySelectorAll('.suggestion').forEach((button) => button.addEventListener('click', () => {
  questionInput.value = button.dataset.question;
  renderAnswer(button.dataset.question);
}));

answerPanel.addEventListener('click', (event) => {
  const feedback = event.target.closest('[data-feedback]');
  if (feedback) {
    answerPanel.querySelector('.feedback-message').textContent = '已记录演示反馈';
    return;
  }
  if (event.target.id === 'backToExamples') {
    answerPanel.classList.add('hidden');
    suggestions.classList.remove('hidden');
    document.querySelector('#suggestions').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});

document.querySelector('#machineSelect').addEventListener('click', () => showToast('当前 MVP 仅配置自动贴标机演示资料'));
