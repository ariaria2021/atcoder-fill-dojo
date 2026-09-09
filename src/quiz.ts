export type Choice = { label: string; value: string }
export type LearningLink = { label: string; url: string }
export type AnswerExplanation = { reason: string; principle: string }

export type Question = {
  id: string
  label: string
  prompt: string
  kind: 'choice' | 'text'
  choices?: Choice[]
  placeholder?: string
  hint: string
  answer: string
  explanation?: AnswerExplanation
}

export type Problem = {
  id: string
  title: string
  difficulty: string
  tags: string[]
  url: string
  summary: string
  questions: Question[]
}

export type StoredProgress = Record<string, { answers: Record<string, string>; completedAt?: string; reviewAt?: string }>
export type ProgressStorage = Pick<Storage, 'getItem' | 'setItem'>

export const complexityLinks: LearningLink[] = [
  { label: 'AtCoder公式: 2.06.計算量', url: 'https://atcoder.jp/contests/apg4b/tasks/APG4b_w?lang=ja' },
  { label: 'AtCoder公式: EX21 計算量の見積もり', url: 'https://atcoder.jp/contests/apg4b/tasks/APG4b_cb?lang=ja' },
]

export const problems: Problem[] = [
  {
    id: 'abc474-a', title: 'A · Not X', difficulty: '100点', tags: ['条件分岐', '全探索'],
    url: 'https://atcoder.jp/contests/abc474/tasks/abc474_a',
    summary: '1〜3のうち、X と異なる数をひとつ出力する。複数の正解がある問題。',
    questions: [
      { id: 'strategy', label: '方針', prompt: 'いちばん素直な方針は？', kind: 'choice', choices: [{ label: '1〜3を順に調べ、X と違う最初の数を選ぶ', value: 'scan' }, { label: 'X をソートする', value: 'sort' }, { label: '再帰で全パターンを作る', value: 'dfs' }], hint: '候補はたった3個。条件を満たす候補を一つ見つければ十分です。', answer: 'scan' },
      { id: 'condition', label: '更新条件', prompt: '候補 n を出力してよい条件を一文で書こう。', kind: 'text', placeholder: 'n が X と…', hint: '問題文の「X と異なる」を、そのまま条件にします。', answer: 'n !== x' },
      { id: 'complexity', label: '計算量', prompt: '候補を最大3個見るときの計算量は？', kind: 'choice', choices: [{ label: 'O(1)', value: 'O(1)' }, { label: 'O(N)', value: 'O(N)' }, { label: 'O(log N)', value: 'O(log N)' }], hint: '入力サイズによらず、見る回数には上限があります。', answer: 'O(1)', explanation: { reason: '候補は最大3個で固定です。入力が大きくなっても、見る回数は増えません。', principle: 'O(1) は「1回だけ」ではなく、入力サイズに関係なく処理回数に固定の上限がある、という意味です。' } },
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
      { id: 'complexity', label: '計算量', prompt: 'P を先頭から一度確認する計算量は？', kind: 'choice', choices: [{ label: 'O(N)', value: 'O(N)' }, { label: 'O(N²)', value: 'O(N²)' }, { label: 'O(log N)', value: 'O(log N)' }], hint: '各人を何回見るかに注目。', answer: 'O(N)', explanation: { reason: '退場順 P の N 人を、先頭から一度ずつ確認します。N が増えると確認回数も比例して増えます。', principle: '全要素を一度ずつ見る処理は O(N) です。二重ループのように、N 回の処理をさらに N 回繰り返すと O(N²) になります。' } },
    ],
  },
  {
    id: 'abc474-c', title: 'C · Remove and Append', difficulty: '300点', tags: ['順列', '順序', '制約から考える'],
    url: 'https://atcoder.jp/contests/abc474/tasks/abc474_c',
    summary: '値 a を配列から取り除いて末尾に移す操作を Q 回行う。N,Q は最大 2×10⁵。',
    questions: [
      { id: 'warning', label: '制約チェック', prompt: '配列から毎回検索・削除すると、最悪どの計算量になる？', kind: 'choice', choices: [{ label: 'O(NQ)', value: 'O(NQ)' }, { label: 'O(N+Q)', value: 'O(N+Q)' }, { label: 'O(log N)', value: 'O(log N)' }], hint: '1回の検索と削除に O(N) かかると考えます。', answer: 'O(NQ)', explanation: { reason: '1回の操作で配列を最大 N 個探して削除し、それを Q 回繰り返します。つまり O(N) × Q 回で O(NQ) です。', principle: '「内側の処理回数 × 外側の繰り返し回数」で考えると、愚直な実装が間に合うか判断できます。' } },
      { id: 'observation', label: '着眼点', prompt: '同じ値が複数回指定されたとき、最終的な末尾側の順序に効くのはどの指定？', kind: 'choice', choices: [{ label: '最後に現れた指定', value: 'last' }, { label: '最初に現れた指定', value: 'first' }, { label: 'すべて同じ強さで効く', value: 'all' }], hint: '末尾へ移動した後、もう一度移動すれば、さらに後ろへ行きます。', answer: 'last' },
      { id: 'construction', label: '構成', prompt: '最終列を作るとき、操作で一度も指定されなかった値はどこに残る？', kind: 'choice', choices: [{ label: '元の相対順を保って前方に残る', value: 'front' }, { label: '必ず逆順になる', value: 'reverse' }, { label: 'すべて消える', value: 'gone' }], hint: '一度も取り除かれなければ、他の要素が抜けても互いの順番は変わりません。', answer: 'front' },
      { id: 'complexity', label: '目標計算量', prompt: 'N,Q ≤ 2×10⁵ で狙う計算量は？', kind: 'choice', choices: [{ label: 'O(N + Q)', value: 'O(N+Q)' }, { label: 'O(NQ)', value: 'O(NQ)' }, { label: 'O(2^N)', value: 'O(2^N)' }], hint: '入力を数回なめる程度に抑えたいです。', answer: 'O(N+Q)', explanation: { reason: 'N と Q がどちらも最大 2×10⁵ なので、入力を数回なめる O(N+Q) を目指します。O(NQ) では最大約4×10¹⁰回になり、間に合いません。', principle: '制約が大きいときは、入力の大きさに比例する O(N) や O(N+Q) をまず目標にします。' } },
    ],
  },
]

