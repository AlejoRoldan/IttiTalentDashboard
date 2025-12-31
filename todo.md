# Itti Talent Dashboard - TODO

## Configuración Inicial
- [x] Configurar esquema de base de datos con tablas para empleados, competencias, evaluaciones, oportunidades, planes de carrera
- [x] Configurar tema visual con colores de marca Itti (verde #26D07C, azul, negro, beige)
- [x] Configurar tipografía Urbanist
- [x] Implementar DashboardLayout con navegación lateral
- [x] Crear páginas base para las 5 secciones principales
- [x] Implementar dashboard principal con estadísticas

## Sección 1: Mapeo de Talento
- [ ] Heatmap interactivo de competencias técnicas y blandas
- [ ] Filtros por rol, bootcamp, seniority y tiempo en organización
- [ ] Sistema de detección de talento invisible con indicadores visuales (manifestado, emergente, latente, no evaluado)
- [ ] Gráfico radar de potencial oculto por persona
- [ ] Visualización de habilidades actuales vs potencial estimado
- [ ] Trayectoria de crecimiento y brechas de desarrollo

## Sección 2: Oportunidades de Talento
- [ ] Matriz de oportunidades de carrera con cuadrantes (liderazgo técnico, gerencial, especialista, experto)
- [ ] Gráfico de dispersión interactivo (nivel técnico vs liderazgo)
- [ ] Recomendaciones personalizadas por cuadrante
- [ ] Tabla dinámica de oportunidades inmediatas
- [ ] Filtros por tipo de oportunidad, industria, timing y nivel de desarrollo
- [ ] Matriz de necesidades vs talento disponible (bubble chart)

## Sección 3: Planes de Carrera Personalizados
- [ ] Perfiles de desarrollo individual con evaluación de talento
- [ ] Trayectoria propuesta con objetivos de carrera
- [ ] Hitos de desarrollo (3, 6, 12, 24 meses)
- [ ] Asignación de mentores y recursos de aprendizaje
- [ ] Timeline interactivo de roadmap de competencias
- [ ] Visualización de niveles actuales vs requeridos
- [ ] Plan de desarrollo trimestral por competencia
- [ ] Dashboard de indicadores de progreso personal
- [ ] Velocidad de aprendizaje, impacto en equipo, consistencia
- [ ] Alertas automáticas de retraso o aceleración

## Sección 4: Análisis de Fortalezas y Mejoras
- [ ] Nube de palabras de fortalezas organizacionales
- [ ] Análisis de frecuencia por categoría (técnicas, blandas, multiplicadores)
- [ ] Matriz de impacto vs viabilidad para oportunidades de mejora
- [ ] Tabla comparativa de análisis de brechas con severidad y planes de mitigación

## Sección 5: Recomendaciones IA
- [ ] Motor de recomendaciones automáticas para la organización
- [ ] Recomendaciones personalizadas por empleado
- [ ] Sugerencias de emparejamiento mentor-mentee
- [ ] Integración con LLM para análisis de talento

## Funcionalidades Adicionales
- [ ] Organigrama interactivo con visualización jerárquica
- [ ] Capacidad de explorar perfiles de cada miembro del equipo
- [ ] Sistema de búsqueda global
- [ ] Exportación de reportes
- [ ] Gestión de usuarios con roles (admin/directivo/RH)

## Testing y Deployment
- [ ] Escribir tests unitarios con Vitest
- [ ] Pruebas de integración de componentes
- [ ] Crear checkpoint final

## Nuevas Funcionalidades Solicitadas
- [x] Implementar heatmap de competencias con visualización interactiva
- [x] Agregar filtros dinámicos para el heatmap (rol, bootcamp, seniority, tiempo en organización)
- [x] Implementar gráfico radar de potencial oculto por persona
- [x] Mostrar habilidades actuales vs potencial estimado en el radar
- [x] Agregar datos de evaluaciones de competencias para alimentar las visualizaciones
- [x] Crear tests unitarios para routers de talentMapping

## Nuevas Funcionalidades - Plan de Carrera y Habilidades Demandadas
- [x] Implementar ejemplo de plan de carrera con roadmap trimestral
- [x] Crear gráfico radar de habilidades tech y soft de alta demanda según BID
- [x] Agregar datos de habilidades demandadas en el mercado digital
- [x] Integrar visualización en sección de Planes de Carrera

## Análisis de Fortalezas - Implementación con Ejemplos de Itti
- [x] Implementar página de Análisis de Fortalezas con visualizaciones interactivas
- [x] Crear 3 ejemplos de análisis basados en organigrama real de Itti
- [x] Agregar nube de palabras de competencias organizacionales
- [x] Implementar matriz de impacto (fortalezas vs áreas de mejora)
- [x] Agregar análisis de brechas de competencias por área
- [x] Datos embebidos en componente (no requiere router tRPC adicional)
- [x] Datos de ejemplo de 3 unidades de Itti incluidos en el código

## Organigrama Interactivo
- [x] Diseñar estructura jerárquica del organigrama basado en datos reales de Itti
- [x] Implementar visualización de organigrama con nodos interactivos
- [x] Agregar funcionalidad de navegación entre perfiles
- [x] Crear modal de perfil de empleado con información detallada
- [x] Mostrar competencias y evaluaciones en el perfil
- [x] Integrar planes de carrera en el perfil del empleado
- [x] Datos embebidos en componente (11 empleados de Itti)
- [x] Sistema de colores por unidad (Tecnología, Productos, Comercial, Dirección)
- [x] Badges de nivel jerárquico (directivo, gerencial, especialista)
- [x] Indicadores de progreso de plan de carrera en cards

## Motor de Recomendaciones IA
- [x] Diseñar estructura de datos para recomendaciones personalizadas
- [x] Implementar router tRPC para generar recomendaciones con LLM
- [x] Crear prompts especializados para análisis de brechas de competencias
- [x] Integrar análisis de tendencias del mercado tecnológico
- [x] Implementar generación de sugerencias de cursos y certificaciones
- [x] Crear recomendaciones de mentores según perfil
- [x] Implementar sugerencias de proyectos para desarrollar competencias
- [x] Diseñar interfaz de usuario para visualizar recomendaciones
- [x] Sistema de tabs para organizar recomendaciones (Cursos, Proyectos, Certificaciones, Mentoría, Ruta de Carrera)
- [x] Badges de prioridad con colores (Alta, Media, Baja)
- [x] Crear tests unitarios para el motor de recomendaciones (2 tests pasando)

## Mejoras Visuales Recientes
- [x] Mejorar orden visual del organigrama para mejor legibilidad

## Presentación Ejecutiva - Completar Slides Restantes
- [x] Completar slide de Casos de Uso con ejemplos reales de Itti
- [x] Crear slide de Roadmap de Implementación con fases y timeline (90 días)
- [x] Desarrollar slide de Análisis de ROI con métricas financieras (ROI 1,150%)
- [x] Agregar slide de Riesgos y Mitigación con 4 estrategias
- [x] Crear slide de Llamado a la Acción con decisiones requeridas
- [x] Crear slide de Cierre con impacto transformacional
- [x] Presentar la presentación completa al usuario (13 slides)

## Actualización de Repositorio GitHub
- [ ] Sincronizar código actualizado con repositorio https://github.com/AlejoRoldan/IttiTalentDashboard
- [ ] Incluir todas las mejoras recientes: organigrama interactivo, motor de recomendaciones IA, análisis de fortalezas
- [ ] Actualizar documentación del README con nuevas funcionalidades
