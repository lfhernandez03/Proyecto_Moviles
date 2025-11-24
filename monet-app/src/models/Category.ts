// src/models/Category.ts
export interface Category {
  id?: string;
  name: string;
  displayName: string;
  color: string;
  type: "expense" | "income" | "both";
  isCustom: boolean;
  userId?: string;
  createdAt?: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  {
    name: "food",
    displayName: "Alimentación",
    color: "#F59E0B",
    type: "expense",
    isCustom: false,
  },
  {
    name: "transport",
    displayName: "Transporte",
    color: "#3B82F6",
    type: "expense",
    isCustom: false,
  },
  {
    name: "shopping",
    displayName: "Compras",
    color: "#EF4444",
    type: "expense",
    isCustom: false,
  },
  {
    name: "entertainment",
    displayName: "Entretenimiento",
    color: "#8B5CF6",
    type: "expense",
    isCustom: false,
  },
  {
    name: "bills",
    displayName: "Servicios",
    color: "#EC4899",
    type: "expense",
    isCustom: false,
  },
  {
    name: "health",
    displayName: "Salud",
    color: "#EF4444",
    type: "expense",
    isCustom: false,
  },
  {
    name: "education",
    displayName: "Educación",
    color: "#10B981",
    type: "expense",
    isCustom: false,
  },
  {
    name: "salary",
    displayName: "Salario",
    color: "#10B981",
    type: "income",
    isCustom: false,
  },
  {
    name: "freelance",
    displayName: "Freelance",
    color: "#3B82F6",
    type: "income",
    isCustom: false,
  },
  {
    name: "investment",
    displayName: "Inversiones",
    color: "#8B5CF6",
    type: "income",
    isCustom: false,
  },
  {
    name: "other",
    displayName: "Otro",
    color: "#6B7280",
    type: "both",
    isCustom: false,
  },
];
