import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
const bridge = fileURLToPath(new URL('../src/stdio.mjs', import.meta.url));
const client = new Client({name:'losercore-release-smoke',version:'1.0.0'});
const transport = new StdioClientTransport({command:process.execPath,args:[bridge],stderr:'inherit'});
try {
  await client.connect(transport);
  const tools = (await client.listTools()).tools;
  assert.deepEqual(tools.map(t=>t.name).sort(),['get_creation_template','prepare_video_project','search_playlist']);
  assert.equal((await client.listResources()).resources.length,2);
  assert.equal((await client.listPrompts()).prompts.length,1);
  const selection = await client.callTool({name:'search_playlist',arguments:{query:'',limit:4}});
  assert.equal(selection.structuredContent.liveCatalogue,false);
  assert.equal(selection.structuredContent.tracks.length,4);
  const template = await client.callTool({name:'get_creation_template',arguments:{template:'beanie-loser'}});
  assert.equal(template.structuredContent.generationSubmitted,false);
  const draft = await client.callTool({name:'prepare_video_project',arguments:{tracks:[{title:'My original song',artist:'Me'}],language:'zh'}});
  assert.equal(draft.structuredContent.rendered,false);
  assert.equal(draft.structuredContent.creditsUsed,0);
  assert.equal(draft.structuredContent.project.tracks[0].title,'My original song');
  assert.match(draft.structuredContent.workspaceUrl,/\/zh\/playlist/);
  const invalid = await client.callTool({name:'prepare_video_project',arguments:{tracks:[]}});
  assert.equal(invalid.isError,true);
  console.log(JSON.stringify({ok:true,tools:tools.length,resources:2,prompts:1,draftPrepared:true,invalidRejected:true}));
} finally { await client.close(); }
