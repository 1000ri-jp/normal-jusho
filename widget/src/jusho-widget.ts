/**
 * Jusho Widget - Postal code to address auto-fill
 * A lightweight, zero-dependency drop-in widget for Japanese postal code lookup.
 * Compatible with YubinBango-style data attributes.
 *
 * @license MIT
 * @version 1.0.0
 */

export interface JushoResult {
  post_code: string;
  pref: string;
  city: string;
  town: string;
  address: string;
  full_address: string;
}

export interface JushoOptions {
  /** API endpoint base URL */
  apiUrl?: string;
  /** Debounce delay in milliseconds */
  debounce?: number;
  /** Callback when address is resolved */
  onResolve?: (result: JushoResult) => void;
  /** Callback on error (silent by default) */
  onError?: (error: Error) => void;
}

const DEFAULT_API_URL = 'https://api.jusho.dev';
const DEFAULT_DEBOUNCE = 300;
const POSTAL_REGEX = /^(\d{3})-?(\d{4})$/;

/** Extract 7-digit postal code from input value */
function extractPostalCode(value: string): string | null {
  const cleaned = value.replace(/[\s\u3000]/g, '').replace(/[０-９]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) - 0xFEE0)
  );
  const match = cleaned.match(POSTAL_REGEX);
  return match ? match[1] + match[2] : null;
}

/** Debounce utility */
function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return ((...args: unknown[]) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as unknown as T;
}

/** Fetch address from Jusho API */
async function fetchAddress(code: string, apiUrl: string): Promise<JushoResult | null> {
  try {
    const res = await fetch(`${apiUrl}/postal/${code}`);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      post_code: data.post_code ?? data.postal_code ?? code,
      pref: data.pref ?? '',
      city: data.city ?? '',
      town: data.town ?? '',
      address: [data.pref ?? '', data.city ?? '', data.town ?? ''].join(''),
      full_address: data.full_address ?? [data.pref ?? '', data.city ?? '', data.town ?? ''].join(''),
    };
  } catch {
    return null;
  }
}

/** Fill form fields by data-jusho attribute within the same form/container */
function fillDataAttributes(postalInput: HTMLInputElement, result: JushoResult): void {
  const form = postalInput.closest('form') ?? postalInput.parentElement;
  if (!form) return;

  const fieldMap: Record<string, keyof JushoResult> = {
    pref: 'pref',
    city: 'city',
    town: 'town',
    address: 'full_address',
  };

  for (const [attr, key] of Object.entries(fieldMap)) {
    const el = form.querySelector<HTMLInputElement | HTMLSelectElement>(
      `[data-jusho="${attr}"]`
    );
    if (!el) continue;

    const value = result[key];
    if (el.tagName === 'SELECT') {
      const select = el as HTMLSelectElement;
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].text === value || select.options[i].value === value) {
          select.selectedIndex = i;
          break;
        }
      }
    } else {
      (el as HTMLInputElement).value = value;
    }
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

/** Attach the widget to a single postal code input */
function attachToInput(input: HTMLInputElement, options: JushoOptions = {}): () => void {
  const apiUrl = options.apiUrl ?? DEFAULT_API_URL;
  const delayMs = options.debounce ?? DEFAULT_DEBOUNCE;

  const handleInput = debounce(async () => {
    const code = extractPostalCode(input.value);
    if (!code) return;

    const result = await fetchAddress(code, apiUrl);
    if (!result) {
      if (options.onError) options.onError(new Error('Address not found'));
      return;
    }

    // If using data-attributes, fill sibling fields
    fillDataAttributes(input, result);

    // Call programmatic callback
    if (options.onResolve) options.onResolve(result);
  }, delayMs);

  input.addEventListener('input', handleInput);

  // Return cleanup function
  return () => {
    input.removeEventListener('input', handleInput);
  };
}

/** Main Jusho namespace */
const Jusho = {
  /**
   * Programmatically attach to a postal code input.
   * @param selector CSS selector or HTMLInputElement
   * @param options Configuration options
   * @returns Cleanup function to detach the listener
   */
  attach(
    selector: string | HTMLInputElement,
    options: JushoOptions = {}
  ): () => void {
    const el =
      typeof selector === 'string'
        ? document.querySelector<HTMLInputElement>(selector)
        : selector;

    if (!el) {
      console.warn(`[Jusho] Element not found: ${selector}`);
      return () => {};
    }

    return attachToInput(el, options);
  },

  /**
   * Scan the DOM for data-jusho="postal" inputs and auto-attach.
   * Called automatically on DOMContentLoaded.
   */
  init(): void {
    const postalInputs = document.querySelectorAll<HTMLInputElement>(
      '[data-jusho="postal"]'
    );
    postalInputs.forEach((input) => attachToInput(input));
  },
};

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Jusho.init());
  } else {
    // DOM already loaded (script loaded async/defer or dynamically)
    Jusho.init();
  }
}

// Expose to global scope for script-tag usage
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).Jusho = Jusho;
}

export default Jusho;
export { Jusho };
