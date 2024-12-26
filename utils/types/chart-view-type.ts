export enum ChartViewType {
	kanban = "kanban",
	gantt = "gantt",
	list = "list",
}

// Create a reverse lookup object for efficient string-to-enum mapping
export const ChartViewTypeLookup = Object.values(ChartViewType).reduce((lookup, value) => {
	lookup[value] = value;
	return lookup;
}, {} as { [key: string]: ChartViewType });

// Type guard to check if a string is a valid ChartViewType
export function isChartViewType(value?: string): value is ChartViewType {
	if (!value) return false;

	return value in ChartViewTypeLookup;
}
