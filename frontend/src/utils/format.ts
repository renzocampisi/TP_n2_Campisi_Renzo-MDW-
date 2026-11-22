// Funciones chicas para mostrar datos lindos en pantalla.

// "2014-08-21T00:00:00.000Z" -> "21/8/2014". timeZone UTC evita que se corra un dia por la zona horaria.
export const formatDate = (isoDate: string): string =>
  new Date(isoDate).toLocaleDateString("es-AR", { timeZone: "UTC" });

// 122 -> "2 h 2 min"
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours > 0 ? `${hours} h ${rest} min` : `${rest} min`;
};
