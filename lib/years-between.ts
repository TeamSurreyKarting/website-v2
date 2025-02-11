export function generateYearsBetween(startYear: number, endYear: number) {
  const endDate = endYear || new Date().getFullYear();
  let years = [];

  for (let i = startYear; i <= endDate; i++) {
    years.push(startYear);
    startYear++;
  }

  return years;
}
