// Initial data loader - imports from workspace files
import fs from 'fs'
import path from 'path'

const WORKSPACE_DIR = path.join(process.cwd(), '..', 'workspace')

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in_progress" | "done"
  priority: "low" | "medium" | "high"
  owner: "OpenClaw" | "Raymond" | "Both"
  category: string
  createdAt: string
  updatedAt: string
}

interface Memory {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: string
}

interface Activity {
  id: string
  action: string
  details: string
  type: "task" | "memory" | "system" | "search"
  timestamp: string
}

interface CalendarEvent {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  type: "task" | "meeting" | "reminder"
  priority: "low" | "medium" | "high"
}

// Parse active-tasks.md to extract tasks
function parseActiveTasks(): Task[] {
  const tasksPath = path.join(WORKSPACE_DIR, 'active-tasks.md')
  try {
    if (fs.existsSync(tasksPath)) {
      const content = fs.readFileSync(tasksPath, 'utf-8')
      // For now, return demo tasks since the MD format needs parsing
      return getDemoTasks()
    }
  } catch (e) {
    console.error('Error reading active-tasks.md:', e)
  }
  return getDemoTasks()
}

// Get demo tasks
function getDemoTasks(): Task[] {
  return [
    {
      id: "1",
      title: "研究比特幣投資機會",
      description: "分析比特幣市場，撰寫投資建議報告",
      status: "done",
      priority: "high",
      owner: "OpenClaw",
      category: "投資",
      createdAt: "2026-02-25T10:00:00Z",
      updatedAt: "2026-02-25T14:58:00Z"
    },
    {
      id: "2",
      title: "FIRE 組合 review",
      description: "每週檢視投資組合表現",
      status: "in_progress",
      priority: "medium",
      owner: "OpenClaw",
      category: "投資",
      createdAt: "2026-02-25T09:00:00Z",
      updatedAt: "2026-02-25T09:00:00Z"
    },
    {
      id: "3",
      title: "寶寶用品清單",
      description: "整理初生嬰兒所需物品",
      status: "todo",
      priority: "high",
      owner: "Raymond",
      category: "家庭",
      createdAt: "2026-02-24T12:00:00Z",
      updatedAt: "2026-02-24T12:00:00Z"
    },
    {
      id: "4",
      title: "設定每日晨報",
      description: "建立每日自動晨報系統",
      status: "todo",
      priority: "medium",
      owner: "Both",
      category: "系統",
      createdAt: "2026-02-25T08:00:00Z",
      updatedAt: "2026-02-25T08:00:00Z"
    }
  ]
}

// Get demo memories
function getDemoMemories(): Memory[] {
  return [
    {
      id: "1",
      title: "比特幣投資分析完成",
      content: "完成比特幣投資機會研究，報告已存檔。建議配置3-5%資產，採用定投策略。",
      category: "投資",
      tags: ["比特幣", "加密貨幣", "投資建議"],
      createdAt: "2026-02-25T14:58:00Z"
    },
    {
      id: "2",
      title: "Mission Control 系統建立",
      content: "建立 Mission Control 儀表板，整合任務系統、記憶庫、活動紀錄。",
      category: "系統",
      tags: ["系統", "自動化", "任務管理"],
      createdAt: "2026-02-25T12:00:00Z"
    },
    {
      id: "3",
      title: "偉哥投資哲學整理",
      content: "從1749篇網誌文章中提取偉哥既投資哲學，包括選股標準、風險管理、IPO評估框架。",
      category: "投資",
      tags: ["偉哥", "港股", "投資哲學"],
      createdAt: "2026-02-25T06:00:00Z"
    }
  ]
}

// Get demo activities
function getDemoActivities(): Activity[] {
  return [
    {
      id: "1",
      action: "完成任務",
      details: "比特幣投資研究報告已完成並存檔",
      type: "task",
      timestamp: "2026-02-25T14:58:00Z"
    },
    {
      id: "2",
      action: "新增記憶",
      details: "記錄比特幣投資分析結論",
      type: "memory",
      timestamp: "2026-02-25T14:55:00Z"
    },
    {
      id: "3",
      action: "建立系統",
      details: "創建 Mission Control 儀表板",
      type: "system",
      timestamp: "2026-02-25T12:00:00Z"
    },
    {
      id: "4",
      action: "搜索資訊",
      details: "搜尋比特幣最新價格與市場趨勢",
      type: "search",
      timestamp: "2026-02-25T10:30:00Z"
    }
  ]
}

// Get demo events
function getDemoEvents(): CalendarEvent[] {
  return [
    {
      id: "1",
      title: "每週投資組合 review",
      description: "檢視本週投資表現",
      startDate: "2026-02-28T09:00:00Z",
      endDate: "2026-02-28T10:00:00Z",
      type: "task",
      priority: "medium"
    },
    {
      id: "2",
      title: "比特幣價格檢查",
      description: "每日比特幣價格監控",
      startDate: "2026-02-26T08:00:00Z",
      endDate: "2026-02-26T08:30:00Z",
      type: "reminder",
      priority: "low"
    }
  ]
}

// Export data loader functions
export function loadInitialData() {
  return {
    tasks: parseActiveTasks(),
    memories: getDemoMemories(),
    activities: getDemoActivities(),
    events: getDemoEvents()
  }
}
