#!/usr/bin/env python3
import re

with open(r'C:\Users\Raymond\.openclaw\workspace\mission-control\src\app\page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    ('Research Bitcoin', '研究比特幣投資機會'),
    ('Analyze BTC market', '分析比特幣市場'),
    ('FIRE Review', 'FIRE組合review'),
    ('Weekly portfolio review', '每週檢視投資組合表現'),
    ('Baby Checklist', '寶寶用品清單'),
    ('Newborn essentials', '整理初生嬰兒所需物品'),
    ('Investment', '投資'),
    ('Family', '家庭'),
    ('System', '系統'),
    ('Bitcoin Analysis Done', '比特幣投資分析完成'),
    ('Complete BTC research, suggest 3-5% allocation', '完成比特幣投資機會研究，報告已存檔。建議配置3-5%資產'),
    ('Mission Control Launch', 'Mission Control系統建立'),
    ('Built Mission Control Dashboard', '建立Mission Control儀表板'),
    ('Task Done', '完成任務'),
    ('Bitcoin report completed', '比特幣投資研究報告已完成並存檔'),
    ('Memory Added', '新增記憶'),
    ('Recorded BTC conclusions', '記錄比特幣投資分析結論'),
    ('System Built', '建立系統'),
    ('Created Mission Control', '創建Mission Control儀表板'),
    ('Weekly Portfolio Review', '每週投資組合review'),
    ('BTC Price Check', '比特幣價格檢查'),
    ('Bitcoin', '比特幣'),
    ('Total Assets', '總資產'),
    ('24h Change', '24小時變動'),
    ('Holdings', '持倉數量'),
    ('Cash Level', '現金水平'),
    ('Recent Activities', '最近活動'),
    ('Daily Brief', '每日簡報'),
    ('Tasks Today', '今日任務'),
    ('Schedule', '日程'),
    ('Search memories', '搜尋記憶'),
    ('Search tasks, memories, activities', '搜尋任務、記憶、活動'),
    ('To Do', '待完成'),
    ('Done', '已完成'),
]

for eng, chi in replacements:
    content = content.replace(eng, chi)

with open(r'C:\Users\Raymond\.openclaw\workspace\mission-control\src\app\page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done!')
