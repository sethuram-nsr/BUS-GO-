/**
 * Formats a numeric value into Indian Rupee currency string (e.g. ₹650).
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculates estimated arrival time given departure (HH:mm) and duration in minutes.
 */
export function estimateArrivalTime(departure: string, travelDurationMinutes = 420): string {
  const [hours, minutes] = departure.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return '--:--';

  const totalMinutes = (hours * 60 + minutes + travelDurationMinutes) % (24 * 60);
  const arrHours = Math.floor(totalMinutes / 60);
  const arrMins = totalMinutes % 60;

  return `${String(arrHours).padStart(2, '0')}:${String(arrMins).padStart(2, '0')}`;
}

/**
 * Formats duration in hours and minutes (e.g. "7h 00m").
 */
export function formatDuration(minutes = 420): string {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins > 0 ? `${mins}m` : '00m'}`;
}
