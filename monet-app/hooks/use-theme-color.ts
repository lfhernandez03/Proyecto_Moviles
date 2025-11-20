/**
 * Hook para obtener colores del tema.
 * Esta aplicación usa únicamente tema claro.
 */

import { Colors } from '@/constants/theme';

export function useThemeColor(
  props: { light?: string },
  colorName: keyof typeof Colors.light 
) {
  // Siempre usar tema claro
  const theme = 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
