export const FILTERS = {
	ALL: 'all',
	ACTIVE: 'active',
	COMPLETED: 'completed',
} as const;

export type FilterType = (typeof FILTERS)[keyof typeof FILTERS];

export const ITEM_TYPES = {
	TODO: 'todo',
} as const;

export const SERVICE_TYPES = {
	Api: 'api',
	Local: 'local',
} as const;

export const MOBILE_BREAKPOINT = 800;
