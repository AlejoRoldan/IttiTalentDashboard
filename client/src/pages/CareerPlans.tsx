import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { BarChart3, Calendar, CheckCircle2, Clock, Target, TrendingUp, Users } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";

// Habilidades de alta demanda según BID y reportes tech
const demandedSkillsData = [
  { skill: "Cloud Computing", demanda: 95, actual: 65 },
  { skill: "IA/Machine Learning", demanda: 92, actual: 58 },
  { skill: "Ciberseguridad", demanda: 90, actual: 62 },
  { skill: "DevOps/CI-CD", demanda: 88, actual: 70 },
  { skill: "Desarrollo Full Stack", demanda: 85, actual: 75 },
  { skill: "Análisis de Datos", demanda: 87, actual: 68 },
  { skill: "Pensamiento Crítico", demanda: 93, actual: 72 },
  { skill: "Comunicación Efectiva", demanda: 91, actual: 78 },
  { skill: "Adaptabilidad", demanda: 89, actual: 80 },
  { skill: "Colaboración", demanda: 86, actual: 82 },
  { skill: "Resolución de Problemas", demanda: 94, actual: 76 },
  { skill: "Liderazgo", demanda: 84, actual: 60 },
];

// Ejemplo de plan de carrera
const careerPlanExample = {
  employee: "María González",
  role: "Frontend Developer",
  targetRole: "Tech Lead Frontend",
  duration: "12 meses",
  mentor: "Sofia López",
  quarters: [
    {
      quarter: "Q1 2025",
      focus: "Fundamentos de Liderazgo Técnico",
      milestones: [
        { title: "Completar curso de Arquitectura de Software", status: "completed" as const },
        { title: "Liderar proyecto pequeño (2-3 personas)", status: "completed" as const },
        { title: "Mentoría a 1 desarrollador junior", status: "in_progress" as const },
      ],
      skills: ["Arquitectura de sistemas", "Mentoría", "Gestión de proyectos"],
    },
    {
      quarter: "Q2 2025",
      focus: "Profundización Técnica y Comunicación",
      milestones: [
        { title: "Certificación en React Advanced Patterns", status: "pending" as const },
        { title: "Presentar 2 charlas técnicas internas", status: "pending" as const },
        { title: "Documentar best practices del equipo", status: "pending" as const },
      ],
      skills: ["Comunicación técnica", "Documentación", "Patrones avanzados"],
    },
    {
      quarter: "Q3 2025",
      focus: "Gestión de Equipos y Procesos",
      milestones: [
        { title: "Co-liderar equipo de 5 personas", status: "pending" as const },
        { title: "Implementar proceso de code review", status: "pending" as const },
        { title: "Curso de gestión ágil de equipos", status: "pending" as const },
      ],
      skills: ["Liderazgo de equipos", "Procesos ágiles", "Feedback efectivo"],
    },
    {
      quarter: "Q4 2025",
      focus: "Consolidación y Transición",
      milestones: [
        { title: "Liderar proyecto estratégico completo", status: "pending" as const },
        { title: "Evaluación 360° de liderazgo", status: "pending" as const },
        { title: "Presentación de resultados a dirección", status: "pending" as const },
      ],
      skills: ["Visión estratégica", "Presentaciones ejecutivas", "Toma de decisiones"],
    },
  ],
  currentProgress: 35,
};

