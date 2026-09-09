import './style.css'

type Choice = { label: string; value: string }
type Question = {
  id: string
  label: string
  prompt: string
  kind: 'choice' | 'text'
  choices?: Choice[]
  placeholder?: string
  hint: string
  answer: string
}

type Problem = {
  id: string
  title: string
  difficulty: string
  tags: string[]
  url: string
  summary: string
  questions: Question[]
}

type StoredProgress = Record<string, { answers: Record<string, string>; completedAt?: string; reviewAt?: string }>

const problems: Problem[] = [
  {
    id: 'abc474-a', title: 'A · Not X', difficulty: '100点', tags: ['条件分岐', '全探索'],
    url: 'https://atcoder.jp/contests/abc474/tasks/abc474_a',
    summary: '1〜3のうち、X と異なる数をひとつ出力する。複数の正解がある問題。',
    questions: [
      { id: 'strategy', label: '方針', prompt: 'いちばん素直な方針は？', kind: 'choice', choices: [{ label: '1〜3を順に調べ、X と違う最初の数を選ぶ', value: 'scan' }, { label: 'X をソートする', value: 'sort' }, { label: '再帰で全パターンを作る', value: 'dfs' }], hint: '候補はたった3個。条件を満たす候補を一つ見つければ十分です。', answer: 'scan' },
      { id: 'condition', label: '更新条件', prompt: '候補 n を出力してよい条件を一文で書こう。', kind: 'text', placeholder: 'n が X と…', hint: '問題文の「X と異なる」を、そのまま条件にします。', answer: 'n !== x' },
      { id: 'complexity', label: '計算量', prompt: '候補を最大3個見るときの計算量は？', kind: 'choice', choices: [{ label: 'O(1)', value: 'O(1)' }, { label: 'O(N)', value: 'O(N)' }, { label: 'O(log N)', value: 'O(log N)' }], hint: '入力サイズによらず、見る回数には上限があります。', answer: 'O(1)' },
    ],
  },
  {
    id: 'abc474-b', title: 'B · Exit Order', difficulty: '200点', tags: ['シミュレーション', '不変条件'],
    url: 'https://atcoder.jp/contests/abc474/tasks/abc474_b',
    summary: '退場順 P が、座席番号10人ごとのグループ順を守っているか判定する。グループ内の順番は自由。',
    questions: [
      { id: 'unit', label: '見る単位', prompt: '退場順を何人ずつのまとまりで確認する？', kind: 'choice', choices: [{ label: '10人ずつ', value: '10' }, { label: '座席番号が連続するまで', value: 'run' }, { label: 'N人すべてを一括で', value: 'all' }], hint: 'ルールが保証している「自由に並べ替えられる範囲」はどこでしょう？', answer: '10' },
      { id: 'invariant', label: '不変条件', prompt: 'k番目（0始まり）の10人のブロックに入る座席番号の範囲を、言葉で書こう。', kind: 'text', placeholder: '10k+1 から …', hint: '最初のブロックは1〜10、次は11〜20です。最後は短くても構いません。', answer: '10k+1' },
      { id: 'check', label: '判定', prompt: '各ブロック内で確認すべきことは？', kind: 'choice', choices: [{ label: '全員がそのブロックの座席番号範囲に入る', value: 'range' }, { label: '座席番号が昇順である', value: 'sorted' }, { label: '全員が同じ座席番号である', value: 'same' }], hint: '同じグループ内の退場順は自由です。', answer: 'range' },
      { id: 'complexity', label: '計算量', prompt: 'P を先頭から一度確認する計算量は？', kind: 'choice', choices: [{ label: 'O(N)', value: 'O(N)' }, { label: 'O(N²)', value: 'O(N²)' }, { label: 'O(log N)', value: 'O(log N)' }], hint: '各人を何回見るかに注目。', answer: 'O(N)' },
    ],
  },
  {
    id: 'abc474-c', title: 'C · Remove and Append', difficulty: '300点', tags: ['順列', '順序', '制約から考える'],
    url: 'https://atcoder.jp/contests/abc474/tasks/abc474_c',
    summary: '値 a を配列から取り除いて末尾に移す操作を Q 回行う。N,Q は最大 2×10⁵。',
    questions: [
      { id: 'warning', label: '制約チェック', prompt: '配列から毎回検索・削除すると、最悪どの計算量になる？', kind: 'choice', choices: [{ label: 'O(NQ)', value: 'O(NQ)' }, { label: 'O(N+Q)', value: 'O(N+Q)' }, { label: 'O(log N)', value: 'O(log N)' }], hint: '1回の検索と削除に O(N) かかると考えます。', answer: 'O(NQ)' },
      { id: 'observation', label: '着眼点', prompt: '同じ値が複数回指定されたとき、最終的な末尾側の順序に効くのはどの指定？', kind: 'choice', choices: [{ label: '最後に現れた指定', value: 'last' }, { label: '最初に現れた指定', value: 'first' }, { label: 'すべて同じ強さで効く', value: 'all' }], hint: '末尾へ移動した後、もう一度移動すれば、さらに後ろへ行きます。', answer: 'last' },
      { id: 'construction', label: '構成', prompt: '最終列を作るとき、操作で一度も指定されなかった値はどこに残る？', kind: 'choice', choices: [{ label: '元の相対順を保って前方に残る', value: 'front' }, { label: '必ず逆順になる', value: 'reverse' }, { label: 'すべて消える', value: 'gone' }], hint: '一度も取り除かれなければ、他の要素が抜けても互いの順番は変わりません。', answer: 'front' },
      { id: 'complexity', label: '目標計算量', prompt: 'N,Q ≤ 2×10⁵ で狙う計算量は？', kind: 'choice', choices: [{ label: 'O(N + Q)', value: 'O(N+Q)' }, { label: 'O(NQ)', value: 'O(NQ)' }, { label: 'O(2^N)', value: 'O(2^N)' }], hint: '入力を数回なめる程度に抑えたいです。', answer: 'O(N+Q)' },
    ],
  },
]

