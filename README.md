# Losercore Playlist · MCP + Agent Skill

Public integration tools for [Losercore Playlist](https://losercoreplaylist.com): starter-track discovery, original scene prompts and editable playlist-video drafts. The browser workspace supports free local editing with your own audio and text/LRC.

## Remote MCP (recommended)

**Streamable HTTP:** `https://losercoreplaylist.com/mcp`  
**Authentication:** none. No API keys or environment variables.

```sh
claude mcp add --transport http losercore-playlist https://losercoreplaylist.com/mcp
```

For other clients, add the URL as a remote Streamable HTTP MCP server. [Setup and feature guide](https://losercoreplaylist.com/developers/mcp).

[Official MCP Registry record](https://registry.modelcontextprotocol.io/v0/servers/com.losercoreplaylist%2Fcreative-tools/versions/1.0.0): `com.losercoreplaylist/creative-tools` v1.0.0. `server.json` describes this existing remote service; it is not an npm package manifest.

## Install the Agent Skill

```sh
npx skills add nullurl/losercore-agent-tools --skill losercore-playlist
```

[Read the skill first](skills/losercore-playlist/SKILL.md). It contains instructions, public reference links and a dependency-free Node.js request helper. It supports agents implementing the SKILL.md format, including Codex and Claude Code. The skill does not automatically connect an MCP server; use the connection above or its bundled helper.

Try: “Prepare a melancholy three-song Losercore playlist-video draft in Chinese. Use original captions and give me the JSON to import into the free video workspace.”

## Tools

| Tool | Inputs | Result |
|---|---|---|
| `search_playlist` | query, limit | Song/artist/mood metadata from four starter tracks, dated 2026-10-21 |
| `get_creation_template` | beanie-loser or turn-on-the-playlist | Original adult-character visual scene prompt |
| `prepare_video_project` | 1–12 title/artist pairs; optional three original captions and en/zh/id language | Editable JSON draft and browser workspace URL |

Two resources expose starter metadata and workspace guidance; `plan_playlist_video` supplies a mood-based planning prompt. Discover current input schemas through tools/list. A live Spotify catalogue, music files and song lyrics are not provided.

## JSON-to-browser handoff

1. Call `prepare_video_project` with song titles/artists and three short original captions, or use its defaults.
2. Save **only the returned `project` object** as the returned filename.
3. Open `workspaceUrl` and use **Import AI project** to load the file.
4. Add audio/text or LRC you have permission to publish, review timing, and export locally. Save your work before refreshing. MP4 codec support depends on the browser; Chrome/Edge is recommended.

Preparing a draft is free and costs 0 credits. It does not render an MP4 or submit a cloud AI job.

## Optional stdio bridge

This repository includes a runnable bridge for MCP clients restricted to stdio. It forwards tools, resources and prompts to the same hosted public service; it is not an offline copy of the website backend.

```sh
git clone https://github.com/nullurl/losercore-agent-tools.git
cd losercore-agent-tools
npm ci --ignore-scripts
npm start
```

Node.js 22.12+ is required. Configure your stdio client with `command: "node"` and `args: ["/absolute/path/losercore-agent-tools/src/stdio.mjs"]`. No npm package has been published under this name. Network access to losercoreplaylist.com is required. A Dockerfile is included for directory inspection and stdio execution.

## Public product facts

[llms.txt](https://losercoreplaylist.com/llms.txt) links to interlinked Markdown references for [features](https://losercoreplaylist.com/agents/features.md), [pricing](https://losercoreplaylist.com/agents/pricing.md), [data scope](https://losercoreplaylist.com/agents/data.md), [site structure](https://losercoreplaylist.com/agents/site-map.md) and [MCP](https://losercoreplaylist.com/agents/mcp.md). [llms-full.txt](https://losercoreplaylist.com/llms-full.txt) combines the reference material.

Local editing is free. Optional cloud AI is separate and uses credits. Fetch the live pricing reference for current amounts and purchase availability rather than assuming all displayed plans are on sale. Neither this skill nor this MCP exposes account balances, purchases, private media or cloud-generation credentials.

## Privacy, support and license

Tool inputs pass through your chosen agent host and the Losercore service. The bridge/helper sends no API keys, local media or account cookies. Supplied titles/captions are processed for the request; this integration does not save them as a website project. Do not send secrets or private media. This public repository contains integration tooling only; it does not contain the private website source or deployment credentials.

[Privacy](https://losercoreplaylist.com/privacy) · [Terms](https://losercoreplaylist.com/terms) · Support: joyforjoker43@gmail.com  
MIT for the files in this repository. The license does not grant rights to third-party recordings, lyrics, brands, or the separately hosted website implementation.

## Verify

```sh
npm test
node skills/losercore-playlist/scripts/mcp-call.mjs tools/list
```

The smoke test uses the official MCP SDK to connect through the local stdio bridge, lists tools/resources/prompts, prepares an original draft and confirms invalid inputs fail. It calls only the public free endpoint.
