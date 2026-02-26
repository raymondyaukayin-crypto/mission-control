const fs = require('fs');
const path = require('path');

// Hardcoded paths to workspace
const workspaceRoot = 'C:\\Users\\Raymond\\.openclaw\\workspace';
const reportsDir = path.join(workspaceRoot, 'reports');
const dataDir = path.join(workspaceRoot, 'data', 'weike_investment');
const memoryDir = path.join(workspaceRoot, 'memory');

function readDirRecursive(dir, extensions = ['.md']) {
  const results = [];
  
  if (!fs.existsSync(dir)) {
    console.log('Dir not found:', dir);
    return results;
  }
  
  console.log('Reading:', dir);
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      results.push(...readDirRecursive(fullPath, extensions));
    } else if (extensions.some(ext => item.endsWith(ext))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const relativePath = path.relative(workspaceRoot, fullPath).replace(/\\/g, '/');
      results.push({
        name: item.replace('.md', ''),
        path: relativePath,
        content: content.substring(0, 5000),
        type: relativePath.startsWith('reports/') ? 'report' : 
              relativePath.startsWith('data/') ? 'data' : 
              relativePath.startsWith('memory/') ? 'memory' : 'other'
      });
    }
  }
  
  return results;
}

// Collect all reports
console.log('Starting report generation...');
const allReports = [
  ...readDirRecursive(reportsDir),
  ...readDirRecursive(dataDir),
  ...readDirRecursive(memoryDir)
];

// Add active-tasks.md
const activeTasksPath = path.join(workspaceRoot, 'active-tasks.md');
if (fs.existsSync(activeTasksPath)) {
  allReports.push({
    name: '主動任務清單',
    path: 'active-tasks.md',
    content: fs.readFileSync(activeTasksPath, 'utf8').substring(0, 5000),
    type: 'other'
  });
}

// Write to public folder
const outputPath = path.join(__dirname, '..', 'public', 'reports-data.json');
// Write to file with UTF-8 BOM for proper Chinese display
const utf8Bom = Buffer.from([0xEF, 0xBB, 0xBF]);
fs.writeFileSync(outputPath, Buffer.concat([utf8Bom, Buffer.from(JSON.stringify(allReports, null, 2))]));

console.log(`Generated ${outputPath} with ${allReports.length} reports`);
