import { feedbackFor, isCorrect, loadProgress, problems, saveProgress, type ProgressStorage, type StoredProgress } from './quiz'

export type AppOptions = {
  storage?: ProgressStorage
  now?: () => Date
}

const day = (date: Date) => date.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })
const escape = (text: string) => text.replace(/[&<>\"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char] ?? char))

export function mountApp(app: HTMLDivElement, options: AppOptions = {}) {
  const storage = options.storage ?? window.localStorage
  const now = options.now ?? (() => new Date())
  let progress: StoredProgress = loadProgress(storage)
  let current = 0
  let revealed = false

  function updateAnswer(questionId: string, value: string, rerender = true) {
    const problem = problems[current]
    progress[problem.id] ??= { answers: {} }
    progress[problem.id].answers[questionId] = value
    saveProgress(storage, progress)
    if (rerender) render()
  }

  function complete() {
    const problem = problems[current]
    progress[problem.id] ??= { answers: {} }
    const completedAt = now()
    const reviewAt = new Date(completedAt)
    reviewAt.setDate(reviewAt.getDate() + 3)
    progress[problem.id].completedAt = completedAt.toISOString()
    progress[problem.id].reviewAt = reviewAt.toISOString()
    saveProgress(storage, progress)
    revealed = true
    render()
  }

  function render() {
    const problem = problems[current]
    const record = progress[problem.id] ?? { answers: {} }
    const totalDone = Object.values(progress).filter(item => item.completedAt).length
    const answerCount = Object.values(record.answers).filter(Boolean).length
    const correctCount = problem.questions.filter(question => isCorrect(question, record.answers[question.id] ?? '')).length
    app.innerHTML = `
      <header class="topbar">
        <a class="brand" href="#" aria-label="穴埋め道場のホーム">⌘ <span>穴埋め道場</span></a>
        <div class="streak"><span>今日の一問</span><strong>${totalDone}/3</strong></div>
      </header>
      <main>
        <section class="intro">
          <p class="eyebrow">ATCODER · 5 MINUTE DRILL</p>
          <h1>実装の前に、<br><em>解法</em>を言葉にする。</h1>
          <p>標準入出力や提出はPCで。ここでは、スマホでも育てられる「考え方」だけを練習します。</p>
        </section>
        <section class="problem-tabs" aria-label="問題を選択">
          ${problems.map((item, index) => `<button class="tab ${index === current ? 'active' : ''}" data-problem="${index}"><span>${item.title.split(' · ')[0]}</span>${item.difficulty}${progress[item.id]?.completedAt ? '<i>✓</i>' : ''}</button>`).join('')}
        </section>
        <article class="card problem-card">
          <div class="card-heading">
            <div><p class="eyebrow">${problem.difficulty}</p><h2>${problem.title}</h2></div>
            <a class="external" href="${problem.url}" target="_blank" rel="noreferrer">問題文を開く ↗</a>
          </div>
          <p class="summary">${problem.summary}</p>
          <div class="tags">${problem.tags.map(tag => `<span>${tag}</span>`).join('')}</div>
          <div class="progress-line"><span style="width:${(answerCount / problem.questions.length) * 100}%"></span></div>
          <p class="progress-text">${answerCount}/${problem.questions.length} 回答済み ${record.completedAt ? ` · 次の復習 ${day(new Date(record.reviewAt!))}` : ''}</p>
        </article>
        <section class="questions">
          ${problem.questions.map((question, index) => {
            const value = record.answers[question.id] ?? ''
            const result = revealed && value ? (isCorrect(question, value) ? 'good' : 'retry') : ''
            return `<article class="card question ${result}">
              <div class="question-number">${String(index + 1).padStart(2, '0')}</div>
              <div class="question-content"><p class="question-label">${question.label}</p><h3>${question.prompt}</h3>
              ${question.kind === 'choice' ? `<div class="choices">${question.choices!.map(choice => `<button class="choice ${value === choice.value ? 'selected' : ''}" data-question="${question.id}" data-value="${choice.value}">${choice.label}</button>`).join('')}</div>` : `<textarea data-question="${question.id}" placeholder="${question.placeholder}">${escape(value)}</textarea>`}
              <details><summary>ヒントを見る</summary><p>${question.hint}</p></details>
              ${revealed ? `<div class="feedback ${result}">${feedbackFor(question, value, result)}</div>` : ''}
              </div>
            </article>`
          }).join('')}
        </section>
        <section class="action-bar">
          <div><strong>${correctCount}/${problem.questions.length}</strong><span>いまの理解度</span></div>
          <button class="secondary" id="reveal">${revealed ? '答えを隠す' : '答え合わせ'}</button>
          <button class="primary" id="complete" ${answerCount === 0 ? 'disabled' : ''}>今日の練習を記録 →</button>
        </section>
        <p class="footnote">回答はこの端末だけに保存されます。次回の復習は3日後に出ます。</p>
      </main>`

    app.querySelectorAll<HTMLButtonElement>('[data-problem]').forEach(button => button.addEventListener('click', () => { current = Number(button.dataset.problem); revealed = false; render() }))
    app.querySelectorAll<HTMLButtonElement>('.choice').forEach(button => button.addEventListener('click', () => updateAnswer(button.dataset.question!, button.dataset.value!)))
    app.querySelectorAll<HTMLTextAreaElement>('textarea').forEach(area => area.addEventListener('input', () => updateAnswer(area.dataset.question!, area.value, false)))
    app.querySelector<HTMLButtonElement>('#reveal')!.addEventListener('click', () => { revealed = !revealed; render() })
    app.querySelector<HTMLButtonElement>('#complete')!.addEventListener('click', complete)
  }

  render()
  return { render }
}
