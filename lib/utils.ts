export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true
  })
}

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const calculateBoardUsage = (content: string): number => {
  const maxLength = 2000
  const usage = (content.length / maxLength) * 100
  return Math.min(usage, 100)
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export const cleanContent = (content: string, type: string): string => {
  switch (type) {
    case 'algorithms':
      return content.replace(/algorithm|function|loop|iteration/gi, '')
    case 'diagrams':
      return content.replace(/<i class="fas fa-[^"]*"><\/i>/g, '')
    case 'unpinned':
      return content.split('\n').filter(line => line.includes('📌')).join('\n')
    default:
      return ''
  }
}