export default function CareerPlans() {
  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Planes de Carrera</h1>
              <p className="text-muted-foreground">
                Desarrollo individual, roadmaps de competencias e indicadores de progreso
              </p>
            </div>
          </div>
        </div>

        {/* Radar de Habilidades Demandadas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Habilidades de Alta Demanda en el Mercado Digital
            </CardTitle>
            <CardDescription>
              Basado en reportes del BID, LinkedIn Learning, Stack Overflow y tendencias tech 2024-2025
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={demandedSkillsData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis
                      dataKey="skill"
                      tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
                    />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <Radar
                      name="Demanda del Mercado"
                      dataKey="demanda"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.5}
                    />
                    <Radar
                      name="Nivel Actual del Equipo"
                      dataKey="actual"
                      stroke="hsl(var(--chart-2))"
                      fill="hsl(var(--chart-2))"
                      fillOpacity={0.3}
                    />
                    <Legend />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Top 5 Habilidades Técnicas Demandadas</h3>
                  <div className="space-y-2">
                    {demandedSkillsData
                      .filter((s) => ["Cloud Computing", "IA/Machine Learning", "Ciberseguridad", "DevOps/CI-CD", "Desarrollo Full Stack"].includes(s.skill))
                      .map((skill, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="font-medium">{skill.skill}</span>
                          <Badge variant="secondary">{skill.demanda}% demanda</Badge>
                        </div>
                      ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Top 5 Habilidades Blandas Demandadas</h3>
                  <div className="space-y-2">
                    {demandedSkillsData
                      .filter((s) => ["Resolución de Problemas", "Pensamiento Crítico", "Comunicación Efectiva", "Adaptabilidad", "Colaboración"].includes(s.skill))
                      .map((skill, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="font-medium">{skill.skill}</span>
                          <Badge variant="secondary">{skill.demanda}% demanda</Badge>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
                  <p className="text-muted-foreground">
                    <strong>Fuentes:</strong> BID (Banco Interamericano de Desarrollo), LinkedIn Learning Workplace Report 2024,
                    Stack Overflow Developer Survey 2024, World Economic Forum Future of Jobs Report
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ejemplo de Plan de Carrera */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Ejemplo de Plan de Carrera: {careerPlanExample.employee}
                </CardTitle>
                <CardDescription>
                  {careerPlanExample.role} → {careerPlanExample.targetRole} ({careerPlanExample.duration})
                </CardDescription>
              </div>
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Ver Todos los Planes
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Información General */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Mentor Asignado</p>
                <p className="font-semibold">{careerPlanExample.mentor}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duración</p>
                <p className="font-semibold">{careerPlanExample.duration}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Progreso General</p>
                <div className="flex items-center gap-2">
                  <Progress value={careerPlanExample.currentProgress} className="flex-1" />
                  <span className="font-semibold text-sm">{careerPlanExample.currentProgress}%</span>
                </div>
              </div>
            </div>

            {/* Roadmap Trimestral */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Roadmap Trimestral
              </h3>

              {careerPlanExample.quarters.map((quarter, idx) => (
                <Card key={idx} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{quarter.quarter}</CardTitle>
                        <CardDescription>{quarter.focus}</CardDescription>
                      </div>
                      <Badge variant={idx === 0 ? "default" : "outline"}>
                        {idx === 0 ? "En Progreso" : "Próximo"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Hitos */}
                    <div>
                      <p className="text-sm font-medium mb-2">Hitos del Trimestre</p>
                      <div className="space-y-2">
                        {quarter.milestones.map((milestone, mIdx) => (
                          <div key={mIdx} className="flex items-start gap-3">
                            {milestone.status === "completed" && (
                              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                            )}
                            {milestone.status === "in_progress" && (
                              <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                            )}
                            {milestone.status === "pending" && (
                              <div className="h-5 w-5 rounded-full border-2 border-muted-foreground mt-0.5" />
                            )}
                            <div className="flex-1">
                              <p className={`text-sm ${milestone.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                                {milestone.title}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Competencias a Desarrollar */}
                    <div>
                      <p className="text-sm font-medium mb-2">Competencias a Desarrollar</p>
                      <div className="flex flex-wrap gap-2">
                        {quarter.skills.map((skill, sIdx) => (
                          <Badge key={sIdx} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Indicadores de Progreso */}
            <Card className="bg-primary/5">
              <CardHeader>
                <CardTitle className="text-base">Indicadores de Progreso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">6/9</p>
                    <p className="text-sm text-muted-foreground">Hitos Completados</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">4.2</p>
                    <p className="text-sm text-muted-foreground">Velocidad de Aprendizaje</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">Alto</p>
                    <p className="text-sm text-muted-foreground">Impacto en Equipo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
