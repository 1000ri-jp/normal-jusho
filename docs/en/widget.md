# Postal Code Widget Guide

The Jusho postal code widget provides a drop-in address auto-fill component for web forms. When a user enters a postal code, the widget automatically populates prefecture, city, and town fields.

## Quick Setup

Add the widget to any HTML form with a single script tag:

```html
<script src="https://cdn.jusho.dev/widget.js" defer></script>
```

Then mark your form fields with `data-jusho` attributes:

```html
<form>
  <label>
    Postal Code / 郵便番号
    <input type="text" data-jusho="postal-code" placeholder="100-0001" />
  </label>

  <label>
    Prefecture / 都道府県
    <input type="text" data-jusho="pref" readonly />
  </label>

  <label>
    City / 市区町村
    <input type="text" data-jusho="city" readonly />
  </label>

  <label>
    Town / 町域
    <input type="text" data-jusho="town" readonly />
  </label>
</form>
```

When the user types a 7-digit postal code (with or without hyphen), the widget calls the Jusho API and fills in the address fields automatically.

## Attributes

| Attribute Value | Description |
|-----------------|-------------|
| `data-jusho="postal-code"` | Input field for postal code entry (triggers lookup) |
| `data-jusho="pref"` | Populated with the prefecture name |
| `data-jusho="city"` | Populated with the city/ward/municipality |
| `data-jusho="town"` | Populated with the town area |
| `data-jusho="full"` | Populated with the full normalized address |
| `data-jusho="pref-kana"` | Populated with prefecture kana reading |
| `data-jusho="city-kana"` | Populated with city kana reading |
| `data-jusho="town-kana"` | Populated with town kana reading |
| `data-jusho="pref-code"` | Populated with the prefecture code |
| `data-jusho="city-code"` | Populated with the municipality code |

## Using with React

```tsx
import { useEffect, useRef } from 'react';

function PostalCodeForm() {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Load the widget script
    const script = document.createElement('script');
    script.src = 'https://cdn.jusho.dev/widget.js';
    script.defer = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  return (
    <form ref={formRef}>
      <input type="text" data-jusho="postal-code" />
      <input type="text" data-jusho="pref" readOnly />
      <input type="text" data-jusho="city" readOnly />
      <input type="text" data-jusho="town" readOnly />
    </form>
  );
}
```

## Using with the TypeScript SDK

For more control, use the SDK directly instead of the widget:

```typescript
import { Jusho } from 'jusho';

const jusho = new Jusho();

const postalInput = document.getElementById('postal') as HTMLInputElement;
const prefInput = document.getElementById('pref') as HTMLInputElement;
const cityInput = document.getElementById('city') as HTMLInputElement;

postalInput.addEventListener('input', async () => {
  const code = postalInput.value.replace(/-/g, '');
  if (code.length !== 7) return;

  try {
    const result = await jusho.normalize(code);
    prefInput.value = result.address.pref;
    cityInput.value = result.address.city;
  } catch {
    // Handle error
  }
});
```

## Using with the Python SDK (Server-side)

For server-side postal code lookup in a Django or Flask application:

```python
from jusho import Jusho

client = Jusho()

def lookup_postal_code(request):
    code = request.GET.get('code', '')
    try:
        result = client.normalize(code)
        return JsonResponse({
            'pref': result.address.pref,
            'city': result.address.city,
            'town': result.address.town,
        })
    except Exception:
        return JsonResponse({'error': 'Not found'}, status=404)
```

## Configuration

The widget can be configured with a global object before the script loads:

```html
<script>
  window.JushoConfig = {
    apiUrl: 'https://api.jusho.dev',  // Custom API endpoint
    debounce: 300,                     // Debounce delay in ms (default: 300)
    autoFocus: true,                   // Auto-focus next field after fill
    source: 'kenall',                  // Address variant: 'kenall' or 'kokudo'
  };
</script>
<script src="https://cdn.jusho.dev/widget.js" defer></script>
```

## Events

The widget dispatches custom events for integration with JavaScript frameworks:

```javascript
document.addEventListener('jusho:resolved', (e) => {
  console.log('Address resolved:', e.detail);
  // e.detail contains the full NormalizeResponse
});

document.addEventListener('jusho:error', (e) => {
  console.error('Lookup failed:', e.detail.error);
});
```

## Multiple Forms

The widget automatically scopes to the nearest `<form>` element, so multiple forms on the same page work independently:

```html
<form id="shipping">
  <input data-jusho="postal-code" />
  <input data-jusho="pref" />
  <input data-jusho="city" />
</form>

<form id="billing">
  <input data-jusho="postal-code" />
  <input data-jusho="pref" />
  <input data-jusho="city" />
</form>
```

## Styling

The widget does not inject any CSS. Your existing form styles apply as normal. You can add visual feedback using the CSS classes the widget adds:

```css
[data-jusho="postal-code"].jusho-loading {
  background-image: url('spinner.svg');
}

[data-jusho="postal-code"].jusho-error {
  border-color: red;
}

[data-jusho="postal-code"].jusho-resolved {
  border-color: green;
}
```
