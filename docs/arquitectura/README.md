# Arquitectura del Sistema - Itti Talent Dashboard

Esta sección documenta la arquitectura técnica de la plataforma **Itti Talent Dashboard**, incluyendo stack tecnológico, estructura de base de datos, componentes principales y decisiones de diseño.

---

## 🏗️ Stack Tecnológico

### Frontend
- **Framework**: React 19
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Routing**: Wouter (lightweight router)
- **State Management**: React Query (TanStack Query)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Tipografía**: Urbanist (Google Fonts)

### Backend
- **Runtime**: Node.js 22.13.0
- **Framework**: Express 4
- **API Layer**: tRPC 11 (type-safe APIs)
- **Serialization**: SuperJSON (mantiene tipos Date, Map, Set)
- **Authentication**: Manus OAuth

### Base de Datos
- **DBMS**: MySQL / TiDB
- **ORM**: Drizzle ORM 0.44
- **Migraciones**: Drizzle Kit

### DevOps y Tooling
- **Package Manager**: pnpm 10.4.1
- **Build Tool**: Vite 7
- **TypeScript**: 5.9.3
- **Testing**: Vitest 2.1.4
- **Linting**: Prettier 3.6.2

---

## 📊 Modelo de Datos

### Diagrama Entidad-Relación (Simplificado)

```
┌─────────────┐       ┌──────────────────┐       ┌─────────────────┐
│   users     │       │    employees     │       │  competencies   │
├─────────────┤       ├──────────────────┤       ├─────────────────┤
│ id (PK)     │       │ id (PK)          │       │ id (PK)         │
│ openId      │◄──────│ userId (FK)      │       │ name            │
│ name        │       │ name             │       │ category        │
│ email       │       │ email            │       │ description     │
│ role        │       │ role             │       └─────────────────┘
└─────────────┘       │ department       │                │
                      │ seniority        │                │
                      │ bootcamp         │                │
                      │ careerGoal       │                │
                      └──────────────────┘                │
                               │                          │
                               │                          │
                               ▼                          ▼
                      ┌──────────────────────────────────────┐
                      │     employee_competencies            │
                      ├──────────────────────────────────────┤
                      │ id (PK)                              │
                      │ employeeId (FK) ──────────────────┐  │
                      │ competencyId (FK) ────────────────┼──┘
                      │ currentLevel                       │
                      │ potentialLevel                     │
                      │ status                             │
                      │ lastEvaluated                      │
                      └──────────────────────────────────────┘

┌──────────────────┐       ┌─────────────────────┐
│  opportunities   │       │  development_plans  │
├──────────────────┤       ├─────────────────────┤
│ id (PK)          │       │ id (PK)             │
│ title            │       │ employeeId (FK)     │───┐
│ type             │       │ objective           │   │
│ industry         │       │ strengths           │   │
│ timing           │       │ emergingAreas       │   │
│ developmentLevel │       │ latentPotential     │   │
└──────────────────┘       │ limitingFactors     │   │
                           │ status              │   │
                           └─────────────────────┘   │
                                                     │
                           ┌──────────────────────┐  │
                           │ talent_detectors     │  │
                           ├──────────────────────┤  │
                           │ id (PK)              │  │
                           │ employeeId (FK)      │◄─┘
                           │ source               │
                           │ description          │
                           │ detectedAt           │
                           └──────────────────────┘
```

### Tablas Principales

#### 1. **users**
Tabla de autenticación gestionada por Manus OAuth.

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  openId VARCHAR(64) UNIQUE NOT NULL,
  name TEXT,
  email VARCHAR(320),
  loginMethod VARCHAR(64),
  role ENUM('user', 'admin') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW() ON UPDATE NOW(),
  lastSignedIn TIMESTAMP DEFAULT NOW()
);
```

#### 2. **employees**
Perfiles de empleados de Itti con información profesional.

```sql
CREATE TABLE employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(320),
  role VARCHAR(100),
  bootcamp VARCHAR(100),
  seniority ENUM('junior', 'mid', 'senior', 'lead'),
  department VARCHAR(100),
  position VARCHAR(100),
  joinDate TIMESTAMP,
  managerId INT,
  avatar TEXT,
  bio TEXT,
  industryInterest TEXT,
  careerGoal ENUM('technical_expert', 'tech_lead', 'mentor', 'manager', 'entrepreneur'),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW() ON UPDATE NOW()
);
```

#### 3. **competencies**
Catálogo de competencias técnicas y blandas.

```sql
CREATE TABLE competencies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  category ENUM('technical', 'soft') NOT NULL,
  description TEXT,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

