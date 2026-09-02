import fs from 'fs';
import path from 'path';

export type AdminConfigSection =
  | 'economy'
  | 'game-modes'
  | 'battles'
  | 'ranked'
  | 'dungeon'
  | 'battle-pass'
  | 'shop'
  | 'announcements'
  | 'events'
  | 'reward-bundles'
  | 'server'
  | 'settings';

const DATA_DIR = path.join(process.cwd(), 'server', 'data');
const SECTIONS: AdminConfigSection[] = [
  'economy', 'game-modes', 'battles', 'ranked', 'dungeon', 'battle-pass',
  'shop', 'announcements', 'events', 'reward-bundles', 'server', 'settings',
];

const DEFAULTS: Record<AdminConfigSection, unknown> = {
  economy: { astraMultiplier: 1, dailyLoginReward: 500, matchWinReward: 250, cratePrices: { shard: 1000, character: 2500 } },
  'game-modes': { enabled: { classic: true, ranked: true, dungeon: true, battlePass: true }, maintenanceMessage: '' },
  battles: { turnTimeoutSeconds: 45, maxTeamSize: 5, rankedEnabled: true, rewards: { winAstra: 250, winXp: 100 } },
  ranked: { season: 'Season 1', enabled: true, placementMatches: 10, ratingFloor: 0, winRating: 25, lossRating: 20 },
  dungeon: { enabled: true, maxFloor: 50, energyPerRun: 1, rewardsMultiplier: 1 },
  'battle-pass': { enabled: true, season: 'Season 1', levels: 100, xpPerLevel: 1000, premiumPrice: 950 },
  shop: { enabled: true, refreshHours: 24, featuredSlots: 4, purchaseLimitPerDay: 10 },
  announcements: [],
  events: [],
  'reward-bundles': [],
  server: { maintenanceMode: false, announcement: '', maxPlayersPerRoom: 10 },
  settings: { registrationEnabled: true, allowGuestPlay: false, telemetryEnabled: true },
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype;
}

function validateValue(value: unknown, depth = 0): string | null {
  if (depth > 6) return 'Configuration nesting is too deep.';
  if (value === null || typeof value === 'boolean') return null;
  if (typeof value === 'string') return value.length <= 2000 ? null : 'Configuration text is too long.';
  if (typeof value === 'number') return Number.isFinite(value) && Math.abs(value) <= 1000000000 ? null : 'Configuration number is out of range.';
  if (Array.isArray(value)) {
    if (value.length > 500) return 'Configuration arrays may contain at most 500 entries.';
    for (const item of value) {
      const error = validateValue(item, depth + 1);
      if (error) return error;
    }
    return null;
  }
  if (isPlainObject(value)) {
    if (Object.keys(value).length > 100) return 'Configuration objects may contain at most 100 keys.';
    for (const [key, item] of Object.entries(value)) {
      if (!/^[A-Za-z0-9_.-]{1,80}$/.test(key)) return 'Configuration contains an invalid key.';
      const error = validateValue(item, depth + 1);
      if (error) return error;
    }
    return null;
  }
  return 'Configuration contains an unsupported value.';
}

const SECTION_KEYS: Record<AdminConfigSection, string[] | null> = {
  economy: ['astraMultiplier', 'dailyLoginReward', 'matchWinReward', 'cratePrices'],
  'game-modes': ['enabled', 'maintenanceMessage'],
  battles: ['turnTimeoutSeconds', 'maxTeamSize', 'rankedEnabled', 'rewards'],
  ranked: ['season', 'enabled', 'placementMatches', 'ratingFloor', 'winRating', 'lossRating'],
  dungeon: ['enabled', 'maxFloor', 'energyPerRun', 'rewardsMultiplier'],
  'battle-pass': ['enabled', 'season', 'levels', 'xpPerLevel', 'premiumPrice'],
  shop: ['enabled', 'refreshHours', 'featuredSlots', 'purchaseLimitPerDay'],
  announcements: null,
  events: null,
  'reward-bundles': null,
  server: ['maintenanceMode', 'announcement', 'maxPlayersPerRoom'],
  settings: ['registrationEnabled', 'allowGuestPlay', 'telemetryEnabled'],
};

