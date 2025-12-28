# Itti Talent Dashboard

Plataforma web interactiva de gestión de talento y desarrollo profesional diseñada específicamente para **Itti**, empresa líder en soluciones tecnológicas para negocios y actividades financieras en Paraguay.

## 🎯 Objetivo

Desarrollar un sistema que permita dar visibilidad a las capacidades de la empresa, sus planes de carrera y su crecimiento, facilitando la identificación, visualización y potenciación del talento del equipo de manera estratégica.

## 🌟 Características Principales

### 1. **Mapeo de Talento Invisible**
- **Heatmap de competencias**: Visualización interactiva del nivel promedio del equipo en competencias técnicas y blandas
- **Filtros dinámicos**: Por rol, bootcamp, seniority y tiempo en organización
- **Detector de talento**: Indicadores visuales (manifestado, emergente, latente, no evaluado)
- **Radar de potencial oculto**: Comparación visual de habilidades actuales vs potencial estimado por empleado

### 2. **Oportunidades de Talento**
- Matriz de carrera con cuadrantes (liderazgo técnico, gerencial, especialista, experto)
- Tabla dinámica de oportunidades inmediatas filtrable por tipo, industria, timing y nivel de desarrollo
- Análisis de necesidades del equipo

### 3. **Planes de Carrera Personalizados**
- Perfiles individuales de desarrollo con evaluación de talento
- Trayectorias propuestas con hitos de desarrollo
- Asignación de mentores
- Timeline interactivo de roadmap de competencias
- Dashboard de indicadores de progreso personal

### 4. **Análisis de Fortalezas y Mejoras**
- Nube de palabras de competencias
- Matriz de impacto
- Análisis de brechas de habilidades

### 5. **Inteligencia y Recomendaciones**
- Motor de recomendaciones basado en IA
- Análisis predictivo de trayectorias profesionales

### 6. **Organigrama Interactivo**
- Visualización jerárquica de la estructura organizacional
- Exploración de perfiles de cada miembro del equipo

## 🏢 Estructura Organizacional de Itti

Basado en la **Memoria Itti 2023** y el sitio web oficial, la plataforma refleja la estructura real de la empresa:

### Nivel Directivo
- Directorio (Junta Directiva)
- Gerencia General
- CEO

### Tres Unidades Principales

#### 1. Unidad Comercial
- Gerente de Calidad y Mejora Continua
- Gerente de Supply Chain
- Gerente Comercial

#### 2. Unidad de Productos & Innovación
- Director de Productos
- Product Managers
- UX/UI Designers

#### 3. Unidad Tecnológica
- Directores de Tecnología
- VP of SRE
- Head of Fraud
- Equipos de Desarrollo (Frontend, Backend, Full Stack)
- Infraestructura y DevOps
- Seguridad
- Data & Analytics
- QA

## 📊 Habilidades de Alta Demanda

La plataforma incluye un radar de habilidades técnicas y blandas de mayor demanda según reportes del **BID**, **LinkedIn Learning**, **Stack Overflow** y **World Economic Forum**:

### Habilidades Técnicas
- Cloud Computing (95%)
- Inteligencia Artificial y Machine Learning (92%)
- Ciberseguridad (90%)
- Desarrollo Full Stack (88%)
- DevOps y CI/CD (85%)
- Análisis de Datos (83%)

### Habilidades Blandas
- Resolución de Problemas Complejos (94%)
- Pensamiento Crítico (91%)
- Creatividad e Innovación (89%)
- Liderazgo y Gestión de Equipos (87%)
- Inteligencia Emocional (85%)
- Adaptabilidad y Aprendizaje Continuo (90%)

## 🛠️ Stack Tecnológico

- **Frontend**: React 19 + Tailwind CSS 4
- **Backend**: Express 4 + tRPC 11
- **Base de Datos**: MySQL/TiDB con Drizzle ORM
- **Autenticación**: Manus OAuth
- **Visualizaciones**: Recharts
- **Tipografía**: Urbanist (Google Fonts)
- **Colores**: Paleta de marca Itti (Verde #26D07C, Azul, Negro, Beige)

## 📁 Estructura del Proyecto

```
itti_talent_dashboard/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas principales
│   │   ├── components/    # Componentes reutilizables
│   │   └── lib/           # Utilidades y configuración
├── server/                # Backend Express + tRPC
│   ├── routers.ts         # Definición de endpoints
│   └── db.ts              # Funciones de base de datos
├── drizzle/               # Esquema y migraciones
│   └── schema.ts          # Definición de tablas
└── docs/                  # Documentación
```

## 📚 Documentación

- [Planes de Carrera por Rol](./docs/planes-carrera/README.md)
- [Investigación de Estructura Organizacional](./docs/investigacion/README.md)
- [Arquitectura del Sistema](./docs/arquitectura/README.md)

## 🚀 Instalación y Desarrollo

```bash
# Instalar dependencias
pnpm install

# Ejecutar migraciones de base de datos
pnpm db:push

# Poblar base de datos con datos de ejemplo
npx tsx seed-itti-data.mjs

# Iniciar servidor de desarrollo
pnpm dev

# Ejecutar tests
pnpm test
```

## 🎨 Diseño Visual

La plataforma sigue la **línea visual de Itti**:

- **Color primario**: Verde vibrante (#26D07C)
- **Colores secundarios**: Blanco, Beige, Negro, Azul marino, Azul
- **Tipografía**: Urbanist (Regular, Bold, Semibold)
- **Estilo**: Moderno, limpio, con formas redondeadas

## 👥 Datos de Ejemplo

La plataforma incluye datos de 24 empleados reales de Itti basados en la estructura organizacional oficial, incluyendo:

- **Nivel Directivo**: César Astigarraga (CEO), Luis Angulo, Diana Mongelós
- **Unidad Tecnológica**: Cristhian Benitez (VP of SRE), Marco Scavarda (Head of Fraud), equipos de desarrollo
- **Unidad de Productos**: Guillermo Vázquez (Director de Productos), Product Managers
- **Unidad Comercial**: Gerentes y especialistas

## 📈 Funcionalidades Implementadas

- ✅ Dashboard principal con estadísticas en tiempo real
- ✅ Heatmap de competencias con filtros dinámicos
- ✅ Gráfico radar de potencial oculto por empleado
- ✅ Radar de habilidades de alta demanda (BID + reportes tech)
- ✅ Ejemplo de plan de carrera con roadmap trimestral
- ✅ Base de datos poblada con empleados y competencias reales
- ✅ Navegación entre 5 secciones principales
- ✅ Diseño responsive con identidad de marca Itti

## 🔮 Próximas Funcionalidades

- [ ] Matriz de oportunidades de carrera interactiva
- [ ] Organigrama interactivo navegable
- [ ] Motor de recomendaciones con IA
- [ ] Sistema de gestión de empleados (CRUD)
- [ ] Análisis de brechas de competencias
- [ ] Indicadores de progreso en tiempo real
- [ ] Exportación de reportes PDF

## 📄 Licencia

Este proyecto es propiedad de **Itti** y está desarrollado para uso interno de la empresa.

## 🔗 Enlaces

- [Sitio web de Itti](https://www.itti.digital/)
- [Memoria Itti 2023](https://www.itti.digital/wp-content/uploads/2024/04/Memoria-itti-2023.pdf)
- [LinkedIn de Itti](https://www.linkedin.com/company/itti-digital/)

---

**Desarrollado con ❤️ para potenciar el talento de Itti**