#### 4. **employee_competencies**
Evaluaciones de competencias por empleado (relación N:M).

```sql
CREATE TABLE employee_competencies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employeeId INT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  competencyId INT NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
  currentLevel INT DEFAULT 0,
  potentialLevel INT DEFAULT 0,
  status ENUM('manifested', 'emerging', 'latent', 'not_evaluated') DEFAULT 'not_evaluated',
  lastEvaluated TIMESTAMP,
  evaluatedBy INT REFERENCES users(id),
  notes TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW() ON UPDATE NOW()
);
```

#### 5. **opportunities**
Oportunidades de carrera disponibles.

```sql
CREATE TABLE opportunities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('leadership', 'technical', 'managerial', 'specialist') NOT NULL,
  industry VARCHAR(100),
  timing ENUM('immediate', 'short_term', 'medium_term', 'long_term'),
  developmentLevel ENUM('junior', 'mid', 'senior', 'lead'),
  createdAt TIMESTAMP DEFAULT NOW()
);
```

#### 6. **development_plans**
Planes de desarrollo individual.

```sql
CREATE TABLE development_plans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employeeId INT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  objective TEXT,
  strengths TEXT,
  emergingAreas TEXT,
  latentPotential TEXT,
  limitingFactors TEXT,
  startDate TIMESTAMP,
  endDate TIMESTAMP,
  status ENUM('draft', 'active', 'completed', 'archived') DEFAULT 'draft',
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW() ON UPDATE NOW()
);
```

#### 7. **talent_detectors**
Fuentes de detección de talento invisible.

```sql
CREATE TABLE talent_detectors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employeeId INT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  source ENUM(
    'github', 'community', 'mentor_feedback', 'portfolio',
    'brainstorming', 'learning_speed', 'questions_quality',
    'peer_mentoring', 'problem_solving', 'creativity',
    'teaching', 'improvement_initiatives'
  ) NOT NULL,
  description TEXT,
  detectedAt TIMESTAMP DEFAULT NOW()
);
```

---

## 🔌 API Layer (tRPC)

### Estructura de Routers

```typescript
// server/routers.ts
export const appRouter = router({
  auth: router({
    me: publicProcedure.query(/* ... */),
    logout: publicProcedure.mutation(/* ... */),
  }),
  
  employees: router({
    list: protectedProcedure.query(/* ... */),
    getById: protectedProcedure.input(z.object({ id: z.number() })).query(/* ... */),
    create: protectedProcedure.input(/* ... */).mutation(/* ... */),
    update: protectedProcedure.input(/* ... */).mutation(/* ... */),
  }),
  
  competencies: router({
    list: protectedProcedure.query(/* ... */),
    getByEmployee: protectedProcedure.input(z.object({ employeeId: z.number() })).query(/* ... */),
  }),
  
  talentMapping: router({
    heatmap: protectedProcedure.input(/* filtros */).query(/* ... */),
    radar: protectedProcedure.input(z.object({ employeeId: z.number() })).query(/* ... */),
  }),
  
  opportunities: router({
    list: protectedProcedure.query(/* ... */),
    assign: protectedProcedure.input(/* ... */).mutation(/* ... */),
  }),
  
  developmentPlans: router({
    getByEmployee: protectedProcedure.input(z.object({ employeeId: z.number() })).query(/* ... */),
    create: protectedProcedure.input(/* ... */).mutation(/* ... */),
  }),
});
```

### Ventajas de tRPC

