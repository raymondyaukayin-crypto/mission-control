"use client"
import React, { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LayoutDashboard, Calendar, Brain, Activity, Search, Save, Download, Upload, Wallet, TrendingUp, DollarSign, PieChart, Briefcase, Target, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"

interface Task { id: string; title: string; description: string; status: "todo" | "in_progress" | "done"; priority: "low" | "medium" | "high"; owner: "OpenClaw" | "Raymond" | "Both"; category: string; createdAt: string; updatedAt: string }
interface Memory { id: string; title: string; content: string; category: string; tags: string[]; createdAt: string }
interface ActivityItem { id: string; action: string; details: string; type: "task" | "memory" | "system" | "search"; timestamp: string }
interface CalendarEvent { id: string; title: string; startDate: string; type: "task" | "meeting" | "reminder" }
interface PortfolioItem { id: string; name: string; symbol: string; type: "stock" | "crypto" | "bond" | "cash"; value: number; change24h: number; allocation: number }

const defaultTasks: Task[] = [
  { id: "1", title: "Research Bitcoin", description: "Analyze BTC market", status: "done", priority: "high", owner: "OpenClaw", category: "Investment", createdAt: "2026-02-25T10:00:00Z", updatedAt: "2026-02-25T14:58:00Z" },
  { id: "2", title: "FIRE Review", description: "Weekly portfolio review", status: "in_progress", priority: "medium", owner: "OpenClaw", category: "Investment", createdAt: "2026-02-25T09:00:00Z", updatedAt: "2026-02-25T09:00:00Z" },
  { id: "3", title: "Baby Checklist", description: "Newborn essentials", status: "todo", priority: "high", owner: "Raymond", category: "Family", createdAt: "2026-02-24T12:00:00Z", updatedAt: "2026-02-24T12:00:00Z" },
]

const defaultMemories: Memory[] = [
  { id: "1", title: "Bitcoin Analysis Done", content: "Complete BTC research, suggest 3-5% allocation", category: "Investment", tags: ["BTC", "Crypto"], createdAt: "2026-02-25T14:58:00Z" },
  { id: "2", title: "Mission Control Launch", content: "Built Mission Control Dashboard", category: "System", tags: ["System", "Automation"], createdAt: "2026-02-25T12:00:00Z" },
]

const defaultActivities: ActivityItem[] = [
  { id: "1", action: "Task Done", details: "Bitcoin report completed", type: "task", timestamp: "2026-02-25T14:58:00Z" },
  { id: "2", action: "Memory Added", details: "Recorded BTC conclusions", type: "memory", timestamp: "2026-02-25T14:55:00Z" },
  { id: "3", action: "System Built", details: "Created Mission Control", type: "system", timestamp: "2026-02-25T12:00:00Z" },
]

const defaultEvents: CalendarEvent[] = [
  { id: "1", title: "Weekly Portfolio Review", startDate: "2026-02-28T09:00:00Z", type: "task" },
  { id: "2", title: "BTC Price Check", startDate: "2026-02-26T08:00:00Z", type: "reminder" },
]

const defaultPortfolio: PortfolioItem[] = [
  { id: "1", name: "Bitcoin", symbol: "BTC", type: "crypto", value: 50000, change24h: 2.5, allocation: 25 },
  { id: "2", name: "Alibaba", symbol: "9988.HK", type: "stock", value: 30000, change24h: -1.2, allocation: 15 },
  { id: "3", name: "CMB", symbol: "0941.HK", type: "stock", value: 40000, change24h: 0.5, allocation: 20 },
  { id: "4", name: "iShares BTC ETF", symbol: "IBIT", type: "stock", value: 20000, change24h: 1.8, allocation: 10 },
  { id: "5", name: "Cash", symbol: "CASH", type: "cash", value: 50000, change24h: 0, allocation: 25 },
  { id: "6", name: "US Treasury", symbol: "TLT", type: "bond", value: 10000, change24h: 0.2, allocation: 5 },
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
    { id: "todo", title: "To Do", color: "bg-gray-100 dark:bg-gray-800" },
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
          <Input placeholder="Search memories..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
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
        <Card><CardHeader className="pb-2"><CardDescription>Total Assets</CardDescription><CardTitle className="text-2xl">${total.toLocaleString()}</CardTitle></CardHeader></Card>
        <Card><CardHeader className="pb-2"><CardDescription>24h Change</CardDescription><CardTitle className={`text-2xl ${getChangeColor(change)}`}>{change >= 0 ? "+" : ""}${change.toLocaleString()} ({changePercent.toFixed(2)}%)</CardTitle></CardHeader></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Holdings</CardDescription><CardTitle className="text-2xl">{portfolio.length}</CardTitle></CardHeader></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Cash Level</CardDescription><CardTitle className="text-2xl">{portfolio.find(p => p.type === 'cash')?.allocation || 0}%</CardTitle></CardHeader></Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Briefcase className="w-5 h-5" />Holdings</CardTitle></CardHeader>
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
        <div><h2 className="text-2xl font-bold">Daily Brief</h2><p className="text-muted-foreground">{format(new Date(), 'yyyy-MM-dd')}</p></div>
        <Button onClick={() => exportData({ tasks, memories: [], activities, events, portfolio })}><Download className="w-4 h-4 mr-2" />Export</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-white"><Target className="w-5 h-5" />Tasks Today</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{tasks.filter(t => t.status === 'todo').length}</div><p className="text-blue-100">To Do</p></CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-white"><Calendar className="w-5 h-5" />Schedule</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{events.filter(e => format(new Date(e.startDate), 'yyyy-MM-dd') === today).length}</div><p className="text-purple-100">Events</p></CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-white"><Wallet className="w-5 h-5" />Total Assets</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">${total.toLocaleString()}</div><p className="text-green-100">HKD</p></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Recent Activities</CardTitle></CardHeader>
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

function GlobalSearch() {
  const [query, setQuery] = useState("")
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input placeholder="Search tasks, memories, activities..." className="pl-12 text-lg h-14" value={query} onChange={(e) => setQuery(e.target.value)} />
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
  const [lastSync, setLastSync] = useState("")
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
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="brief"><Target className="w-4 h-4 mr-2" />Brief</TabsTrigger>
            <TabsTrigger value="tasks"><LayoutDashboard className="w-4 h-4 mr-2" />Tasks</TabsTrigger>
            <TabsTrigger value="calendar"><Calendar className="w-4 h-4 mr-2" />Calendar</TabsTrigger>
            <TabsTrigger value="memory"><Brain className="w-4 h-4 mr-2" />Memory</TabsTrigger>
            <TabsTrigger value="portfolio"><Wallet className="w-4 h-4 mr-2" />Portfolio</TabsTrigger>
            <TabsTrigger value="search"><Search className="w-4 h-4 mr-2" />Search</TabsTrigger>
          </TabsList>
          <TabsContent value="brief"><DailyBriefView tasks={tasks} events={events} activities={activities} portfolio={portfolio} /></TabsContent>
          <TabsContent value="tasks"><TaskBoard tasks={tasks} onStatusChange={handleStatusChange} /></TabsContent>
          <TabsContent value="calendar"><CalendarView events={events} /></TabsContent>
          <TabsContent value="memory"><MemoryLibrary memories={memories} /></TabsContent>
          <TabsContent value="portfolio"><PortfolioView portfolio={portfolio} /></TabsContent>
          <TabsContent value="search"><GlobalSearch /></TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
