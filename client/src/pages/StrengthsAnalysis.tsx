import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Loader2, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Target, Users } from "lucide-react";
import { useState } from "react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ZAxis, Cell } from "recharts";

/**
 * Página de Análisis de Fortalezas y Mejoras
 * 
 * Muestra 3 ejemplos basados en el organigrama real de Itti:
 * 1. Unidad Tecnológica (Diana Mongelós - Vicepresidenta)
 * 2. Unidad Comercial (Área de ventas y desarrollo de negocio)
 * 3. Unidad de Producto (Desarrollo de FINERA y soluciones)
 * 
 * Incluye:
 * - Nube de palabras de fortalezas organizacionales
 * - Matriz de impacto (fortalezas vs áreas de mejora)
 * - Análisis de brechas de competencias
 */

export default function StrengthsAnalysis() {
  const { user, loading, isAuthenticated } = useAuth();
  const [selectedUnit, setSelectedUnit] = useState<string>("tech");

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  // Datos de ejemplo basados en el organigrama de Itti
  const unitsData = {
    tech: {
      name: "Unidad Tecnológica",
      leader: "Diana Mongelós - Vicepresidenta",
      teamSize: 120,
      strengths: [
        { name: "Cloud Computing", score: 85, category: "technical" },
        { name: "Arquitectura de Software", score: 90, category: "technical" },
        { name: "DevOps", score: 80, category: "technical" },
        { name: "Seguridad", score: 75, category: "technical" },
        { name: "Agilidad", score: 88, category: "soft" },
        { name: "Innovación", score: 82, category: "soft" },
        { name: "Colaboración", score: 85, category: "soft" },
        { name: "Resolución de Problemas", score: 87, category: "soft" },
      ],
      gaps: [
        { competency: "IA/Machine Learning", currentLevel: 45, requiredLevel: 80, severity: "high", impact: "Limita capacidad de innovación en productos" },
        { competency: "Arquitectura Cloud Nativa", currentLevel: 60, requiredLevel: 85, severity: "medium", impact: "Retrasa migración a cloud" },
        { competency: "Liderazgo Técnico", currentLevel: 55, requiredLevel: 75, severity: "medium", impact: "Falta de mentores para juniors" },
      ],
      impactMatrix: [
        { name: "Cloud Computing", impact: 90, viability: 85, size: 120, type: "strength" },
        { name: "Arquitectura SW", impact: 95, viability: 90, size: 100, type: "strength" },
        { name: "IA/ML", impact: 85, viability: 40, size: 80, type: "gap" },
        { name: "DevOps", impact: 80, viability: 80, size: 90, type: "strength" },
        { name: "Seguridad", impact: 75, viability: 70, size: 70, type: "improvement" },
        { name: "Liderazgo Técnico", impact: 70, viability: 50, size: 60, type: "gap" },
      ],
    },
    commercial: {
      name: "Unidad Comercial",
      leader: "Área de Ventas y Desarrollo de Negocio",
      teamSize: 45,
      strengths: [
        { name: "Negociación", score: 88, category: "soft" },
        { name: "Conocimiento del Mercado", score: 85, category: "technical" },
        { name: "Gestión de Relaciones", score: 90, category: "soft" },
        { name: "Presentación Ejecutiva", score: 82, category: "soft" },
        { name: "Análisis Financiero", score: 75, category: "technical" },
        { name: "Estrategia Comercial", score: 80, category: "technical" },
        { name: "Comunicación", score: 87, category: "soft" },
        { name: "Orientación a Resultados", score: 92, category: "soft" },
      ],
      gaps: [
        { competency: "Venta Consultiva Tech", currentLevel: 55, requiredLevel: 80, severity: "high", impact: "Dificultad para vender soluciones complejas" },
        { competency: "CRM Avanzado", currentLevel: 60, requiredLevel: 85, severity: "medium", impact: "Pérdida de oportunidades de cross-sell" },
        { competency: "Análisis de Datos", currentLevel: 50, requiredLevel: 75, severity: "medium", impact: "Decisiones basadas en intuición vs datos" },
      ],
      impactMatrix: [
        { name: "Negociación", impact: 92, viability: 90, size: 110, type: "strength" },
        { name: "Gestión Relaciones", impact: 95, viability: 92, size: 120, type: "strength" },
        { name: "Venta Consultiva", impact: 85, viability: 50, size: 90, type: "gap" },
        { name: "Conocimiento Mercado", impact: 88, viability: 85, size: 100, type: "strength" },
        { name: "CRM Avanzado", impact: 75, viability: 60, size: 70, type: "gap" },
        { name: "Análisis Datos", impact: 70, viability: 55, size: 65, type: "gap" },
      ],
    },
    product: {
      name: "Unidad de Producto",
      leader: "Desarrollo de FINERA y Soluciones",
      teamSize: 80,
      strengths: [
        { name: "Diseño UX/UI", score: 88, category: "technical" },
        { name: "Product Management", score: 82, category: "technical" },
        { name: "Investigación de Usuario", score: 80, category: "technical" },
        { name: "Prototipado Rápido", score: 85, category: "technical" },
        { name: "Pensamiento Estratégico", score: 78, category: "soft" },
        { name: "Empatía con Usuario", score: 90, category: "soft" },
        { name: "Colaboración Cross-funcional", score: 83, category: "soft" },
        { name: "Adaptabilidad", score: 86, category: "soft" },
      ],
      gaps: [
        { competency: "Data-Driven Product", currentLevel: 50, requiredLevel: 80, severity: "high", impact: "Decisiones de producto sin validación cuantitativa" },
        { competency: "Growth Hacking", currentLevel: 45, requiredLevel: 75, severity: "high", impact: "Bajo crecimiento de usuarios en FINERA" },
        { competency: "Product Analytics", currentLevel: 55, requiredLevel: 85, severity: "medium", impact: "Falta de métricas de producto" },
      ],
      impactMatrix: [
        { name: "Diseño UX/UI", impact: 92, viability: 90, size: 115, type: "strength" },
        { name: "Empatía Usuario", impact: 95, viability: 95, size: 120, type: "strength" },
        { name: "Data-Driven", impact: 88, viability: 45, size: 85, type: "gap" },
        { name: "Product Mgmt", impact: 85, viability: 82, size: 95, type: "strength" },
        { name: "Growth Hacking", impact: 80, viability: 40, size: 75, type: "gap" },
        { name: "Prototipado", impact: 82, viability: 85, size: 90, type: "strength" },
      ],
    },
  };

  const currentUnit = unitsData[selectedUnit as keyof typeof unitsData];

  // Colores para la matriz de impacto
  const getColorByType = (type: string) => {
    switch (type) {
      case "strength":
        return "#26D07C"; // Verde Itti
      case "gap":
        return "#EF4444"; // Rojo
      case "improvement":
        return "#F59E0B"; // Amarillo
      default:
        return "#3B82F6"; // Azul
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Análisis de Fortalezas y Mejoras</h1>
            <p className="text-muted-foreground">
              Identificación de fortalezas organizacionales y brechas de competencias por unidad
            </p>
          </div>
          <Select value={selectedUnit} onValueChange={setSelectedUnit}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Seleccionar unidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tech">Unidad Tecnológica</SelectItem>
              <SelectItem value="commercial">Unidad Comercial</SelectItem>
              <SelectItem value="product">Unidad de Producto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Información de la unidad */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {currentUnit.name}
            </CardTitle>
            <CardDescription>
              {currentUnit.leader} • {currentUnit.teamSize} colaboradores
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="strengths" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="strengths">Fortalezas Organizacionales</TabsTrigger>
            <TabsTrigger value="matrix">Matriz de Impacto</TabsTrigger>
            <TabsTrigger value="gaps">Análisis de Brechas</TabsTrigger>
          </TabsList>

          {/* Tab 1: Fortalezas Organizacionales (Radar Chart) */}
          <TabsContent value="strengths" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Radar de Fortalezas Organizacionales</CardTitle>
                <CardDescription>
                  Competencias destacadas de la unidad (escala 0-100)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={500}>
                  <RadarChart data={currentUnit.strengths}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 14 }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "#64748B" }} />
                    <Radar
                      name="Nivel de Fortaleza"
                      dataKey="score"
                      stroke="#26D07C"
                      fill="#26D07C"
                      fillOpacity={0.6}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #E2E8F0",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>

                {/* Nube de palabras (simulada con badges) */}
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4">Nube de Competencias</h3>
                  <div className="flex flex-wrap gap-3">
                    {currentUnit.strengths.map((strength) => (
                      <Badge
                        key={strength.name}
                        variant={strength.category === "technical" ? "default" : "secondary"}
                        className="text-base py-2 px-4"
                        style={{
                          fontSize: `${12 + strength.score / 10}px`,
                        }}
                      >
                        {strength.name} ({strength.score})
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Matriz de Impacto (Scatter Chart) */}
          <TabsContent value="matrix" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Matriz de Impacto vs Viabilidad</CardTitle>
                <CardDescription>
                  Posicionamiento de competencias según su impacto en el negocio y viabilidad de desarrollo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={500}>
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis
                      type="number"
                      dataKey="viability"
                      name="Viabilidad"
                      domain={[0, 100]}
                      label={{ value: "Viabilidad de Desarrollo", position: "bottom", fill: "#64748B" }}
                      tick={{ fill: "#64748B" }}
                    />
                    <YAxis
                      type="number"
                      dataKey="impact"
                      name="Impacto"
                      domain={[0, 100]}
                      label={{ value: "Impacto en Negocio", angle: -90, position: "left", fill: "#64748B" }}
                      tick={{ fill: "#64748B" }}
                    />
                    <ZAxis type="number" dataKey="size" range={[400, 1000]} />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #E2E8F0",
                        borderRadius: "8px",
                      }}
                      formatter={(value: any, name: string) => {
                        if (name === "impact") return [`${value}`, "Impacto"];
                        if (name === "viability") return [`${value}`, "Viabilidad"];
                        return [value, name];
                      }}
                    />
                    <Scatter name="Competencias" data={currentUnit.impactMatrix}>
                      {currentUnit.impactMatrix.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getColorByType(entry.type)} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>

                {/* Leyenda personalizada */}
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4">Interpretación</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#26D07C]" />
                      <span className="text-sm">Fortaleza (mantener y potenciar)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#EF4444]" />
                      <span className="text-sm">Brecha crítica (priorizar desarrollo)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#F59E0B]" />
                      <span className="text-sm">Área de mejora (desarrollo gradual)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Análisis de Brechas */}
          <TabsContent value="gaps" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Brechas de Competencias</CardTitle>
                <CardDescription>
                  Competencias críticas con nivel actual insuficiente para objetivos estratégicos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {currentUnit.gaps.map((gap, index) => (
                    <div key={index} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                          <div>
                            <h3 className="text-lg font-semibold">{gap.competency}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{gap.impact}</p>
                          </div>
                        </div>
                        <Badge variant={getSeverityColor(gap.severity) as any}>
                          {gap.severity === "high" && "Alta Prioridad"}
                          {gap.severity === "medium" && "Prioridad Media"}
                          {gap.severity === "low" && "Baja Prioridad"}
                        </Badge>
                      </div>

                      {/* Barra de progreso de brecha */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Nivel Actual</span>
                          <span className="font-semibold">{gap.currentLevel}%</span>
                        </div>
                        <div className="h-3 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-destructive"
                            style={{ width: `${gap.currentLevel}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Nivel Requerido</span>
                          <span className="font-semibold text-primary">{gap.requiredLevel}%</span>
                        </div>
                        <div className="h-3 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${gap.requiredLevel}%` }}
                          />
                        </div>
                      </div>

                      {/* Brecha calculada */}
                      <div className="mt-4 p-4 bg-muted rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Brecha a cerrar:</span>
                          <span className="text-2xl font-bold text-destructive">
                            {gap.requiredLevel - gap.currentLevel} puntos
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Resumen de acciones recomendadas */}
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Acciones Recomendadas
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Programa de Upskilling Interno</p>
                        <p className="text-sm text-muted-foreground">
                          Diseñar bootcamps internos de 12 semanas para cerrar brechas críticas con mentores senior
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Contrataciones Estratégicas</p>
                        <p className="text-sm text-muted-foreground">
                          Incorporar 2-3 expertos externos que puedan transferir conocimiento al equipo
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Certificaciones y Capacitación Externa</p>
                        <p className="text-sm text-muted-foreground">
                          Presupuesto de 50,000 USD para certificaciones profesionales en competencias críticas
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