export const storageKey = 'atcoder-fill-dojo-progress-v1'

export function loadProgress(storage: ProgressStorage): StoredProgress {
  try {
    const stored = JSON.parse(storage.getItem(storageKey) ?? '{}') as unknown
    return stored !== null && typeof stored === 'object' && !Array.isArray(stored) ? stored as StoredProgress : {}
  } catch {
    return {}
  }
}

export function saveProgress(storage: ProgressStorage, progress: StoredProgress) {
  storage.setItem(storageKey, JSON.stringify(progress))
}

export function isCorrect(question: Question, value: string) {
  if (question.kind === 'choice') return value === question.answer
  const normalized = value.toLowerCase().replace(/\s/g, '')
  return question.id === 'condition'
    ? normalized.includes('!==') || normalized.includes('!=') || normalized.includes('異なる')
    : normalized.includes(question.answer.toLowerCase().replace(/\s/g, ''))
}

export function feedbackFor(question: Question, value: string, result: string) {
  const verdict = value
    ? (result === 'good' ? '✓ この考え方で進められます。' : `答えは <b>${question.answer}</b> です。`)
    : `答えは <b>${question.answer}</b> です。`

  if (!question.explanation) return verdict

  return `${verdict}
    <div class="answer-explanation">
      <p><b>この問題では</b> ${question.explanation.reason}</p>
      <p><b>覚えておくこと</b> ${question.explanation.principle}</p>
      <div class="learning-links">
        <span>もっと学ぶ（C++教材ですが考え方はTypeScriptでも共通）</span>
        ${complexityLinks.map(link => `<a href="${link.url}" target="_blank" rel="noreferrer">${link.label} ↗</a>`).join('')}
      </div>
    </div>`
}
