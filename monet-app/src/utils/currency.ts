/**
 * Utilidades para formateo de moneda en pesos colombianos (COP)
 */

/**
 * Formatea un número como moneda en pesos colombianos
 * @param amount - Monto a formatear
 * @param showCurrency - Si se debe mostrar el símbolo de la moneda (predeterminado: true)
 * @returns String formateado como "$ 1.234.567" o "$ 1.234.567 COP"
 */
export const formatCurrency = (
  amount: number,
  showCurrency: boolean = true
): string => {
  const formatted = Math.abs(amount).toLocaleString("es-CO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  if (showCurrency) {
    return `$ ${formatted} COP`;
  }

  return `$ ${formatted}`;
};

/**
 * Formatea un monto con signo (+ para ingresos, - para gastos)
 * @param amount - Monto a formatear
 * @param type - Tipo de transacción ('income' o 'expense')
 * @returns String formateado con signo
 */
export const formatSignedCurrency = (
  amount: number,
  type: "income" | "expense"
): string => {
  const sign = type === "income" ? "+" : "-";
  const formatted = Math.abs(amount).toLocaleString("es-CO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return `${sign}$ ${formatted}`;
};

/**
 * Formatea un número como entrada de texto (sin símbolo de moneda)
 * @param value - Valor a formatear
 * @returns String formateado con separadores de miles
 */
export const formatInputValue = (value: string): string => {
  // Remover caracteres no numéricos
  const numericValue = value.replace(/[^\d]/g, "");

  if (!numericValue) return "";

  // Formatear con separadores de miles
  return parseInt(numericValue, 10).toLocaleString("es-CO");
};

/**
 * Convierte un string formateado a número
 * @param formattedValue - Valor formateado con separadores
 * @returns Número sin formato
 */
export const parseFormattedValue = (formattedValue: string): number => {
  const numericValue = formattedValue.replace(/[^\d]/g, "");
  return parseInt(numericValue, 10) || 0;
};
