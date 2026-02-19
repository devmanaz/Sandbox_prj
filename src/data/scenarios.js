export const scenarios = [
    {
        id: 'ecommerce-tax',
        title: 'E-Commerce Tax Engine',
        description: 'Fix the tax calculation logic in a multi-file shopping cart system. The current implementation only returns the subtotal.',
        difficulty: 'Medium',
        badgeColor: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
        files: {
            'cart.js': {
                name: 'cart.js',
                language: 'javascript',
                content: `export class ShoppingCart {
  constructor(taxRate = 0.08) {
    this.items = [];
    this.taxRate = taxRate;
  }

  addItem(item) {
    this.items.push(item);
  }

  // BUG: This only returns subtotal, ignoring taxRate
  calculateTotal() {
    const subtotal = this.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    return subtotal;
  }
}`
            },
            'constants.js': {
                name: 'constants.js',
                language: 'javascript',
                content: `export const DEFAULT_TAX_RATE = 0.08;\nexport const MAX_ITEMS = 100;`
            },
            'README.md': {
                name: 'README.md',
                language: 'markdown',
                content: '# Tax Calculation Scenario\n\nUpdate `cart.js` to include the tax rate in the final total. Formula: subtotal * (1 + taxRate).'
            }
        },
        constraints: ['Final total must include tax.', 'Ensure subtotal is calculated first.'],
        testCheck: (code) => code.includes('this.taxRate') && (code.includes('*') || code.includes('+'))
    },
    {
        id: 'auth-session',
        title: 'Secure Session Management',
        description: 'Build a session validation layer using separate logic and constant modules. Prevent unauthorized access for expired tokens.',
        difficulty: 'Hard',
        badgeColor: 'bg-red-500/10 text-red-500 border border-red-500/20',
        files: {
            'sessionManager.js': {
                name: 'sessionManager.js',
                language: 'javascript',
                content: `import { SESSION_TIMEOUT } from './config.js';\n\nexport function isSessionActive(session) {\n  if (!session) return false;\n  // TODO: Check if session.createdAt + SESSION_TIMEOUT > Date.now()\n  return true;\n}`
            },
            'config.js': {
                name: 'config.js',
                language: 'javascript',
                content: `export const SESSION_TIMEOUT = 3600000; // 1 hour in ms`
            },
            'README.md': {
                name: 'README.md',
                language: 'markdown',
                content: '# Session Security\n\nImplement the expiration check in `sessionManager.js` using the timeout from `config.js`.'
            }
        },
        constraints: ['Verify session existence.', 'Check timestamp against current time.'],
        testCheck: (code) => code.includes('SESSION_TIMEOUT') && code.includes('Date.now()')
    },
    {
        id: 'inventory-alerts',
        title: 'Intelligent Stock Alerts',
        description: 'Refactor the notification system to use a data-driven threshold model instead of hardcoded values.',
        difficulty: 'Easy',
        badgeColor: 'bg-green-500/10 text-green-500 border border-green-500/20',
        files: {
            'notifier.js': {
                name: 'notifier.js',
                language: 'javascript',
                content: `import { THRESHOLDS } from './data.js';\n\nexport function shouldAlert(itemType, quantity) {\n  // TODO: Get threshold from THRESHOLDS map and compare\n  return false;\n}`
            },
            'data.js': {
                name: 'data.js',
                language: 'javascript',
                content: `export const THRESHOLDS = {\n  electronics: 5,\n  clothing: 10,\n  food: 20\n};`
            },
            'README.md': {
                name: 'README.md',
                language: 'markdown',
                content: '# Inventory Alerts\n\nConnect the notifier to the data module to check specific category thresholds.'
            }
        },
        constraints: ['Use THRESHOLDS object.', 'Return true if quantity <= threshold.'],
        testCheck: (code) => code.includes('THRESHOLDS[') || code.includes('THRESHOLDS.')
    },
    {
        id: 'api-error-boundary',
        title: 'Graceful API Degrader',
        description: 'Implement a resilience layer that falls back to localized mock data when the primary API client fails.',
        difficulty: 'Hard',
        badgeColor: 'bg-red-500/10 text-red-500 border border-red-500/20',
        files: {
            'apiClient.js': {
                name: 'apiClient.js',
                language: 'javascript',
                content: `import { MOCK_DATA } from './fallback.js';\n\nexport async function getSafeData(url) {\n  try {\n    const res = await fetch(url);\n    return await res.json();\n  } catch (err) {\n    // TODO: Return MOCK_DATA instead of throwing\n    throw err;\n  }\n}`
            },
            'fallback.js': {
                name: 'fallback.js',
                language: 'javascript',
                content: `export const MOCK_DATA = { status: "cached", items: [] };`
            }
        },
        constraints: ['Use try-catch block.', 'Import and return fallback data.'],
        testCheck: (code) => code.includes('catch') && code.includes('MOCK_DATA')
    },
    {
        id: 'theme-orchestrator',
        title: 'Multi-Context Theme Manager',
        description: 'Coordinate system preferences and user overrides across a stylesheet and a logic controller.',
        difficulty: 'Medium',
        badgeColor: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
        files: {
            'themeController.js': {
                name: 'themeController.js',
                language: 'javascript',
                content: `import { THEMES } from './palette.js';\n\nexport function getThemeClass(isDark) {\n  // TODO: Return THEMES.dark if isDark is true, else THEMES.light\n  return "";\n}`
            },
            'palette.js': {
                name: 'palette.js',
                language: 'javascript',
                content: `export const THEMES = {\n  dark: "bg-slate-900 text-white",\n  light: "bg-white text-slate-900"\n};`
            }
        },
        constraints: ['Use external palette mapping.', 'Support conditional toggle.'],
        testCheck: (code) => code.includes('THEMES.dark') && code.includes('THEMES.light')
    },
    {
        id: 'data-transformer-pro',
        title: 'Schema-Driven Transformer',
        description: 'Map raw external data into a validated internal schema using shared transformation rules.',
        difficulty: 'Medium',
        badgeColor: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
        files: {
            'transformer.js': {
                name: 'transformer.js',
                language: 'javascript',
                content: `import { FIELD_MAP } from './schema.js';\n\nexport function transform(rawData) {\n  return rawData.map(item => {\n    // TODO: Rename keys based on FIELD_MAP\n    return item;\n  });\n}`
            },
            'schema.js': {
                name: 'schema.js',
                language: 'javascript',
                content: `export const FIELD_MAP = {\n  external_id: "id",\n  user_name: "name",\n  email_address: "email"\n};`
            }
        },
        constraints: ['Iterate through mappings.', 'Do not mutate original objects.'],
        testCheck: (code) => code.includes('FIELD_MAP') && code.includes('.map')
    },
    {
        id: 'rbac-gatekeeper',
        title: 'Distributed RBAC Guard',
        description: 'Check nested permissions across a multi-role architecture to protect specific system actions.',
        difficulty: 'Hard',
        badgeColor: 'bg-red-500/10 text-red-500 border border-red-500/20',
        files: {
            'guard.js': {
                name: 'guard.js',
                language: 'javascript',
                content: `import { PERMISSIONS } from './roles.js';\n\nexport function hasAccess(role, action) {\n  const allowed = PERMISSIONS[role] || [];\n  // TODO: Check if action exists in allowed array\n  return false;\n}`
            },
            'roles.js': {
                name: 'roles.js',
                language: 'javascript',
                content: `export const PERMISSIONS = {\n  admin: ["create", "edit", "delete", "view"],\n  editor: ["edit", "view"],\n  guest: ["view"]\n};`
            }
        },
        constraints: ['Support dynamic role lookup.', 'Handle undefined roles gracefully.'],
        testCheck: (code) => code.includes('PERMISSIONS[') && code.includes('.includes(')
    },
    {
        id: 'search-efficiency',
        title: 'Multi-File Debouncer',
        description: 'Implement a high-performance debouncer for search triggers that interacts with an external API module.',
        difficulty: 'Hard',
        badgeColor: 'bg-red-500/10 text-red-500 border border-red-500/20',
        files: {
            'debounce.js': {
                name: 'debounce.js',
                language: 'javascript',
                content: `export function createDebouncer(fn, delay) {\n  let timeoutId;\n  return (...args) => {\n    // TODO: Clear previous timeout and set new one\n  };\n}`
            },
            'searchUI.js': {
                name: 'searchUI.js',
                language: 'javascript',
                content: `import { createDebouncer } from './debounce.js';\n\n// Usage example for tests\nexport const debouncedSearch = createDebouncer(() => console.log("Searching..."), 300);`
            }
        },
        constraints: ['Use closures for state.', 'Handle rapid event firing.'],
        testCheck: (code) => code.includes('clearTimeout') && code.includes('setTimeout')
    },
    {
        id: 'finance-wizard',
        title: 'Compound Interest Studio',
        description: 'Build a financial calculation module that uses separate interest rate and compounding factor configurations.',
        difficulty: 'Medium',
        badgeColor: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
        files: {
            'calc.js': {
                name: 'calc.js',
                language: 'javascript',
                content: `import { FACTORS } from './settings.js';\n\nexport function calculateGrowth(p, r, t, frequency) {\n  const n = FACTORS[frequency] || 1;\n  // Formula: A = P(1 + r/n)^(nt)\n  return p * (1 + r);\n}`
            },
            'settings.js': {
                name: 'settings.js',
                language: 'javascript',
                content: `export const FACTORS = {\n  monthly: 12,\n  quarterly: 4,\n  annually: 1\n};`
            }
        },
        constraints: ['Support multiple compounding frequencies.', 'Correct math implementation.'],
        testCheck: (code) => code.includes('Math.pow') || code.includes('**')
    },
    {
        id: 'seo-slug-generator',
        title: 'SEO Slug Workflows',
        description: 'Cleanse and transform website titles into production-ready URLs using a regex-based cleansing module.',
        difficulty: 'Easy',
        badgeColor: 'bg-green-500/10 text-green-500 border border-green-500/20',
        files: {
            'slugger.js': {
                name: 'slugger.js',
                language: 'javascript',
                content: `import { CLEAN_REGEX } from './patterns.js';\n\nexport function toSlug(text) {\n  // TODO: Lowercase, replace non-alphanumeric (using CLEAN_REGEX) with '-', and trim\n  return text;\n}`
            },
            'patterns.js': {
                name: 'patterns.js',
                language: 'javascript',
                content: `export const CLEAN_REGEX = /[^a-z0-9]+/g;`
            }
        },
        constraints: ['Use regex for replacement.', 'Clean start/end dashes.'],
        testCheck: (code) => code.includes('CLEAN_REGEX') && code.includes('replace')
    },
    {
        id: 'inventory-processor',
        title: 'Order Status Workflow',
        description: 'Manage complex order state transitions across a dedicated processor and a status mapping file.',
        difficulty: 'Medium',
        badgeColor: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
        files: {
            'orderProcessor.js': {
                name: 'orderProcessor.js',
                language: 'javascript',
                content: `import { STATES } from './statusCodes.js';\n\nexport function advanceOrder(currentStatus) {\n  // TODO: Return next available state from STATES workflow\n  return currentStatus;\n}`
            },
            'statusCodes.js': {
                name: 'statusCodes.js',
                language: 'javascript',
                content: `export const STATES = [\n  "PENDING",\n  "PROCESSING",\n  "SHIPPED",\n  "DELIVERED"\n];`
            }
        },
        constraints: ['Find index of current state.', 'Handle "DELIVERED" boundary.'],
        testCheck: (code) => code.includes('STATES.indexOf') || code.includes('STATES[')
    },
    {
        id: 'file-utility-kit',
        title: 'Readable Size Formatter',
        description: 'Coordinate byte-to-string conversions using a unit-map file to support KB, MB, and GB precision.',
        difficulty: 'Medium',
        badgeColor: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
        files: {
            'formatter.js': {
                name: 'formatter.js',
                language: 'javascript',
                content: `import { UNITS } from './units.js';\n\nexport function formatSize(bytes) {\n  // TODO: Iterate units and divide by 1024 until correct tier found\n  return bytes + " " + UNITS[0];\n}`
            },
            'units.js': {
                name: 'units.js',
                language: 'javascript',
                content: `export const UNITS = ["B", "KB", "MB", "GB", "TB"];`
            }
        },
        constraints: ['Loop through units.', 'Limit to 2 decimal places.'],
        testCheck: (code) => code.includes('1024') && code.includes('UNITS[')
    },
    {
        id: 'config-merger-v2',
        title: 'Recursive Config Union',
        description: 'Merge deep JSON configurations from multiple sources into a single unified application state.',
        difficulty: 'Hard',
        badgeColor: 'bg-red-500/10 text-red-500 border border-red-500/20',
        files: {
            'merger.js': {
                name: 'merger.js',
                language: 'javascript',
                content: `export function deepMerge(target, source) {\n  // TODO: Recursively merge keys if both are objects\n  return { ...target, ...source }; \n}`
            },
            'defaults.js': {
                name: 'defaults.js',
                language: 'javascript',
                content: `export const APP_DEFAULTS = {\n  api: { timeout: 1000, retry: true },\n  ui: { theme: "dark" }\n};`
            }
        },
        constraints: ['Handle nested objects.', 'Avoid overwriting entire branches.'],
        testCheck: (code) => code.includes('typeof') && code.includes('deepMerge')
    },
    {
        id: 'color-parser-studio',
        title: 'Hex to RGB Converter',
        description: 'Implement a parsing workflow that converts HEX strings into RGB objects using bitwise or string-slice logic.',
        difficulty: 'Medium',
        badgeColor: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
        files: {
            'parser.js': {
                name: 'parser.js',
                language: 'javascript',
                content: `export function hexToRgb(hex) {\n  // TODO: Extract R, G, B components from #RRGGBB\n  return { r: 0, g: 0, b: 0 };\n}`
            },
            'README.md': {
                name: 'README.md',
                language: 'markdown',
                content: '# Color Logic\n\nConvert a 6-digit hex string into its numeric RGB components.'
            }
        },
        constraints: ['Handle optional # prefix.', 'Return numeric values.'],
        testCheck: (code) => code.includes('parseInt') && code.includes('16')
    },
    {
        id: 'security-analyzer',
        title: 'Password Pulse Gauge',
        description: 'Create a security analyzer that scores passwords based on complex patterns defined in a shared policy file.',
        difficulty: 'Medium',
        badgeColor: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
        files: {
            'analyzer.js': {
                name: 'analyzer.js',
                language: 'javascript',
                content: `import { POLICY } from './policy.js';\n\nexport function checkSecurity(pass) {\n  let score = 0;\n  // TODO: Check against each POLICY regex\n  return score;\n}`
            },
            'policy.js': {
                name: 'policy.js',
                language: 'javascript',
                content: `export const POLICY = [\n  { name: "length", regex: /.{8,}/ },\n  { name: "digit", regex: /[0-9]/ },\n  { name: "special", regex: /[^a-zA-Z0-9]/ }\n];`
            }
        },
        constraints: ['Iterate policy array.', 'Increment score for each match.'],
        testCheck: (code) => code.includes('POLICY.forEach') || code.includes('POLICY.reduce')
    },
    {
        id: 'data-dedupe-engine',
        title: 'Unique Entity Resolver',
        description: 'Deduplicate complex data lists based on a unique identifier key specified in a settings module.',
        difficulty: 'Medium',
        badgeColor: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
        files: {
            'deduper.js': {
                name: 'deduper.js',
                language: 'javascript',
                content: `export function removeDuplicates(list, uniqueId) {\n  // TODO: Filter list to keep only first occurrence of uniqueId\n  return list;\n}`
            },
            'testData.js': {
                name: 'testData.js',
                language: 'javascript',
                content: `export const SAMPLE_USERS = [\n  { id: 1, name: "A" },\n  { id: 1, name: "A" },\n  { id: 2, name: "B" }\n];`
            }
        },
        constraints: ['Maintain original order.', 'Efficient handling.'],
        testCheck: (code) => code.includes('Map') || code.includes('Set') || code.includes('filter')
    },
    {
        id: 'time-relative-pro',
        title: 'Social Media Timestamps',
        description: 'Convert timestamps into "ago" strings using a multi-threshold interval mapping system.',
        difficulty: 'Hard',
        badgeColor: 'bg-red-500/10 text-red-500 border border-red-500/20',
        files: {
            'timeAgo.js': {
                name: 'timeAgo.js',
                language: 'javascript',
                content: `import { INTERVALS } from './thresholds.js';\n\nexport function getTimeAgo(date) {\n  const seconds = Math.floor((Date.now() - date) / 1000);\n  // TODO: Find correct interval and return it\n  return "just now";\n}`
            },
            'thresholds.js': {
                name: 'thresholds.js',
                language: 'javascript',
                content: `export const INTERVALS = [\n  { label: "year", seconds: 31536000 },\n  { label: "month", seconds: 2592000 },\n  { label: "day", seconds: 86400 },\n  { label: "hour", seconds: 3600 },\n  { label: "minute", seconds: 60 }\n];`
            }
        },
        constraints: ['Iterate through intervals.', 'Return plural variants if count > 1.'],
        testCheck: (code) => code.includes('INTERVALS.find') || code.includes('INTERVALS.forEach')
    },
    {
        id: 'form-validation-kit',
        title: 'Cross-Field Form Validator',
        description: 'Implement a validation engine that checks correlations between multiple fields (e.g., password and confirmation).',
        difficulty: 'Medium',
        badgeColor: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
        files: {
            'formValidator.js': {
                name: 'formValidator.js',
                language: 'javascript',
                content: `export function validateFields(fields) {\n  // fields = { password, confirmPassword }\n  // TODO: Check if they match\n  return { valid: true };\n}`
            },
            'messages.js': {
                name: 'messages.js',
                language: 'javascript',
                content: `export const ERRORS = {\n  mismatch: "Passwords must match",\n  tooShort: "Too short"\n};`
            }
        },
        constraints: ['Use external error messages.', 'Check field equality.'],
        testCheck: (code) => code.includes('ERRORS.') && code.includes('===')
    },
    {
        id: 'url-query-builder',
        title: 'Dynamic URL Assembler',
        description: 'Construct complex URL strings with query parameters using a shared base configuration module.',
        difficulty: 'Easy',
        badgeColor: 'bg-green-500/10 text-green-500 border border-green-500/20',
        files: {
            'assembler.js': {
                name: 'assembler.js',
                language: 'javascript',
                content: `import { BASE_URL } from './config.js';\n\nexport function buildUrl(endpoint, params) {\n  // TODO: Append params as query string to BASE_URL + endpoint\n  return BASE_URL + endpoint;\n}`
            },
            'config.js': {
                name: 'config.js',
                language: 'javascript',
                content: `export const BASE_URL = "https://api.sandbox.com/v1";`
            }
        },
        constraints: ['Handle multiple parameters.', 'Proper URL encoding.'],
        testCheck: (code) => code.includes('?') && (code.includes('URLSearchParams') || code.includes('&'))
    },
    {
        id: 'localization-manager',
        title: 'Multi-Language Store',
        description: 'Build a translation engine that switches between language bundles based on a locale code.',
        difficulty: 'Medium',
        badgeColor: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
        files: {
            'i18n.js': {
                name: 'i18n.js',
                language: 'javascript',
                content: `import { BUNDLES } from './locales.js';\n\nexport function translate(locale, key) {\n  // TODO: Return nested value from BUNDLES[locale]\n  return key;\n}`
            },
            'locales.js': {
                name: 'locales.js',
                language: 'javascript',
                content: `export const BUNDLES = {\n  en: { welcome: "Welcome" },\n  es: { welcome: "Bienvenido" }\n};`
            }
        },
        constraints: ['Support deep nesting.', 'Fallback if key missing.'],
        testCheck: (code) => code.includes('BUNDLES[locale]') || code.includes('BUNDLES.')
    }
];