- **Type-safety end-to-end**: Frontend conoce tipos del backend automáticamente
- **No code generation**: Tipos inferidos directamente desde TypeScript
- **Serialización automática**: SuperJSON maneja Date, Map, Set sin conversiones
- **React Query integration**: Hooks `useQuery` y `useMutation` listos para usar
- **Validación con Zod**: Esquemas de validación reutilizables

---

## 🎨 Componentes Frontend

### Estructura de Páginas

```
client/src/pages/
├── Home.tsx                 # Dashboard principal con estadísticas
├── TalentMapping.tsx        # Heatmap + Radar de potencial
├── Opportunities.tsx        # Matriz de oportunidades
├── CareerPlans.tsx          # Planes de carrera + Radar de habilidades demandadas
├── StrengthsAnalysis.tsx    # Análisis de fortalezas y brechas
├── AIRecommendations.tsx    # Motor de recomendaciones IA
└── NotFound.tsx             # Página 404
```

### Componentes Reutilizables

```
client/src/components/
├── DashboardLayout.tsx      # Layout con sidebar y navegación
├── ui/                      # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── select.tsx
│   ├── badge.tsx
│   └── ...
└── ErrorBoundary.tsx        # Manejo de errores global
```

### Visualizaciones con Recharts

**Heatmap de Competencias**:
```tsx
<ResponsiveContainer width="100%" height={400}>
  <BarChart data={heatmapData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="competency" />
    <YAxis domain={[0, 100]} />
    <Tooltip />
    <Bar dataKey="level" fill="#26D07C" />
  </BarChart>
</ResponsiveContainer>
```

**Radar de Potencial**:
```tsx
<ResponsiveContainer width="100%" height={400}>
  <RadarChart data={radarData}>
    <PolarGrid />
    <PolarAngleAxis dataKey="competency" />
    <PolarRadiusAxis domain={[0, 100]} />
    <Radar name="Nivel Actual" dataKey="current" stroke="#26D07C" fill="#26D07C" fillOpacity={0.6} />
    <Radar name="Potencial" dataKey="potential" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
    <Legend />
  </RadarChart>
</ResponsiveContainer>
```

---

## 🔐 Autenticación y Autorización

### Flujo de Autenticación (Manus OAuth)

1. **Usuario accede a la aplicación**
2. **Redirección a Manus OAuth** (`/api/oauth/login`)
3. **Usuario se autentica** en portal de Manus
4. **Callback** a `/api/oauth/callback` con código de autorización
5. **Backend intercambia código por token** y crea sesión
6. **Cookie de sesión** se establece (httpOnly, secure, sameSite)
7. **Usuario autenticado** accede a la aplicación

### Protección de Rutas

**Backend (tRPC)**:
```typescript
const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
```

**Frontend (React)**:
```tsx
const { user, loading, isAuthenticated } = useAuth();

if (loading) return <DashboardLayoutSkeleton />;
if (!isAuthenticated) {
  window.location.href = getLoginUrl();
  return null;
}

return <DashboardLayout>...</DashboardLayout>;
```

---

## 🎨 Diseño Visual

### Paleta de Colores (Itti Brand)

```css
:root {
  /* Colores primarios */
  --itti-green: #26D07C;
  --itti-blue: #3B82F6;
  --itti-navy: #1E3A8A;
  --itti-beige: #F5F5DC;
  
  /* Colores de sistema */
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 142 76% 48%;  /* Verde Itti */
  --secondary: 240 4.8% 95.9%;
  --accent: 240 4.8% 95.9%;
  --destructive: 0 84.2% 60.2%;
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 142 76% 48%;
}
```

### Tipografía

```css
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600;700&display=swap');

:root {
  --font-sans: 'Urbanist', sans-serif;
}
```

### Componentes de Diseño

- **Formas redondeadas**: `border-radius: 0.5rem` (8px)
- **Sombras suaves**: `box-shadow: 0 1px 3px rgba(0,0,0,0.1)`
- **Espaciado consistente**: Sistema de 4px (4, 8, 12, 16, 24, 32, 48, 64)
- **Iconos**: Lucide React (consistente con shadcn/ui)

