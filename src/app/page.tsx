"use client"
import React, { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LayoutDashboard, Calendar, Brain, Activity, Search, Save, Download, Upload, Wallet, TrendingUp, DollarSign, PieChart, Briefcase, Target, CheckCircle2, FileText, FolderOpen, ExternalLink } from "lucide-react"
import { format } from "date-fns"

interface Task { id: string; title: string; description: string; status: "todo" | "in_progress" | "done"; priority: "low" | "medium" | "high"; owner: "OpenClaw" | "Raymond" | "Both"; category: string; createdAt: string; updatedAt: string }
interface Memory { id: string; title: string; content: string; category: string; tags: string[]; createdAt: string }
interface ActivityItem { id: string; action: string; details: string; type: "task" | "memory" | "system" | "search"; timestamp: string }
interface CalendarEvent { id: string; title: string; startDate: string; type: "task" | "meeting" | "reminder" }
interface PortfolioItem { id: string; name: string; symbol: string; type: "stock" | "crypto" | "bond" | "cash"; value: number; change24h: number; allocation: number }
interface ReportFile { name: string; path: string; type: "report" | "data" | "memory" | "other" }

const defaultTasks: Task[] = [
  { id: "1", title: "研究比特幣投資機會", description: "分析比特幣市場", status: "done", priority: "high", owner: "OpenClaw", category: "投資", createdAt: "2026-02-25T10:00:00Z", updatedAt: "2026-02-25T14:58:00Z" },
  { id: "2", title: "FIRE組合review", description: "每週檢視投資組合表現", status: "in_progress", priority: "medium", owner: "OpenClaw", category: "投資", createdAt: "2026-02-25T09:00:00Z", updatedAt: "2026-02-25T09:00:00Z" },
  { id: "3", title: "寶寶用品清單", description: "整理初生嬰兒所需物品", status: "todo", priority: "high", owner: "Raymond", category: "家庭", createdAt: "2026-02-24T12:00:00Z", updatedAt: "2026-02-24T12:00:00Z" },
]

const defaultMemories: Memory[] = [
  { id: "1", title: "比特幣投資分析完成", content: "完成比特幣投資機會研究，報告已存檔。建議配置3-5%資產", category: "投資", tags: ["BTC", "Crypto"], createdAt: "2026-02-25T14:58:00Z" },
  { id: "2", title: "Mission Control系統建立", content: "建立Mission Control儀表板", category: "系統", tags: ["系統", "Automation"], createdAt: "2026-02-25T12:00:00Z" },
]

const defaultActivities: ActivityItem[] = [
  { id: "1", action: "完成任務", details: "比特幣投資研究報告已完成並存檔", type: "task", timestamp: "2026-02-25T14:58:00Z" },
  { id: "2", action: "新增記憶", details: "記錄比特幣投資分析結論", type: "memory", timestamp: "2026-02-25T14:55:00Z" },
  { id: "3", action: "系統 Built", details: "創建Mission Control儀表板", type: "system", timestamp: "2026-02-25T12:00:00Z" },
]

const defaultEvents: CalendarEvent[] = [
  { id: "1", title: "每週投資組合review", startDate: "2026-02-28T09:00:00Z", type: "task" },
  { id: "2", title: "比特幣價格檢查", startDate: "2026-02-26T08:00:00Z", type: "reminder" },
]

const defaultPortfolio: PortfolioItem[] = [
  { id: "1", name: "比特幣", symbol: "BTC", type: "crypto", value: 50000, change24h: 2.5, allocation: 25 },
  { id: "2", name: "Alibaba", symbol: "9988.HK", type: "stock", value: 30000, change24h: -1.2, allocation: 15 },
  { id: "3", name: "CMB", symbol: "0941.HK", type: "stock", value: 40000, change24h: 0.5, allocation: 20 },
  { id: "4", name: "iShares BTC ETF", symbol: "IBIT", type: "stock", value: 20000, change24h: 1.8, allocation: 10 },
  { id: "5", name: "Cash", symbol: "CASH", type: "cash", value: 50000, change24h: 0, allocation: 25 },
  { id: "6", name: "US Treasury", symbol: "TLT", type: "bond", value: 10000, change24h: 0.2, allocation: 5 },
]

