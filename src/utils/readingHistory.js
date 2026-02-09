/**
 * 阅读历史管理模块
 * 使用 localStorage 存储用户的文章阅读历史
 */

const STORAGE_KEY = 'blog_reading_history'
const MAX_HISTORY_COUNT = 20

/**
 * 获取阅读历史列表
 * @returns {Array} 阅读历史数组
 */
export function getReadingHistory() {
  try {
    const history = localStorage.getItem(STORAGE_KEY)
    return history ? JSON.parse(history) : []
  } catch (error) {
    console.error('获取阅读历史失败:', error)
    return []
  }
}

/**
 * 添加文章到阅读历史
 * @param {Object} article 文章对象 { id, title, cover, path }
 */
export function addToHistory(article) {
  try {
    if (!article || !article.id) {
      console.warn('添加阅读历史失败: 文章信息不完整')
      return
    }

    let history = getReadingHistory()
    
    // 检查是否已存在相同文章
    const existingIndex = history.findIndex(item => item.id === article.id)
    
    const historyItem = {
      id: article.id,
      title: article.title || '无标题',
      cover: article.cover || '',
      path: article.path || '',
      visitTime: new Date().toISOString()
    }
    
    if (existingIndex !== -1) {
      // 已存在则移除旧记录，新记录会添加到最前面
      history.splice(existingIndex, 1)
    }
    
    // 添加到数组开头（最新的在最前面）
    history.unshift(historyItem)
    
    // 限制最大数量
    if (history.length > MAX_HISTORY_COUNT) {
      history = history.slice(0, MAX_HISTORY_COUNT)
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch (error) {
    console.error('添加阅读历史失败:', error)
  }
}

/**
 * 清空所有阅读历史
 */
export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('清空阅读历史失败:', error)
  }
}

/**
 * 删除单条阅读历史
 * @param {string} articleId 文章ID
 */
export function removeFromHistory(articleId) {
  try {
    let history = getReadingHistory()
    history = history.filter(item => item.id !== articleId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch (error) {
    console.error('删除阅读历史失败:', error)
  }
}

/**
 * 格式化访问时间
 * @param {string} isoTime ISO格式时间字符串
 * @returns {string} 格式化后的时间
 */
export function formatVisitTime(isoTime) {
  if (!isoTime) return ''
  
  const date = new Date(isoTime)
  const now = new Date()
  const diff = now - date
  
  // 小于1分钟
  if (diff < 60000) {
    return '刚刚'
  }
  
  // 小于1小时
  if (diff < 3600000) {
    return Math.floor(diff / 60000) + '分钟前'
  }
  
  // 小于24小时
  if (diff < 86400000) {
    return Math.floor(diff / 3600000) + '小时前'
  }
  
  // 小于7天
  if (diff < 604800000) {
    return Math.floor(diff / 86400000) + '天前'
  }
  
  // 超过7天显示具体日期
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}`
}