---

## 🚀 Deployment y CI/CD

### Entorno de Desarrollo

```bash
# Instalar dependencias
pnpm install

# Ejecutar migraciones
pnpm db:push

# Poblar base de datos
npx tsx seed-itti-data.mjs

# Iniciar servidor de desarrollo
pnpm dev  # http://localhost:3000
```

### Build para Producción

```bash
# Build frontend + backend
pnpm build

# Iniciar servidor de producción
pnpm start
```

### Variables de Entorno

```env
# Base de datos
DATABASE_URL=mysql://user:pass@host:port/database

# Autenticación
JWT_SECRET=<secret>
OAUTH_SERVER_URL=<manus_oauth_url>
VITE_OAUTH_PORTAL_URL=<manus_portal_url>
VITE_APP_ID=<app_id>

# Owner
OWNER_OPEN_ID=<owner_openid>
OWNER_NAME=<owner_name>

# APIs (opcional)
BUILT_IN_FORGE_API_URL=<api_url>
BUILT_IN_FORGE_API_KEY=<api_key>
```

---

## 🧪 Testing

### Estructura de Tests

```
server/
├── auth.logout.test.ts          # Tests de autenticación
├── employees.test.ts            # Tests de empleados
└── talentMapping.test.ts        # Tests de mapeo de talento
```

### Ejemplo de Test (Vitest)

```typescript
import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";

describe("employees.list", () => {
  it("returns list of employees", async () => {
    const caller = appRouter.createCaller(mockAuthContext());
    const result = await caller.employees.list();
    
    expect(result).toHaveLength(24);
    expect(result[0]).toHaveProperty("name");
    expect(result[0]).toHaveProperty("role");
  });
});
```

### Ejecutar Tests

```bash
# Ejecutar todos los tests
pnpm test

# Ejecutar tests en modo watch
pnpm test --watch

# Ejecutar tests con coverage
pnpm test --coverage
```

---

## 📈 Performance y Optimización

### Frontend

- **Code splitting**: Lazy loading de rutas con React.lazy()
- **Memoization**: useMemo y useCallback para evitar re-renders
- **Optimistic updates**: React Query para UX instantánea
- **Image optimization**: WebP format, lazy loading

### Backend

- **Database indexing**: Índices en columnas frecuentemente consultadas
- **Query optimization**: Evitar N+1 queries con joins
- **Caching**: Redis para datos frecuentemente accedidos (futuro)
- **Connection pooling**: Pool de conexiones MySQL

### Métricas Objetivo

- **Time to First Byte (TTFB)**: <200ms
- **First Contentful Paint (FCP)**: <1.5s
- **Largest Contentful Paint (LCP)**: <2.5s
- **Cumulative Layout Shift (CLS)**: <0.1
- **API Response Time**: <300ms (p95)

---

## 🔮 Roadmap Técnico

### Corto Plazo (Q1 2025)

- [ ] Implementar caching con Redis
- [ ] Agregar tests E2E con Playwright
- [ ] Optimizar queries de base de datos
- [ ] Implementar rate limiting

### Medio Plazo (Q2-Q3 2025)

- [ ] Migrar a Next.js para SSR
- [ ] Implementar real-time updates con WebSockets
- [ ] Agregar soporte multi-idioma (i18n)
- [ ] Implementar exportación de reportes PDF

### Largo Plazo (Q4 2025+)

- [ ] Migrar a arquitectura de microservicios
- [ ] Implementar machine learning para recomendaciones
- [ ] Agregar mobile app (React Native)
- [ ] Integración con sistemas HRIS externos

---

## 📚 Referencias Técnicas

- **React 19 Docs**: https://react.dev/
- **Tailwind CSS 4**: https://tailwindcss.com/
- **tRPC**: https://trpc.io/
- **Drizzle ORM**: https://orm.drizzle.team/
- **shadcn/ui**: https://ui.shadcn.com/
- **Recharts**: https://recharts.org/

---

**Última actualización**: Diciembre 2024