const defaultReports: ReportFile[] = [
  { name: "比特幣投資報告 2026-02-25", path: "reports/bitcoin_investment_report_20260225.md", type: "report" },
  { name: "偉哥投資文章整理", path: "data/weike_investment/all_articles.md", type: "data" },
  { name: "工作日誌 2026-02-25", path: "memory/2026-02-25.md", type: "memory" },
  { name: "主動任務清單", path: "active-tasks.md", type: "other" },
]

const STORAGE_KEY = 'mission_control_data'

function loadData() {
  if (typeof window === 'undefined') return null
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') } catch { return null }
}

function saveData(data: any) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function exportData(data: any) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `mission-control-${format(new Date(), 'yyyy-MM-dd')}.json`
  a.click()
}

function TaskBoard({ tasks, onStatusChange }: { tasks: Task[], onStatusChange: (id: string, status: Task["status"]) => void }) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null)
  const columns = [
    { id: "todo", title: "待完成", color: "bg-gray-100 dark:bg-gray-800" },
    { id: "in_progress", title: "In Progress", color: "bg-blue-100 dark:bg-blue-900" },
    { id: "done", title: "Done", color: "bg-green-100 dark:bg-green-900" }
  ]
  const getPriorityColor = (p: string) => p === "high" ? "bg-red-500" : p === "medium" ? "bg-yellow-500" : "bg-green-500"
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((col) => (
        <div key={col.id} className={`rounded-lg p-4 ${col.color}`} onDragOver={(e) => e.preventDefault()} onDrop={() => { if (draggedTask) { onStatusChange(draggedTask, col.id as Task["status"]); setDraggedTask(null) }}}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">{col.title}</h3>
            <Badge variant="secondary">{tasks.filter(t => t.status === col.id).length}</Badge>
          </div>
          <div className="space-y-3">
            {tasks.filter(t => t.status === col.id).map((task) => (
              <Card key={task.id} className="cursor-move hover:shadow-md" draggable onDragStart={() => setDraggedTask(task.id)}>
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
                    <Badge variant={task.owner === "OpenClaw" ? "default" : "secondary"} className="text-xs">{task.owner}</Badge>
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

function CalendarView({ events }: { events: CalendarEvent[] }) {
  const getEventColor = (t: string) => t === "task" ? "bg-blue-500" : t === "meeting" ? "bg-purple-500" : "bg-yellow-500"
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            {events.map((e) => (
              <div key={e.id} className={`flex items-center gap-3 p-3 rounded-lg ${getEventColor(e.type)}/10`}>
                <div className={`w-1 h-12 rounded ${getEventColor(e.type)}`} />
                <div className="flex-1">
                  <p className="font-medium">{e.title}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(e.startDate), "MMM d, h:mm a")}</p>
                </div>
                <Badge variant="outline">{e.type}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MemoryLibrary({ memories }: { memories: Memory[] }) {
  const [search, setSearch] = useState("")
  const filtered = memories.filter(m => search === "" || m.title.toLowerCase().includes(search.toLowerCase()) || m.content.toLowerCase().includes(search.toLowerCase()))
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="搜尋記憶..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="grid gap-4">
        {filtered.map((m) => (
          <Card key={m.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{m.title}</CardTitle>
                <Badge variant="outline">{m.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{m.content}</p>
              <div className="flex gap-2 mt-3">{m.tags.map((t) => (<Badge key={t} variant="secondary" className="text-xs">{t}</Badge>))}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  const getColor = (t: string) => t === "task" ? "bg-blue-500" : t === "memory" ? "bg-purple-500" : t === "system" ? "bg-green-500" : "bg-yellow-500"
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
        <div className="space-y-6">
          {activities.map((a, i) => (
            <div key={a.id} className="flex gap-4">
              <div className={`z-10 w-8 h-8 rounded-full ${getColor(a.type)} flex items-center justify-center text-white`}>
                <Activity className="w-4 h-4" />
              </div>
              <Card className="flex-1">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{a.action}</p>
                    <span className="text-xs text-muted-foreground">{format(new Date(a.timestamp), "HH:mm")}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{a.details}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PortfolioView({ portfolio }: { portfolio: PortfolioItem[] }) {
  const total = portfolio.reduce((s, i) => s + i.value, 0)
  const change = portfolio.reduce((s, i) => s + (i.value * i.change24h / 100), 0)
  const changePercent = (change / total) * 100
  const getTypeIcon = (t: string) => t === "crypto" ? <DollarSign className="w-4 h-4" /> : t === "bond" ? <PieChart className="w-4 h-4" /> : t === "cash" ? <Wallet className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />
  const getChangeColor = (c: number) => c > 0 ? "text-green-500" : c < 0 ? "text-red-500" : "text-gray-500"
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardHeader className="pb-2"><CardDescription>總資產</CardDescription><CardTitle className="text-2xl">${total.toLocaleString()}</CardTitle></CardHeader></Card>
        <Card><CardHeader className="pb-2"><CardDescription>24小時變動</CardDescription><CardTitle className={`text-2xl ${getChangeColor(change)}`}>{change >= 0 ? "+" : ""}${change.toLocaleString()} ({changePercent.toFixed(2)}%)</CardTitle></CardHeader></Card>
        <Card><CardHeader className="pb-2"><CardDescription>持倉數量</CardDescription><CardTitle className="text-2xl">{portfolio.length}</CardTitle></CardHeader></Card>
        <Card><CardHeader className="pb-2"><CardDescription>現金水平</CardDescription><CardTitle className="text-2xl">{portfolio.find(p => p.type === 'cash')?.allocation || 0}%</CardTitle></CardHeader></Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Briefcase className="w-5 h-5" />持倉數量</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {portfolio.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">{getTypeIcon(item.type)}</div>
                  <div><p className="font-medium">{item.name}</p><p className="text-xs text-muted-foreground">{item.symbol}</p></div>
                </div>
                <div className="text-right"><p className="font-medium">${item.value.toLocaleString()}</p><p className={`text-xs ${getChangeColor(item.change24h)}`}>{item.change24h >= 0 ? "+" : ""}{item.change24h}%</p></div>
                <div className="text-right"><p className="text-sm text-muted-foreground">{item.allocation}%</p><div className="w-20 h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: `${item.allocation}%` }} /></div></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DailyBriefView({ tasks, events, activities, portfolio }: { tasks: Task[], events: CalendarEvent[], activities: ActivityItem[], portfolio: PortfolioItem[] }) {
  const today = format(new Date(), 'yyyy-MM-dd')
  const total = portfolio.reduce((s, i) => s + i.value, 0)
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold">每日簡報</h2><p className="text-muted-foreground">{format(new Date(), 'yyyy-MM-dd')}</p></div>
        <Button onClick={() => exportData({ tasks, memories: [], activities, events, portfolio })}><Download className="w-4 h-4 mr-2" />Export</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-white"><Target className="w-5 h-5" />今日任務</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{tasks.filter(t => t.status === 'todo').length}</div><p className="text-blue-100">待完成</p></CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-white"><Calendar className="w-5 h-5" />日程</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{events.filter(e => format(new Date(e.startDate), 'yyyy-MM-dd') === today).length}</div><p className="text-purple-100">Events</p></CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-white"><Wallet className="w-5 h-5" />總資產</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">${total.toLocaleString()}</div><p className="text-green-100">HKD</p></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>最近活動</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activities.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1"><p className="font-medium">{a.action}</p><p className="text-sm text-muted-foreground">{a.details}</p></div>
                <span className="text-xs text-muted-foreground">{format(new Date(a.timestamp), 'HH:mm')}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ReportsView({ reports }: { reports: ReportFile[] }) {
  const [search, setSearch] = useState("")
  const [selectedReport, setSelectedReport] = useState<ReportFile | null>(null)
  const filtered = reports.filter(r => search === "" || r.name.toLowerCase().includes(search.toLowerCase()))
  const getTypeIcon = (t: string) => t === "report" ? <FileText className="w-4 h-4" /> : t === "data" ? <FolderOpen className="w-4 h-4" /> : <Brain className="w-4 h-4" />
  const getTypeColor = (t: string) => t === "report" ? "bg-blue-500" : t === "data" ? "bg-green-500" : "bg-purple-500"

  // Sample content for preview (in real app, would fetch from API)
  const getPreviewContent = (r: ReportFile) => {
    if (r.type === "report") return "📊 投資報告內容預覽...\n\n[Click to view full content]"
    if (r.type === "data") return "📁 數據文件內容預覽...\n\n[Click to view full content]"
    return "🧠 記憶內容預覽...\n\n[Click to view full content]"
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Left: Report List */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search reports..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          {filtered.map((r) => (
            <Card key={r.path} className={`hover:shadow-md transition-shadow cursor-pointer ${selectedReport?.path === r.path ? 'ring-2 ring-primary' : ''}`} onClick={() => setSelectedReport(r)}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${getTypeColor(r.type)} flex items-center justify-center text-white`}>
                      {getTypeIcon(r.type)}
                    </div>
                    <CardTitle className="text-lg">{r.name}</CardTitle>
                  </div>
                  <Badge variant="outline">{r.type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{r.path}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Right: Preview Panel */}
      <div className="space-y-4">
        {selectedReport ? (
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{selectedReport.name}</CardTitle>
              <CardDescription>{selectedReport.path}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap text-sm font-mono">
                {getPreviewContent(selectedReport)}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent className="text-center text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a report to preview</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function GlobalSearch() {
  const [query, setQuery] = useState("")
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input placeholder="搜尋任務、記憶、活動..." className="pl-12 text-lg h-14" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      {query && <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Searching for "{query}"...</p></CardContent></Card>}
    </div>
  )
}

export default function MissionControl() {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks)
  const [memories, setMemories] = useState<Memory[]>(defaultMemories)
  const [activities, setActivities] = useState<ActivityItem[]>(defaultActivities)
  const [events, setEvents] = useState<CalendarEvent[]>(defaultEvents)
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(defaultPortfolio)
  const [reports] = useState<ReportFile[]>(defaultReports)
  const [lastSync, setLastSync] = useState("")
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "medium" as "low" | "medium" | "high", category: "投資", owner: "Raymond" as "OpenClaw" | "Raymond" | "Both" })
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const saved = loadData()
    if (saved) {
      if (saved.tasks) setTasks(saved.tasks)
      if (saved.memories) setMemories(saved.memories)
      if (saved.activities) setActivities(saved.activities)
      if (saved.events) setEvents(saved.events)
      if (saved.portfolio) setPortfolio(saved.portfolio)
    }
    setLastSync(new Date().toLocaleTimeString())
  }, [])

  const handleSave = () => {
    saveData({ tasks, memories, activities, events, portfolio })
    setLastSync(new Date().toLocaleTimeString())
  }

  const handleStatusChange = (id: string, status: Task["status"]) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t))
  }

  const handleAddTask = () => {
    if (!newTask.title.trim()) return
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      status: "todo",
      priority: newTask.priority,
      owner: newTask.owner,
      category: newTask.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setTasks([...tasks, task])
    setNewTask({ title: "", description: "", priority: "medium", category: "投資", owner: "Raymond" })
    setShowAddTask(false)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string)
          if (data.tasks) setTasks(data.tasks)
          if (data.memories) setMemories(data.memories)
          if (data.activities) setActivities(data.activities)
          if (data.events) setEvents(data.events)
          if (data.portfolio) setPortfolio(data.portfolio)
          setLastSync(new Date().toLocaleTimeString())
        } catch {}
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center"><span className="text-white font-bold">M</span></div>
              <div><h1 className="text-xl font-bold">Mission Control</h1><p className="text-xs text-muted-foreground">Raymond's Personal Dashboard</p></div>
            </div>
            <div className="flex items-center gap-2">
              {lastSync && <span className="text-xs text-muted-foreground mr-2">Sync: {lastSync}</span>}
              <input type="file" ref={fileInputRef} accept=".json" style={{ display: 'none' }} id="import-file" onChange={handleImport} />
              <label htmlFor="import-file"><Button variant="outline" size="sm" asChild><span><Upload className="w-4 h-4 mr-2" />Import</span></Button></label>
              <Button variant="outline" size="sm" onClick={() => exportData({ tasks, memories, activities, events, portfolio })}><Download className="w-4 h-4 mr-2" />Export</Button>
              <Button variant="outline" size="sm" onClick={handleSave}><Save className="w-4 h-4 mr-2" />Save</Button>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="brief" className="space-y-4">
          <TabsList className="grid grid-cols-7 w-full">
            <TabsTrigger value="brief"><Target className="w-4 h-4 mr-2" />Brief</TabsTrigger>
            <TabsTrigger value="tasks"><LayoutDashboard className="w-4 h-4 mr-2" />Tasks</TabsTrigger>
            <TabsTrigger value="calendar"><Calendar className="w-4 h-4 mr-2" />Calendar</TabsTrigger>
            <TabsTrigger value="memory"><Brain className="w-4 h-4 mr-2" />Memory</TabsTrigger>
            <TabsTrigger value="portfolio"><Wallet className="w-4 h-4 mr-2" />Portfolio</TabsTrigger>
            <TabsTrigger value="reports"><FileText className="w-4 h-4 mr-2" />Reports</TabsTrigger>
            <TabsTrigger value="search"><Search className="w-4 h-4 mr-2" />Search</TabsTrigger>
          </TabsList>
          <TabsContent value="brief"><DailyBriefView tasks={tasks} events={events} activities={activities} portfolio={portfolio} /></TabsContent>
          <TabsContent value="tasks">
            <div className="space-y-4">
              {/* Add Task Button / Form */}
              {!showAddTask ? (
                <Button onClick={() => setShowAddTask(true)} className="w-full">
                  <Target className="w-4 h-4 mr-2" />新增任務
                </Button>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>新增任務</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input placeholder="任務標題" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} />
                    <Input placeholder="任務描述" value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} />
                    <div className="flex gap-2">
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}>
                        <option value="low">低優先</option>
                        <option value="medium">中優先</option>
                        <option value="high">高優先</option>
                      </select>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" value={newTask.category} onChange={(e) => setNewTask({...newTask, category: e.target.value})}>
                        <option value="投資">投資</option>
                        <option value="家庭">家庭</option>
                        <option value="工作">工作</option>
                        <option value="系統">系統</option>
                      </select>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" value={newTask.owner} onChange={(e) => setNewTask({...newTask, owner: e.target.value as any})}>
                        <option value="Raymond">Raymond</option>
                        <option value="OpenClaw">OpenClaw</option>
                        <option value="Both">Both</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddTask}>確認新增</Button>
                      <Button variant="outline" onClick={() => setShowAddTask(false)}>取消</Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              <TaskBoard tasks={tasks} onStatusChange={handleStatusChange} />
            </div>
          </TabsContent>
          <TabsContent value="calendar"><CalendarView events={events} /></TabsContent>
          <TabsContent value="memory"><MemoryLibrary memories={memories} /></TabsContent>
          <TabsContent value="portfolio"><PortfolioView portfolio={portfolio} /></TabsContent>
          <TabsContent value="reports"><ReportsView reports={reports} /></TabsContent>
          <TabsContent value="search"><GlobalSearch /></TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