function validateSection(section: AdminConfigSection, value: unknown): string | null {
  const baseError = validateValue(value);
  if (baseError) return baseError;
  if (['announcements', 'events', 'reward-bundles'].includes(section)) {
    if (!Array.isArray(value)) return 'This configuration section must be a list.';
    return null;
  }
  if (!isPlainObject(value)) return 'This configuration section must be an object.';
  const keys = SECTION_KEYS[section] || [];
  const unknown = Object.keys(value).filter(key => !keys.includes(key));
  if (unknown.length) return `Unknown ${section} configuration key: ${unknown[0]}.`;
  const numberRules: Record<string, [number, number]> = {
    astraMultiplier: [0, 100], dailyLoginReward: [0, 1000000], matchWinReward: [0, 1000000],
    turnTimeoutSeconds: [5, 300], maxTeamSize: [1, 8], placementMatches: [0, 20],
    ratingFloor: [0, 100000], winRating: [0, 1000], lossRating: [0, 1000],
    maxFloor: [1, 1000], energyPerRun: [0, 100], rewardsMultiplier: [0, 100],
    levels: [1, 500], xpPerLevel: [1, 1000000], premiumPrice: [0, 1000000],
    refreshHours: [1, 720], featuredSlots: [0, 100], purchaseLimitPerDay: [0, 1000],
    maxPlayersPerRoom: [1, 1000],
  };
  for (const [key, [min, max]] of Object.entries(numberRules)) {
    if (key in value) {
      const candidate = (value as Record<string, unknown>)[key];
      if (typeof candidate !== 'number' || !Number.isFinite(candidate) || candidate < min || candidate > max) {
        return `${key} must be a number between ${min} and ${max}.`;
      }
    }
  }
  if ('cratePrices' in value) {
    const prices = (value as Record<string, unknown>).cratePrices;
    if (!isPlainObject(prices) || !['shard', 'character'].every(key => typeof prices[key] === 'number' && Number.isFinite(prices[key]) && prices[key] >= 0 && prices[key] <= 1000000)) {
      return 'cratePrices must contain valid shard and character prices.';
    }
  }
  if ('rewards' in value) {
    const rewards = (value as Record<string, unknown>).rewards;
    if (!isPlainObject(rewards) || !['winAstra', 'winXp'].every(key => typeof rewards[key] === 'number' && Number.isFinite(rewards[key]) && rewards[key] >= 0 && rewards[key] <= 1000000)) {
      return 'rewards must contain valid winAstra and winXp values.';
    }
  }
  if ('enabled' in value && !isPlainObject((value as Record<string, unknown>).enabled)) return 'enabled must be an object.';
  for (const key of ['maintenanceMessage', 'season', 'announcement']) {
    if (key in value && typeof (value as Record<string, unknown>)[key] !== 'string') return `${key} must be text.`;
  }
  return null;
}

export class AdminConfigStore {
  private values = new Map<AdminConfigSection, unknown>();

  constructor() {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    for (const section of SECTIONS) {
      const file = this.fileFor(section);
      try {
        const raw = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
        const parsed = raw && Object.prototype.hasOwnProperty.call(raw, 'value') ? raw.value : (raw || clone(DEFAULTS[section]));
        const safeValue = validateSection(section, parsed) ? clone(DEFAULTS[section]) : parsed;
        this.values.set(section, safeValue);
        if (!fs.existsSync(file) || safeValue !== parsed) this.write(section, safeValue);
      } catch {
        const fallback = clone(DEFAULTS[section]);
        this.values.set(section, fallback);
        this.write(section, fallback);
      }
    }
  }

  private fileFor(section: AdminConfigSection): string {
    return path.join(DATA_DIR, `admin_${section.replace(/-/g, '_')}.json`);
  }

  public isSection(value: string): value is AdminConfigSection {
    return SECTIONS.includes(value as AdminConfigSection);
  }

  public get(section: AdminConfigSection): unknown {
    return clone(this.values.get(section));
  }

  public all(): Record<string, unknown> {
    return Object.fromEntries(SECTIONS.map(section => [section, this.get(section)]));
  }

  public replace(section: AdminConfigSection, value: unknown): { success: boolean; previous?: unknown; value?: unknown; error?: string } {
    const error = validateSection(section, value);
    if (error) return { success: false, error };
    const previous = this.get(section);
    this.values.set(section, clone(value));
    this.write(section, value);
    return { success: true, previous, value: this.get(section) };
  }

  public append(section: AdminConfigSection, value: unknown): { success: boolean; previous?: unknown; value?: unknown; error?: string } {
    if (!['announcements', 'events', 'reward-bundles'].includes(section)) {
      return { success: false, error: 'This configuration section does not support POST.' };
    }
    const error = validateValue(value);
    if (error || !isPlainObject(value)) return { success: false, error: error || 'Posted configuration must be an object.' };
    const current = this.get(section);
    if (!Array.isArray(current) || current.length >= 500) return { success: false, error: 'Configuration list is full.' };
    const previous = this.get(section);
    const next = [...current, value];
    const sectionError = validateSection(section, next);
    if (sectionError) return { success: false, error: sectionError };
    this.values.set(section, next);
    this.write(section, next);
    return { success: true, previous, value: this.get(section) };
  }

  private write(section: AdminConfigSection, value: unknown): void {
    fs.writeFileSync(this.fileFor(section), JSON.stringify({ lastUpdated: new Date().toISOString(), value }, null, 2), 'utf8');
  }
}

export const adminConfigStore = new AdminConfigStore();
