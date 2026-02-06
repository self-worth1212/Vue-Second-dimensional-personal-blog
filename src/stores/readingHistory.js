import { defineStore } from 'pinia'

const STORAGE_KEY = 'readingHistory'
const MAX_HISTORY_COUNT = 20

export const useReadingHistoryStore = defineStore('readingHistory', {
  state: () => ({
    history: []
  }),
  actions: {
    // 从 localStorage 加载历史记录
    loadHistory() {
      try {
        const storedHistory = localStorage.getItem(STORAGE_KEY)
        if (storedHistory) {
          this.history = JSON.parse(storedHistory)
        }
      } catch (error) {
        console.error('Failed to load reading history:', error)
        this.history = []
      }
    },
    // 保存历史记录到 localStorage
    saveHistory() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.history))
      } catch (error) {
        console.error('Failed to save reading history:', error)
      }
    },
    // 添加或更新阅读历史
    addToHistory(article) {
      // 检查是否已存在该文章
      const existingIndex = this.history.findIndex(item => item.id === article.id)
      
      if (existingIndex !== -1) {
        // 存在则更新访问时间
        this.history[existingIndex].visitedAt = new Date().toISOString()
        // 移到数组顶部（最新）
        const updatedItem = this.history.splice(existingIndex, 1)[0]
        this.history.unshift(updatedItem)
      } else {
        // 不存在则添加到顶部
        this.history.unshift({
          ...article,
          visitedAt: new Date().toISOString()
        })
        // 限制最多保存 20 条记录
        if (this.history.length > MAX_HISTORY_COUNT) {
          this.history.pop()
        }
      }
      
      this.saveHistory()
    },
    // 清空所有历史记录
    clearHistory() {
      this.history = []
      this.saveHistory()
    }
  }
})