const storageKey = 'atcoder-fill-dojo-progress-v1'
const load = (): StoredProgress => JSON.parse(localStorage.getItem(storageKey) ?? '{}') as StoredProgress
const save = (data: StoredProgress) => localStorage.setItem(storageKey, JSON.stringify(data))
let progress = load()
let current = 0
let revealed = false

const day = (date: Date) => date.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })
const escape = (text: string) => text.replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char] ?? char))

function isCorrect(question: Question, value: string) {
  if (question.kind === 'choice') return value === question.answer
  const normalized = value.toLowerCase().replace(/ /g, '')
  return question.id === 'condition' ? normalized.includes('!==') || normalized.includes('!=') || normalized.includes('異なる') : normalized.includes(question.answer.toLowerCase().replace(/ /g, ''))
}

function render() {
  const problem = problems[current]
  const record = progress[problem.id] ?? { answers: {} }
  const totalDone = Object.values(progress).filter(item => item.completedAt).length
  const answerCount = Object.values(record.answers).filter(Boolean).length
  const correctCount = problem.questions.filter(question => isCorrect(question, record.answers[question.id] ?? '')).length
  const app = document.querySelector<HTMLDivElement>('#app')!
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
            ${revealed ? `<div class="feedback ${result}">${value ? (result === 'good' ? '✓ この考え方で進められます。' : `模範のキーワード：<b>${question.answer}</b>`) : `模範のキーワード：<b>${question.answer}</b>`}</div>` : ''}
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
  document.querySelector<HTMLButtonElement>('#reveal')!.addEventListener('click', () => { revealed = !revealed; render() })
  document.querySelector<HTMLButtonElement>('#complete')!.addEventListener('click', complete)
}

function updateAnswer(questionId: string, value: string, rerender = true) {
  const problem = problems[current]
  progress[problem.id] ??= { answers: {} }
  progress[problem.id].answers[questionId] = value
  save(progress)
  if (rerender) render()
}

function complete() {
  const problem = problems[current]
  progress[problem.id] ??= { answers: {} }
  const now = new Date()
  const review = new Date(now)
  review.setDate(review.getDate() + 3)
  progress[problem.id].completedAt = now.toISOString()
  progress[problem.id].reviewAt = review.toISOString()
  save(progress)
  revealed = true
  render()
}

render()
