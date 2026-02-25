import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), '..', 'workspace', 'data')

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// Get file path
function getFilePath(filename: string) {
  return path.join(DATA_DIR, filename)
}

// GET handler - read data
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  
  if (!type) {
    return NextResponse.json({ error: 'Type required' }, { status: 400 })
  }
  
  const filePath = getFilePath(`${type}.json`)
  
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8')
      return NextResponse.json(JSON.parse(data))
    }
    return NextResponse.json([])
  } catch (e) {
    return NextResponse.json({ error: 'Failed to read' }, { status: 500 })
  }
}

// POST handler - write data
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  
  if (!type) {
    return NextResponse.json({ error: 'Type required' }, { status: 400 })
  }
  
  const filePath = getFilePath(`${type}.json`)
  
  try {
    const body = await request.json()
    ensureDataDir()
    fs.writeFileSync(filePath, JSON.stringify(body, null, 2), 'utf-8')
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to write' }, { status: 500 })
  }
}
