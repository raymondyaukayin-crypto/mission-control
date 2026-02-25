"use client"

import { useState, useEffect, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  LayoutDashboard, 
  Calendar, 
  Brain, 
  Activity, 
  Search,
  Moon,
  Sun,
  Plus,
  MoreVertical,
  Clock,
  Tag,
  Filter,
  RefreshCw,
  Save,
  Loader2
} from "lucide-react"
import { format } from "date-fns"

// Types
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

// Demo data (fallback)
const demoTasks: Task[] = [
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

const demoMemories: Memory[] = [
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

const demoActivities: Activity[] = [
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

const demoEvents: CalendarEvent[] = [
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

// Task Board Component
function TaskBoard({ tasks, onStatusChange, onSave }: { tasks: Task[], onStatusChange: (id: string, status: Task["status"]) => void, onSave: () => void }) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null)
  
  const columns = [
    { id: "todo", title: "To Do", color: "bg-gray-100 dark:bg-gray-800" },
    { id: "in_progress", title: "In Progress", color: "bg-blue-100 dark:bg-blue-900" },
    { id: "done", title: "Done", color: "bg-green-100 dark:bg-green-900" }
  ] as const

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500"
      case "medium": return "bg-yellow-500"
      case "low": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  const handleDragEnd = (taskId: string, newStatus: Task["status"]) => {
    onStatusChange(taskId, newStatus)
    onSave()
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((column) => (
        <div
          key={column.id}
          className={`rounded-lg p-4 ${column.color}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (draggedTask) {
              handleDragEnd(draggedTask, column.id as Task["status"])
              setDraggedTask(null)
            }
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">{column.title}</h3>
            <Badge variant="secondary">
              {tasks.filter(t => t.status === column.id).length}
            </Badge>
          </div>
          <div className="space-y-3">
            {tasks
              .filter((task) => task.status === column.id)
              .map((task) => (
                <Card
                  key={task.id}
                  className="cursor-move hover:shadow-md transition-shadow"
                  draggable
                  onDragStart={() => setDraggedTask(task.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{task.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">{task.category}</Badge>
                      <Badge variant={task.owner === "OpenClaw" ? "default" : "secondary"} className="text-xs">
                        {task.owner}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Calendar Component
function CalendarView({ events }: { events: CalendarEvent[] }) {
  const [view, setView] = useState<"day" | "week" | "month">("week")
  
  const getEventColor = (type: string) => {
    switch (type) {
      case "task": return "bg-blue-500"
      case "meeting": return "bg-purple-500"
      case "reminder": return "bg-yellow-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(["day", "week", "month"] as const).map((v) => (
            <Button
              key={v}
              variant={view === v ? "default" : "outline"}
              size="sm"
              onClick={() => setView(v)}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </div>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className={`flex items-center gap-3 p-3 rounded-lg ${getEventColor(event.type)}/10`}
              >
                <div className={`w-1 h-12 rounded ${getEventColor(event.type)}`} />
                <div className="flex-1">
                  <p className="font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(event.startDate), "MMM d, h:mm a")}
                  </p>
                </div>
                <Badge variant="outline">{event.type}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Memory Component
function MemoryLibrary({ memories }: { memories: Memory[] }) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  
  const categories = ["all", ...Array.from(new Set(memories.map(m => m.category)))]
  
  const filteredMemories = memories.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
                         m.content.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === "all" || m.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜尋記憶..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="分類" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat === "all" ? "全部" : cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4">
        {filteredMemories.map((memory) => (
          <Card key={memory.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{memory.title}</CardTitle>
                <Badge variant="outline">{memory.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{memory.content}</p>
              <div className="flex gap-2 mt-3">
                {memory.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {format(new Date(memory.createdAt), "yyyy-MM-dd HH:mm")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Activity Feed Component
function ActivityFeed({ activities }: { activities: Activity[] }) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "task": return <LayoutDashboard className="w-4 h-4" />
      case "memory": return <Brain className="w-4 h-4" />
      case "system": return <Activity className="w-4 h-4" />
      case "search": return <Search className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "task": return "bg-blue-500"
      case "memory": return "bg-purple-500"
      case "system": return "bg-green-500"
      case "search": return "bg-yellow-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="篩選活動..." className="flex-1" />
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex gap-4 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={`relative z-10 w-8 h-8 rounded-full ${getActivityColor(activity.type)} flex items-center justify-center text-white`}>
                {getActivityIcon(activity.type)}
              </div>
              <Card className="flex-1">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{activity.action}</p>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(activity.timestamp), "HH:mm")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{activity.details}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Global Search Component
function GlobalSearch() {
  const [query, setQuery] = useState("")
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="搜尋任務、記憶、活動..."
          className="pl-12 text-lg h-14"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {query && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              輸入「{query}」進行搜尋...
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Main Page Component
export default function MissionControl() {
  const [tasks, setTasks] = useState<Task[]>(demoTasks)
  const [memories, setMemories] = useState<Memory[]>(demoMemories)
  const [activities, setActivities] = useState<Activity[]>(demoActivities)
  const [events, setEvents] = useState<CalendarEvent[]>(demoEvents)
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [isSaving, setIsSaving] = useState(false)
  const [lastSync, setLastSync] = useState<string>("")

  // Load data from API
  const loadData = useCallback(async () => {
    try {
      const [tasksRes, memoriesRes, activitiesRes, eventsRes] = await Promise.all([
        fetch('/api/data?type=tasks'),
        fetch('/api/data?type=memories'),
        fetch('/api/data?type=activities'),
        fetch('/api/data?type=events')
      ])

      const [tasksData, memoriesData, activitiesData, eventsData] = await Promise.all([
        tasksRes.json(),
        memoriesRes.json(),
        activitiesRes.json(),
        eventsRes.json()
      ])

      if (tasksData.length > 0) setTasks(tasksData)
      if (memoriesData.length > 0) setMemories(memoriesData)
      if (activitiesData.length > 0) setActivities(activitiesData)
      if (eventsData.length > 0) setEvents(eventsData)

      setLastSync(new Date().toLocaleTimeString())
    } catch (e) {
      console.error('Failed to load data:', e)
    }
  }, [])

  // Initial load
  useEffect(() => {
    loadData()
  }, [loadData])

  // Save data to API
  const saveData = async (type: string, data: any) => {
    setIsSaving(true)
    try {
      await fetch(`/api/data?type=${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    } catch (e) {
      console.error('Failed to save:', e)
    }
    setIsSaving(false)
  }

  const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
    setTasks(tasks.map(t => 
      t.id === taskId 
        ? { ...t, status: newStatus, updatedAt: new Date().toISOString() }
        : t
    ))
  }

  const handleSave = () => {
    saveData('tasks', tasks)
  }

  const handleSync = () => {
    loadData()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Mission Control</h1>
                <p className="text-xs text-muted-foreground">Raymond's Personal Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {lastSync && (
                <span className="text-xs text-muted-foreground mr-2">
                  同步: {lastSync}
                </span>
              )}
              <Button variant="outline" size="sm" onClick={handleSync}>
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                同步
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="tasks" className="space-y-4">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="tasks" className="gap-2">
              <LayoutDashboard className="w-4 h-4" />
              任務板
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <Calendar className="w-4 h-4" />
              行事曆
            </TabsTrigger>
            <TabsTrigger value="memory" className="gap-2">
              <Brain className="w-4 h-4" />
              記憶庫
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <Activity className="w-4 h-4" />
              活動紀錄
            </TabsTrigger>
            <TabsTrigger value="search" className="gap-2">
              <Search className="w-4 h-4" />
              全域搜尋
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">任務看板</h2>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  儲存
                </Button>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  新增任務
                </Button>
              </div>
            </div>
            <TaskBoard tasks={tasks} onStatusChange={handleStatusChange} onSave={handleSave} />
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarView events={events} />
          </TabsContent>

          <TabsContent value="memory">
            <MemoryLibrary memories={memories} />
          </TabsContent>

          <TabsContent value="activity">
            <ActivityFeed activities={activities} />
          </TabsContent>

          <TabsContent value="search">
            <GlobalSearch />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
