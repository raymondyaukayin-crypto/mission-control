// Local data store - reads/writes to JSON files in the workspace
import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), '..', 'workspace')

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

// File paths
const TASKS_FILE = path.join(DATA_DIR, 'data', 'tasks.json')
const MEMORIES_FILE = path.join(DATA_DIR, 'data', 'memories.json')
const ACTIVITIES_FILE = path.join(DATA_DIR, 'data', 'activities.json')
const EVENTS_FILE = path.join(DATA_DIR, 'data', 'events.json')

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(DATA_DIR, 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Read JSON file
function readJSON<T>(filePath: string, defaultValue: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(data)
    }
  } catch (e) {
    console.error(`Error reading ${filePath}:`, e)
  }
  return defaultValue
}

// Write JSON file
function writeJSON<T>(filePath: string, data: T): void {
  try {
    ensureDataDir()
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
  } catch (e) {
    console.error(`Error writing ${filePath}:`, e)
  }
}

// Tasks
export function getTasks(): Task[] {
  return readJSON<Task[]>(TASKS_FILE, [])
}

export function saveTasks(tasks: Task[]): void {
  writeJSON(TASKS_FILE, tasks)
}

// Memories
export function getMemories(): Memory[] {
  return readJSON<Memory[]>(MEMORIES_FILE, [])
}

export function saveMemories(memories: Memory[]): void {
  writeJSON(MEMORIES_FILE, memories)
}

// Activities
export function getActivities(): Activity[] {
  return readJSON<Activity[]>(ACTIVITIES_FILE, [])
}

export function saveActivities(activities: Activity[]): void {
  writeJSON(ACTIVITIES_FILE, activities)
}

// Calendar Events
export function getEvents(): CalendarEvent[] {
  return readJSON<CalendarEvent[]>(EVENTS_FILE, [])
}

export function saveEvents(events: CalendarEvent[]): void {
  writeJSON(EVENTS_FILE, events)
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
