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
