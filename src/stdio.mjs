#!/usr/bin/env node
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema, ListResourcesRequestSchema, ReadResourceRequestSchema, ListPromptsRequestSchema, GetPromptRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const remote = new Client({name:'losercore-stdio-bridge',version:'1.0.0'});
await remote.connect(new StreamableHTTPClientTransport(new URL('https://losercoreplaylist.com/mcp')));
const server = new Server({name:'losercore-playlist-bridge',version:'1.0.0'}, {capabilities:{tools:{},resources:{},prompts:{}}, instructions:'Public metadata and editable video drafts only. This bridge forwards inputs to https://losercoreplaylist.com/mcp; it cannot render or charge for media.'});
server.setRequestHandler(ListToolsRequestSchema, async r => remote.listTools(r.params));
server.setRequestHandler(CallToolRequestSchema, async r => remote.callTool(r.params));
server.setRequestHandler(ListResourcesRequestSchema, async r => remote.listResources(r.params));
server.setRequestHandler(ReadResourceRequestSchema, async r => remote.readResource(r.params));
server.setRequestHandler(ListPromptsRequestSchema, async r => remote.listPrompts(r.params));
server.setRequestHandler(GetPromptRequestSchema, async r => remote.getPrompt(r.params));
let closing = false;
async function close() {
  if (closing) return;
  closing = true;
  await Promise.allSettled([server.close(),remote.close()]);
}
process.once('SIGINT',()=>void close());
process.once('SIGTERM',()=>void close());
process.stdin.once('end',()=>void close());
await server.connect(new StdioServerTransport());
