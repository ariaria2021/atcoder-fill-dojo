import { describe, expect, it } from 'vitest'
import { feedbackFor, isCorrect, loadProgress, problems, saveProgress, storageKey } from './quiz'

const problemA = problems[0]
const strategy = problemA.questions[0]
const condition = problemA.questions[1]
const complexity = problemA.questions[2]

describe('採点ロジック', () => {
  it('選択式の正解・不正解・未回答を判定する', () => {
    expect(isCorrect(strategy, 'scan')).toBe(true)
    expect(isCorrect(strategy, 'sort')).toBe(false)
    expect(isCorrect(strategy, '')).toBe(false)
  })

  it('条件式はJavaScriptと日本語の表現を許容する', () => {
    expect(isCorrect(condition, 'n !== x')).toBe(true)
    expect(isCorrect(condition, 'n != x')).toBe(true)
    expect(isCorrect(condition, 'n が X と異なる')).toBe(true)
    expect(isCorrect(condition, 'n === x')).toBe(false)
  })
})

describe('答え合わせの解説', () => {
  it('計算量の不正解には答え、理由、公式教材リンクを含める', () => {
    const feedback = feedbackFor(complexity, 'O(N)', 'retry')

    expect(feedback).toContain('答えは <b>O(1)</b> です。')
    expect(feedback).toContain('候補は最大3個で固定です。')
    expect(feedback).toContain('AtCoder公式: 2.06.計算量')
    expect(feedback).toContain('AtCoder公式: EX21 計算量の見積もり')
  })

  it('通常の設問は計算量教材リンクを含めない', () => {
    expect(feedbackFor(strategy, 'sort', 'retry')).not.toContain('AtCoder公式')
  })
})

describe('回答保存', () => {
  it('保存した回答を復元する', () => {
    const storage = new Map<string, string>()
    const memoryStorage = {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => { storage.set(key, value) },
    }

    saveProgress(memoryStorage, { 'abc474-a': { answers: { strategy: 'scan' } } })

    expect(loadProgress(memoryStorage)).toEqual({ 'abc474-a': { answers: { strategy: 'scan' } } })
  })

  it('壊れたlocalStorageは空の進捗として扱う', () => {
    const memoryStorage = {
      getItem: (key: string) => key === storageKey ? '{invalid json' : null,
      setItem: () => undefined,
    }

    expect(loadProgress(memoryStorage)).toEqual({})
  })
})
