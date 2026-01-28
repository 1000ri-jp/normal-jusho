# MCP (Model Context Protocol) Integration

Jusho provides a built-in MCP server that allows AI assistants such as Claude, Cursor, and other MCP-compatible clients to normalize Japanese addresses directly through natural language.

## What is MCP?

The Model Context Protocol (MCP) is a standard for connecting AI assistants to external tools and data sources. With Jusho's MCP integration, an AI assistant can:

- Normalize Japanese addresses on demand
- Look up postal codes
- Resolve business office names to addresses
- Identify building addresses with per-floor postal codes

## Client Configuration

### Claude Desktop

Add to your Claude Desktop MCP configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "jusho": {
      "url": "https://api.jusho.dev/mcp"
    }
  }
}
```

### Cursor

Add to your Cursor MCP settings:

```json
{
  "mcpServers": {
    "jusho": {
      "url": "https://api.jusho.dev/mcp"
    }
  }
}
```

### Generic MCP Client

Any MCP-compatible client that supports Streamable HTTP transport can connect to:

```
https://api.jusho.dev/mcp
```

## Available Tools

Once connected, the MCP server exposes the following tool:

### `normalize_address`

Normalize a Japanese address string and return structured data.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `address` | string | Japanese address, business name, or building name |

**Matching order:**

1. Business office dictionary (e.g., "宮内庁", "日本銀行")
2. Large building dictionary (e.g., "六本木ヒルズ森タワー30F")
3. Standard address (MLIT + Japan Post data)

**Returns:**

A structured dict with the following top-level keys:

- `address` -- Normalized address components (pref, city, town, banchi, etc.)
- `address_variants` -- Source-specific representations (kokudo vs kenall)
- `kana` -- Katakana readings
- `codes` -- Postal code, prefecture code, city code, town code
- `geo` -- Latitude and longitude
- `meta` -- Match type, version info

Returns `None` if the address cannot be matched.

## Usage Examples

Once configured, you can ask your AI assistant questions like:

- "What is the postal code for 東京都千代田区千代田1-1?"
- "Normalize this address: 大阪府大阪市北区梅田1-1-1"
- "Look up the address for 宮内庁"
- "What is the postal code for 六本木ヒルズ森タワー 30th floor?"
- "Convert this address to structured data: 渋谷区道玄坂1-2-3"

The AI assistant will call the `normalize_address` tool and return the structured result.

## Checking MCP Status

You can verify that MCP is available on the server:

```bash
curl https://api.jusho.dev/mcp-status
```

```json
{
  "available": true,
  "endpoint": "/mcp",
  "server_name": "jusho",
  "client_config": {
    "mcpServers": {
      "jusho": {
        "url": "https://api.jusho.dev/mcp"
      }
    }
  }
}
```

## Self-Hosting

If you run your own Jusho instance, the MCP endpoint is automatically available at `/mcp` when the `mcp` extra is installed:

```bash
pip install address-kokudo-kenall[all]
```

Or run the MCP server standalone (stdio transport):

```bash
address-mcp-server
```

This is useful for local development or when you want to connect a local AI client without going through the public API.

## Technical Details

- **Transport**: Streamable HTTP (mounted at `/mcp` on the FastAPI app)
- **Server name**: `jusho`
- **Protocol**: MCP (Model Context Protocol)
- **Security**: DNS rebinding protection enabled; allowed hosts include `api.jusho.dev` and `localhost`
- **Dependencies**: Requires the `mcp` Python package (`pip install mcp[cli]>=1.4.1`)

## Troubleshooting

### MCP not available

If `/mcp-status` returns `"available": false`, the MCP dependencies may not be installed. Install with:

```bash
pip install address-kokudo-kenall[all]
```

### Connection refused

Ensure your MCP client is configured with the correct URL (`https://api.jusho.dev/mcp`) and supports Streamable HTTP transport.

### First request is slow

The first MCP tool call triggers dictionary data loading, which may take several seconds. Subsequent calls are fast. You can warm up the server by calling `POST /warmup` on the REST API.
