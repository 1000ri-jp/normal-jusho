# @jusho/widget

Lightweight postal code to address auto-fill widget for Japanese addresses.
A zero-dependency, drop-in replacement for YubinBango.

**2 KB** minified | **1 KB** gzipped

## Installation

### CDN (script tag)

```html
<script src="https://cdn.jsdelivr.net/npm/@jusho/widget"></script>
```

### npm

```bash
npm install @jusho/widget
```

```js
import { Jusho } from '@jusho/widget';
```

## Usage

### Method 1: Data Attributes (YubinBango-compatible)

Add `data-jusho` attributes to your form fields. The widget auto-initializes on page load.

```html
<script src="https://cdn.jsdelivr.net/npm/@jusho/widget"></script>
<form>
  <input type="text" data-jusho="postal" placeholder="郵便番号">
  <input type="text" data-jusho="pref" placeholder="都道府県">
  <input type="text" data-jusho="city" placeholder="市区町村">
  <input type="text" data-jusho="town" placeholder="町域">
  <input type="text" data-jusho="address" placeholder="番地以降">
</form>
```

When the user types a 7-digit postal code (e.g. `1500002` or `150-0002`) into
the `data-jusho="postal"` field, the remaining fields are filled automatically.

Supported `data-jusho` values:

| Attribute | Filled with |
|-----------|-------------|
| `postal`  | Triggers lookup (attach to postal code input) |
| `pref`    | Prefecture (都道府県) |
| `city`    | City / ward / town / village (市区町村) |
| `town`    | Town area (町域) |
| `address` | Full normalized address |

### Method 2: Programmatic API

```html
<script src="https://cdn.jsdelivr.net/npm/@jusho/widget"></script>
<script>
  Jusho.attach('#postal-input', {
    onResolve: (result) => {
      document.querySelector('#pref').value = result.pref;
      document.querySelector('#city').value = result.city;
      document.querySelector('#town').value = result.town;
    },
    onError: (err) => {
      console.error('Lookup failed:', err);
    }
  });
</script>
```

### Method 3: ES Module import

```js
import { Jusho } from '@jusho/widget';

const detach = Jusho.attach('#postal-input', {
  onResolve: (result) => {
    console.log(result.pref, result.city, result.town);
  }
});

// Later: detach() to remove the listener
```

## API

### `Jusho.attach(selector, options?)`

Attach the auto-fill behavior to a postal code input.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `selector` | `string \| HTMLInputElement` | CSS selector or element reference |
| `options` | `JushoOptions` | Optional configuration |

**Returns:** `() => void` -- a cleanup function to detach the listener.

### `Jusho.init()`

Scan the DOM for `[data-jusho="postal"]` elements and attach listeners.
Called automatically on `DOMContentLoaded`.

### Options

```ts
interface JushoOptions {
  apiUrl?: string;     // Default: 'https://api.jusho.dev'
  debounce?: number;   // Default: 300 (ms)
  onResolve?: (result: JushoResult) => void;
  onError?: (error: Error) => void;
}
```

### Result Object

```ts
interface JushoResult {
  post_code: string;    // Postal code
  pref: string;         // Prefecture
  city: string;         // City / ward
  town: string;         // Town area
  address: string;      // Concatenated pref + city + town
  full_address: string; // Full normalized address from API
}
```

## Features

- Zero dependencies
- 2 KB minified, 1 KB gzipped
- UMD build (works with script tag, require, and import)
- Auto-detects 7-digit postal codes (with or without hyphen)
- Handles full-width digits (e.g. `１５０－０００２`)
- Debounced API calls (300ms default)
- Works with `<select>` elements for prefecture dropdowns
- Dispatches `input` and `change` events for framework compatibility
- Graceful error handling (silent on failure)

## Development

```bash
npm install
npm run build    # Build to dist/
npm run dev      # Build in watch mode
```

## License

MIT
