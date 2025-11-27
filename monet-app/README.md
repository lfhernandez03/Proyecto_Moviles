# 💰 MONET - Gestión Inteligente de Finanzas Personales

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.76.5-blue.svg)
![Expo](https://img.shields.io/badge/Expo-52.0.11-black.svg)
![Firebase](https://img.shields.io/badge/Firebase-12.6.0-orange.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)

**Toma el control total de tus finanzas personales con MONET** - Una aplicación móvil moderna e intuitiva para gestionar ingresos, gastos, presupuestos y metas de ahorro.

[📱 Demo](#-demo) • [✨ Características](#-características-principales) • [🚀 Instalación](#-instalación) • [📖 Documentación](#-documentación)

</div>

---

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Tecnologías](#-tecnologías)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Scripts Disponibles](#-scripts-disponibles)
- [Deployment](#-deployment)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## ✨ Características Principales

### 🏠 Dashboard Inteligente
- **Vista general financiera** en tiempo real
- **Balance total** con opción de ocultar montos
- **Gráficos interactivos** de ingresos vs gastos
- **Resumen de transacciones recientes**
- **Progreso de metas** con indicadores visuales

### 💸 Gestión de Transacciones
- ✅ Registro rápido de **ingresos y gastos**
- 🏷️ **Categorización personalizada** con iconos y colores
- 📅 Organización por **fechas y períodos**
- 🔍 **Búsqueda y filtrado** avanzado
- 📊 Vista detallada con **historial completo**
- ✏️ **Edición y eliminación** de transacciones

### 💰 Presupuestos Inteligentes
- 📈 Creación de **presupuestos por categoría**
- ⏰ Períodos configurables: **semanal, mensual, anual**
- 🎯 **Seguimiento en tiempo real** del gasto
- ⚠️ **Alertas automáticas** al exceder el 90%
- 📊 **Gráficos de progreso** circular
- 🔄 **Reinicio automático** por período

### 🎯 Metas de Ahorro
- 🏆 Creación de **objetivos personalizados**
- 💵 **Montos objetivo** configurables
- 📅 **Fechas límite** opcionales
- 💰 **Aportaciones manuales** o automáticas
- 📈 **Progreso visual** con porcentajes
- 🎉 **Notificaciones de logros**
- ⏱️ **Alertas de vencimiento** cercano

### 🔔 Sistema de Notificaciones
- 📢 **Notificaciones en tiempo real**
- 💰 Alertas de **presupuesto excedido**
- 📅 Recordatorios de **metas próximas a vencer**
- ✅ Felicitaciones por **objetivos completados**
- 🔕 **Control granular** de preferencias
- 📱 Integración con notificaciones push

### ⚙️ Configuración y Personalización
- 👤 **Gestión de perfil** con foto
- 🔐 **Seguridad avanzada**: cambio de contraseña
- 🌙 **Modo oscuro** automático
- 🔒 **Privacidad**: ocultar montos
- 🔔 **Preferencias de notificaciones**
- 🌐 **Sincronización en la nube**

---

## 🛠️ Tecnologías

### Frontend
- **[React Native](https://reactnative.dev/)** `0.76.5` - Framework mobile
- **[Expo](https://expo.dev/)** `52.0.11` - Plataforma de desarrollo
- **[TypeScript](https://www.typescriptlang.org/)** `5.3.3` - Tipado estático
- **[Expo Router](https://docs.expo.dev/router/introduction/)** `4.0.11` - Navegación file-based

### Backend & Servicios
- **[Firebase](https://firebase.google.com/)** `12.6.0`
  - 🔐 **Authentication** - Autenticación de usuarios
  - 💾 **Firestore** - Base de datos en tiempo real
  - 🔄 **Cloud Functions** - Lógica del servidor

### UI/UX
- **[@expo/vector-icons](https://icons.expo.fyi/)** - Iconos (Ionicons)
- **[React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit)** - Gráficos
- **[Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)** - Selección de imágenes
- **AsyncStorage** - Persistencia local

### Arquitectura
- **MVVM Pattern** - Separación de lógica y UI
- **Custom Hooks** - Reutilización de lógica
- **Service Layer** - Abstracción de Firebase
- **Type-safe** - TypeScript en todo el proyecto

---

## 📋 Requisitos

- **Node.js** 18.x o superior
- **npm** o **yarn**
- **Expo CLI** (se instala automáticamente)
- **Cuenta de Firebase** (gratuita)
- **Android Studio** (para emulador Android) o **Xcode** (para iOS)
- **Expo Go** app (para testing en dispositivo físico)

---

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/lfhernandez03/Proyecto_Moviles.git
cd Proyecto_Moviles/monet-app
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=tu_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=tu_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=tu_measurement_id
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=tu_google_client_id
```

### 4. Configurar Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita **Authentication** con Email/Password y Google
3. Crea una base de datos **Firestore**
4. Descarga `google-services.json` (Android) y colócalo en la raíz
5. Despliega las reglas de Firestore:

```bash
firebase deploy --only firestore:rules
```

### 5. Iniciar la Aplicación

```bash
npx expo start
```

Opciones:
- Presiona `a` para abrir en **Android**
- Presiona `i` para abrir en **iOS**
- Escanea el QR con **Expo Go** en tu teléfono

---

## ⚙️ Configuración

### Firestore Rules

Las reglas de seguridad están en `firestore.rules`. Asegúrate de desplegarlas:

```bash
firebase deploy --only firestore:rules
```

### App Configuration

Edita `app.json` para personalizar:

```json
{
  "expo": {
    "name": "MONET",
    "slug": "monet-app",
    "version": "1.0.0",
    "scheme": "monet",
    "android": {
      "package": "com.tuempresa.monet"
    },
    "ios": {
      "bundleIdentifier": "com.tuempresa.monet"
    }
  }
}
```

---

## 📁 Estructura del Proyecto

```
monet-app/
├── app/                          # Rutas de la aplicación (Expo Router)
│   ├── (auth)/                   # Pantallas de autenticación
│   │   ├── index.tsx             # Login
│   │   ├── register.tsx          # Registro
│   │   └── recovery.tsx          # Recuperar contraseña
│   ├── (tabs)/                   # Pantallas principales con tabs
│   │   ├── home.tsx              # Dashboard
│   │   ├── transactions.tsx      # Transacciones
│   │   ├── budget.tsx            # Presupuestos
│   │   ├── goals.tsx             # Metas
│   │   ├── reports.tsx           # Reportes
│   │   └── settings.tsx          # Configuración
│   ├── budget/                   # Módulo de presupuestos
│   │   ├── [id].tsx              # Detalle de presupuesto
│   │   └── create-budget.tsx     # Crear presupuesto
│   ├── goals/                    # Módulo de metas
│   │   ├── [id].tsx              # Detalle de meta
│   │   └── create-goal.tsx       # Crear meta
│   ├── transaction/              # Módulo de transacciones
│   │   ├── [id].tsx              # Detalle de transacción
│   │   └── add-transaction.tsx   # Agregar transacción
│   ├── category/                 # Módulo de categorías
│   │   └── create-category.tsx   # Crear categoría
│   └── _layout.tsx               # Layout principal
│
├── src/
│   ├── models/                   # Modelos de datos TypeScript
│   │   ├── Budget.ts
│   │   ├── Category.ts
│   │   ├── Goal.ts
│   │   ├── Notification.ts
│   │   ├── Transaction.ts
│   │   └── UserSettings.ts
│   │
│   ├── services/                 # Capa de servicios
│   │   ├── auth/
│   │   │   └── AuthService.ts
│   │   └── firestore/
│   │       ├── BudgetService.ts
│   │       ├── CategoryService.ts
│   │       ├── GoalService.ts
│   │       ├── NotificationService.ts
│   │       ├── TransactionService.ts
│   │       └── UserSettingsService.ts
│   │
│   ├── viewmodels/               # ViewModels (MVVM Pattern)
│   │   ├── auth/
│   │   │   ├── UseLoginViewModel.ts
│   │   │   └── useRegisterViewModel.ts
│   │   ├── tabs/
│   │   │   ├── useHomeViewModel.ts
│   │   │   ├── useTransactionsViewModel.ts
│   │   │   ├── useBudgetViewModel.ts
│   │   │   └── useGoalsViewModel.ts
│   │   ├── budget/
│   │   │   └── useCreateBudgetViewModel.ts
│   │   ├── goals/
│   │   │   └── useCreateGoalViewModel.ts
│   │   └── categories/
│   │       └── useCreateCategoryViewModel.ts
│   │
│   └── utils/                    # Utilidades
│       ├── notificationHelper.ts
│       ├── currency.ts
│       └── validators.ts
│
├── components/                   # Componentes reutilizables
│   ├── ui/
│   │   ├── page-header.tsx
│   │   ├── summary-card.tsx
│   │   ├── search-bar.tsx
│   │   ├── transaction-card.tsx
│   │   ├── budget-card.tsx
│   │   ├── goal-card.tsx
│   │   └── empty-state.tsx
│   ├── themed-view.tsx
│   └── themed-text.tsx
│
├── assets/                       # Recursos estáticos
│   └── images/
│
├── firestore.rules              # Reglas de seguridad Firestore
├── FirebaseConfig.ts            # Configuración de Firebase
├── .env                         # Variables de entorno
├── app.json                     # Configuración de Expo
├── package.json                 # Dependencias
└── tsconfig.json                # Configuración de TypeScript
```

---

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm start              # Inicia el servidor de desarrollo
npm run android        # Abre en emulador Android
npm run ios            # Abre en simulador iOS
npm run web            # Abre en navegador

# Build
npm run build          # Crea build de producción
eas build              # Build con EAS (Expo Application Services)

# Testing
npm test               # Ejecuta tests
npm run lint           # Linter de código

# Deployment
firebase deploy        # Despliega reglas de Firestore
eas submit            # Sube a tiendas (Play Store/App Store)
```

---

## 📦 Deployment

### Build de Testing (APK)

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login en Expo
eas login

# Configurar proyecto
eas build:configure

# Build APK
eas build --platform android --profile preview
```

### Build de Producción

```bash
# Android (AAB para Play Store)
eas build --platform android --profile production

# iOS (para App Store)
eas build --platform ios --profile production
```

### Submit a Tiendas

```bash
# Google Play Store
eas submit --platform android

# Apple App Store
eas submit --platform ios
```

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 👥 Autores

- **Luis Fernando Hernández** - [@lfhernandez03](https://github.com/lfhernandez03)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

---

## 🙏 Agradecimientos

- **Expo Team** por la increíble plataforma de desarrollo
- **Firebase** por los servicios backend
- **React Native Community** por las librerías y soporte
- **Ionicons** por los iconos

---

<div align="center">

### **¡Comienza tu viaje financiero con Monet!**

[⭐ Da una estrella al proyecto](https://github.com/lfhernandez03/Proyecto_Moviles)

</div>
