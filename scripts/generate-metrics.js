#!/usr/bin/env node
/**
 * Generate metrics from OpenClaw session data
 * Run: node scripts/generate-metrics.js
 */

const fs = require('fs');
const path = require('path');

const OPENCLAW_DIR = path.join(process.env.HOME, '.openclaw');
const OUTPUT_FILE = path.join(__dirname, '../public/data/metrics.json');

function findAllSessions() {
  const sessions = [];
  const agentsDir = path.join(OPENCLAW_DIR, 'agents');
  
  if (!fs.existsSync(agentsDir)) return sessions;
  
  for (const agent of fs.readdirSync(agentsDir)) {
    const sessionsFile = path.join(agentsDir, agent, 'sessions', 'sessions.json');
    if (fs.existsSync(sessionsFile)) {
      try {
        const data = JSON.parse(fs.readFileSync(sessionsFile, 'utf8'));
        for (const [key, session] of Object.entries(data)) {
          sessions.push({ agent, key, ...session });
        }
      } catch (e) {
        console.error(`Error reading ${sessionsFile}:`, e.message);
      }
    }
  }
  return sessions;
}

function parseSessionJsonl(filePath) {
  const records = [];
  if (!fs.existsSync(filePath)) return records;
  
  try {
    const lines = fs.readFileSync(filePath, 'utf8').split('\n').filter(Boolean);
    for (const line of lines) {
      try {
        const record = JSON.parse(line);
        records.push(record);
      } catch (e) {}
    }
  } catch (e) {}
  return records;
}

function generateMetrics() {
  const sessions = findAllSessions();
  const now = new Date();
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  
  let totalTokens = { input: 0, output: 0, total: 0 };
  let totalMessages = { user: 0, assistant: 0, total: 0, errors: 0 };
  let costByDay = {};
  let activityByDay = {};
  let latencies = [];
  
  for (const session of sessions) {
    // Aggregate token counts from session metadata
    totalTokens.input += session.inputTokens || 0;
    totalTokens.output += session.outputTokens || 0;
    totalTokens.total += session.totalTokens || 0;
    
    // Parse JSONL for detailed message data
    if (session.sessionFile && fs.existsSync(session.sessionFile)) {
      const records = parseSessionJsonl(session.sessionFile);
      for (const record of records) {
        // Only process message records
        if (record.type !== 'message' || !record.message) continue;
        
        const msg = record.message;
        const timestamp = record.timestamp || msg.timestamp;
        
        if (msg.role === 'user') totalMessages.user++;
        if (msg.role === 'assistant') totalMessages.assistant++;
        totalMessages.total++;
        
        // Track activity by day
        if (timestamp) {
          const day = new Date(timestamp).toISOString().split('T')[0];
          activityByDay[day] = (activityByDay[day] || 0) + 1;
        }
        
        // Track cost if available (in message.usage.cost.total)
        if (msg.usage?.cost?.total && timestamp) {
          const day = new Date(timestamp).toISOString().split('T')[0];
          costByDay[day] = (costByDay[day] || 0) + msg.usage.cost.total;
        }
        
        // Track tokens
        if (msg.usage) {
          totalTokens.input += msg.usage.input || 0;
          totalTokens.output += msg.usage.output || 0;
          totalTokens.total += msg.usage.totalTokens || 0;
        }
        
        // Track errors
        if (msg.stopReason === 'error') {
          totalMessages.errors++;
        }
      }
    }
  }
  
  // Calculate latency stats
  latencies.sort((a, b) => a - b);
  const avgLatency = latencies.length > 0 
    ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
    : 0;
  const p50 = latencies.length > 0 ? latencies[Math.floor(latencies.length * 0.5)] : 0;
  const p95 = latencies.length > 0 ? latencies[Math.floor(latencies.length * 0.95)] : 0;
  
  // Get last 7 days for chart
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now - i * 24 * 60 * 60 * 1000);
    const day = d.toISOString().split('T')[0];
    last7Days.push({
      date: day,
      label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      cost: costByDay[day] || 0,
      messages: activityByDay[day] || 0
    });
  }
  
  const totalCost = Object.values(costByDay).reduce((a, b) => a + b, 0);
  
  const metrics = {
    generatedAt: now.toISOString(),
    periodDays: 7,
    sessions: {
      total: sessions.length,
      active: sessions.filter(s => s.updatedAt > sevenDaysAgo.getTime()).length
    },
    messages: totalMessages,
    tokens: totalTokens,
    cost: {
      total: Math.round(totalCost * 100) / 100,
      byDay: costByDay,
      last7Days
    },
    latency: {
      avgMs: avgLatency,
      p50Ms: p50,
      p95Ms: p95,
      samples: latencies.length
    },
    activity: {
      byDay: activityByDay
    }
  };
  
  // Ensure output directory exists
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(metrics, null, 2));
  
  console.log('Metrics generated:', OUTPUT_FILE);
  console.log('Sessions:', metrics.sessions.total);
  console.log('Messages:', metrics.messages.total);
  console.log('Total cost:', '$' + metrics.cost.total);
  
  return metrics;
}

generateMetrics();
