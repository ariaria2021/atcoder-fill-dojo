import { getByRole, getByText, within } from '@testing-library/dom'
import { afterEach, describe, expect, it } from 'vitest'
import { mountApp } from './app'
import { storageKey } from './quiz'

function createApp(now = new Date('2026-09-10T00:00:00.000Z')) {
  localStorage.clear()
  const root = document.createElement('div')
  document.body.append(root)
  mountApp(root, { now: () => now })
  return root
}

afterEach(() => {
  document.body.replaceChildren()
  localStorage.clear()
})

describe('学習画面', () => {
  it('選択した回答を保存し、再マウント後も復元する', () => {
    const root = createApp()
    getByRole(root, 'button', { name: '1〜3を順に調べ、X と違う最初の数を選ぶ' }).click()

    expect(JSON.parse(localStorage.getItem(storageKey)!)).toMatchObject({
      'abc474-a': { answers: { strategy: 'scan' } },
    })

    root.replaceChildren()
    mountApp(root)
    expect(getByRole(root, 'button', { name: '1〜3を順に調べ、X と違う最初の数を選ぶ' }).classList).toContain('selected')
  })

  it('不正解の計算量を答え合わせすると、理由と学習リンクを表示する', () => {
    const root = createApp()
    getByRole(root, 'button', { name: 'O(N)' }).click()
    getByRole(root, 'button', { name: '答え合わせ' }).click()

    expect(root.querySelector('.feedback.retry')?.textContent).toContain('答えは O(1) です。')
    expect(getByText(root, '候補は最大3個で固定です。', { exact: false })).toBeTruthy()
    expect(root.querySelectorAll('.learning-links a')).toHaveLength(2)
  })

  it('問題を切り替えても回答を保持する', () => {
    const root = createApp()
    getByRole(root, 'button', { name: '1〜3を順に調べ、X と違う最初の数を選ぶ' }).click()
    getByRole(root, 'button', { name: /B\s*200点/ }).click()

    expect(getByText(root, 'B · Exit Order')).toBeTruthy()

    getByRole(root, 'button', { name: /A\s*100点/ }).click()
    expect(getByRole(root, 'button', { name: '1〜3を順に調べ、X と違う最初の数を選ぶ' }).classList).toContain('selected')
  })

  it('練習記録で3日後の復習日を保存する', () => {
    const now = new Date('2026-09-10T00:00:00.000Z')
    const root = createApp(now)
    getByRole(root, 'button', { name: '1〜3を順に調べ、X と違う最初の数を選ぶ' }).click()
    getByRole(root, 'button', { name: '今日の練習を記録 →' }).click()

    const saved = JSON.parse(localStorage.getItem(storageKey)!)
    expect(saved['abc474-a'].completedAt).toBe('2026-09-10T00:00:00.000Z')
    expect(saved['abc474-a'].reviewAt).toBe('2026-09-13T00:00:00.000Z')
    expect(within(root).getByText(/次の復習 9\/13/)).toBeTruthy()
  })

  it('壊れた回答データでも初期画面を表示できる', () => {
    localStorage.setItem(storageKey, '{invalid json')
    const root = document.createElement('div')
    document.body.append(root)

    expect(() => mountApp(root)).not.toThrow()
    expect(getByText(root, 'A · Not X')).toBeTruthy()
  })
})
