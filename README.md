# 🎨 Front Loro - Frontend Documentation

Documentación técnica y manual de arquitectura para el cliente Web de **Proyecto Loro**, desarrollado con **Next.js 16**, **React 19**, **Tailwind CSS v4** y **TypeScript**.

---

## 📋 Índice
1. [Visión General](#1-visión-general)
2. [Tecnologías Principales](#2-tecnologías-principales)
3. [Estructura del Proyecto](#3-estructura-del-proyecto)
4. [Variables de Entorno](#4-variables-de-entorno)
5. [Gestión de Sesión y Autenticación](#5-gestión-de-sesión-y-autenticación)
6. [Capa de Servicios y API Interceptor](#6-capa-de-servicios-y-api-interceptor)
7. [Hooks Personalizados](#7-hooks-personalizados)
8. [Vistas y Rutas del Sistema](#8-vistas-y-rutas-del-sistema)
9. [Componentes Reutilizables](#9-componentes-reutilizables)
10. [Comandos de Ejecución](#10-comandos-de-ejecución)

---

## 1. Visión General

El frontend de **Proyecto Loro** proporciona una interfaz moderna, responsiva e intuitiva para administrar el ciclo de vida completo de los equipos informáticos de la empresa:
- Registro e inventario de dispositivos.
- Asignación de equipos a empleados por departamento y rol.
- Trazabilidad y motivos de baja o retiro de activos.
- Administración de usuarios del sistema y control de acceso.

---

## 2. Tecnologías Principales

- **Framework Web**: Next.js (`v16.2.12`) con **App Router**.
- **Biblioteca UI**: React (`v19.2.8`).
- **Estilos**: Tailwind CSS (`v4.0`), `@tailwindcss/postcss`, Base UI / Shadcn UI components.
- **Iconografía**: `lucide-react` y `bootstrap-icons`.
- **Formularios y Validación**: `react-hook-form` + `zod` + `@hookform/resolvers`.
- **Cliente HTTP**: `axios` (`v1.19.0`).

---

## 3. Estructura del Proyecto

```
front-loro/
├── app/                        # Next.js App Router
│   ├── dashboard/              # Panel principal y módulos
│   │   ├── assignments/        # Vista de asignaciones
│   │   ├── categories/         # Vista de categorías
│   │   ├── departments/        # Vista de departamentos
│   │   ├── devices/            # Vista de inventario de equipos
│   │   ├── employees/          # Vista de empleados
│   │   ├── roles/              # Vista de roles laborales
│   │   ├── users/              # Vista de administración de usuarios
│   │   ├── layout.tsx          # Layout con Sidebar y Header persistentes
│   │   └── page.tsx            # Dashboard home (Métricas y KPIs)
│   ├── global.css              # Configuración de Tailwind CSS y temas
│   ├── layout.tsx              # Root Layout
│   ├── login.schema.ts         # Esquema de validación Zod para el Login
│   └── page.tsx                # Página de Iniciar Sesión (Login)
├── components/                 # Componentes de UI y layout
│   ├── Header.tsx              # Barra superior con info de usuario y cerrar sesión
│   ├── Sidebar.tsx             # Menú de navegación lateral dinámico
│   ├── auth/                   # Componentes de protección de autenticación
│   └── ui/                     # Componentes UI atomic (Spinners, Modal, Botones)
├── hooks/                      # Hooks personalizados de React
│   ├── useCategory.ts
│   ├── useCurrentUser.ts
│   ├── useDepartment.ts
│   ├── useLogin.ts
│   ├── useModals.ts
│   ├── usePermissions.ts
│   └── useRole.ts
├── services/                   # Capa de consumo de API REST
│   ├── api.service.ts          # Instancia Axios con Interceptores
│   ├── assignment.service.ts
│   ├── auth.service.ts
│   ├── category.service.ts
│   ├── department.service.ts
│   ├── device.service.ts
│   ├── employee.service.ts
│   ├── role.service.ts
│   └── user.service.ts
├── types/                      # Declaración de interfaces y tipos TypeScript
│   ├── assignment.types.ts
│   ├── auth.types.ts
│   ├── category.types.ts
│   ├── department.types.ts
│   ├── devices.types.ts
│   ├── employees.types.ts
│   ├── models.types.ts
│   ├── roles.types.ts
│   └── users.types.ts
├── public/                     # Archivos estáticos e imágenes (logos, favicon)
├── package.json
└── tsconfig.json
```

---

## 4. Variables de Entorno

Crea un archivo `.env.local` en la raíz de `front-loro`:

```env
NEXT_PUBLIC_BACK_URL=http://localhost:3000/api
```

---

## 5. Gestión de Sesión y Autenticación

- **Guardado de Credenciales**: Tras un inicio de sesión exitoso, el JWT (`token`) y los datos del perfil (`user`) se almacenan en el `localStorage` del navegador.
- **Inyección de Token**: El servicio `api.service.ts` inyecta automáticamente la cabecera `Authorization: Bearer <token>` en cada solicitud saliente.
- **Manejo de Sesión Expirada**: Si el backend retorna un código `401 Unauthorized`, el interceptor limpia el `localStorage` y redirige al usuario automáticamente a la página de login (`/`).

---

## 6. Capa de Servicios y API Interceptor

Todos los módulos del frontend consumen endpoints a través de clases/objetos de servicio dedicados en `services/`:

- **`AuthService`**: Maneja `login(data)` y métodos auxiliares (`logout`, `getToken`, `getCurrentUser`, `isAuthenticated`).
- **`DeviceService`**: Consultas paginadas, filtrado por categorías/departamento, creación, modificación, baja con motivo e historial.
- **`EmployeeService`**: Gestión de empleados, búsquedas por Cédula (`ci`), baja con motivo e historial.
- **`AssignmentService`**: Creación de asignaciones equipo-empleado y desvinculación/liberación de equipos.
- **`UserService`**: Gestión de cuentas de usuario, asignación de roles de acceso y cambio de contraseñas.
- **`DepartmentService` / `RoleService` / `CategoryService`**: Mantenimiento de tablas maestras.

---

## 7. Hooks Personalizados

- **`useLogin()`**: Maneja el estado de carga, errores del servidor y la lógica de submit del formulario de inicio de sesión.
- **`useCurrentUser()`**: Obtiene la información del usuario autenticado actualmente en sesión.
- **`usePermissions()`**: Evalúa si el usuario en sesión posee los permisos o rol adecuado para visualizar ciertas opciones o ejecutar acciones en el dashboard.
- **`useModals()`**: Estado centralizado para apertura/cierre de ventanas modales de creación, edición o baja.
- **`useDepartment()`, `useRole()`, `useCategory()`**: Hooks reactivos para cargar listas desplegables de selección en formularios modal.

---

## 8. Vistas y Rutas del Sistema

| Ruta | Pantalla | Descripción |
| :--- | :--- | :--- |
| `/` | **Login** | Formulario de credenciales con validación Zod y visibilidad de contraseña. |
| `/dashboard` | **Resumen General** | Tarjetas KPI de equipos totales, asignados, disponibles, empleados y departamentos. |
| `/dashboard/devices` | **Inventario de Equipos** | Lista tabulada de equipos con búsqueda, filtros por categoría/departamento, estados (`Disponible` / `Asignado`), modales de registro/edición/baja y modal de historial. |
| `/dashboard/employees` | **Empleados** | Directorio de empleados con Cédula de Identidad, rol y departamento. Permite registro, actualización y baja. |
| `/dashboard/assignments` | **Asignaciones** | Control de asignación de dispositivos a personal activo. Registra fecha de inicio y liberación del equipo. |
| `/dashboard/departments` | **Departamentos** | Mantenimiento de áreas de la empresa. |
| `/dashboard/roles` | **Roles de Trabajo** | Cargos de empleados asociados a sus respectivos departamentos. |
| `/dashboard/categories` | **Categorías** | Tipos de hardware (Laptops, Teléfonos Móviles, Monitores, etc.). |
| `/dashboard/users` | **Usuarios del Sistema** | Gestión de acceso a la plataforma y reseteo de contraseñas. |

---

## 9. Componentes Reutilizables

- **`Sidebar`**: Menú de navegación lateral con indicación visual de la ruta activa y control responsivo.
- **`Header`**: Muestra el nombre y rol del usuario logueado, botón de perfil y botón de cierre de sesión.
- **`Spinner`**: Indicador de carga animado para botones y tablas.

---

## 10. Comandos de Ejecución

### Modo Desarrollo
```bash
npm run dev
```
Abre `http://localhost:3001` en tu navegador.

### Compilar para Producción
```bash
npm run build
```

### Iniciar Servidor de Producción
```bash
npm start
```

### Ejecutar Linter
```bash
npm run lint
```
