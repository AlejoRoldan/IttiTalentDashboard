import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Users, Building2, TrendingUp, Award, Target, BookOpen } from "lucide-react";

interface OrgNode {
  id: string;
  name: string;
  role: string;
  unit: string;
  level: "directivo" | "gerencial" | "especialista" | "operativo";
  email: string;
  seniority: string;
  competencies: Array<{ name: string; level: number; category: string }>;
  careerPlan?: {
    currentRole: string;
    targetRole: string;
    progress: number;
    nextMilestone: string;
  };
  reports?: OrgNode[];
}

// Datos del organigrama basados en la estructura real de Itti
const orgData: OrgNode = {
  id: "1",
  name: "César Astigarraga",
  role: "CEO",
  unit: "Dirección",
  level: "directivo",
  email: "cesar.astigarraga@itti.digital",
  seniority: "C-Level",
  competencies: [
    { name: "Liderazgo Estratégico", level: 95, category: "soft" },
    { name: "Visión de Negocio", level: 98, category: "soft" },
    { name: "Gestión de Stakeholders", level: 92, category: "soft" },
    { name: "Innovación", level: 90, category: "soft" },
  ],
  reports: [
    {
      id: "2",
      name: "Diana Mongelós",
      role: "Vicepresidenta - Unidad Tecnológica",
      unit: "Tecnología",
      level: "directivo",
      email: "diana.mongelos@itti.digital",
      seniority: "VP",
      competencies: [
        { name: "Arquitectura de Software", level: 92, category: "tech" },
        { name: "Liderazgo Técnico", level: 95, category: "soft" },
        { name: "Cloud Computing", level: 88, category: "tech" },
        { name: "Gestión de Equipos", level: 93, category: "soft" },
      ],
      careerPlan: {
        currentRole: "VP Tecnología",
        targetRole: "CTO",
        progress: 75,
        nextMilestone: "Liderar transformación digital Q1 2026",
      },
      reports: [
        {
          id: "3",
          name: "Cristhian Benitez",
          role: "VP of SRE",
          unit: "Tecnología - SRE",
          level: "gerencial",
          email: "cristhian.benitez@itti.digital",
          seniority: "Senior",
          competencies: [
            { name: "DevOps", level: 95, category: "tech" },
            { name: "Kubernetes", level: 92, category: "tech" },
            { name: "Monitoreo y Observabilidad", level: 90, category: "tech" },
            { name: "Incident Management", level: 93, category: "soft" },
          ],
          careerPlan: {
            currentRole: "VP of SRE",
            targetRole: "Director de Infraestructura",
            progress: 60,
            nextMilestone: "Implementar estrategia multi-cloud",
          },
        },
        {
          id: "4",
          name: "Marco Scavarda",
          role: "Head of Fraud",
          unit: "Tecnología - Seguridad",
          level: "gerencial",
          email: "marco.scavarda@itti.digital",
          seniority: "Senior",
          competencies: [
            { name: "Ciberseguridad", level: 94, category: "tech" },
            { name: "Detección de Fraude", level: 96, category: "tech" },
            { name: "Machine Learning", level: 85, category: "tech" },
            { name: "Análisis de Riesgos", level: 91, category: "soft" },
          ],
        },
        {
          id: "5",
          name: "María González",
          role: "Tech Lead Frontend",
          unit: "Tecnología - Desarrollo",
          level: "especialista",
          email: "maria.gonzalez@itti.digital",
          seniority: "Senior",
          competencies: [
            { name: "React", level: 95, category: "tech" },
            { name: "TypeScript", level: 92, category: "tech" },
            { name: "UI/UX", level: 88, category: "tech" },
            { name: "Mentoría", level: 85, category: "soft" },
          ],
          careerPlan: {
            currentRole: "Tech Lead Frontend",
            targetRole: "Engineering Manager",
            progress: 45,
            nextMilestone: "Completar certificación en gestión de equipos",
          },
        },
        {
          id: "6",
          name: "Carlos Rodríguez",
          role: "Senior Backend Developer",
          unit: "Tecnología - Desarrollo",
          level: "especialista",
          email: "carlos.rodriguez@itti.digital",
          seniority: "Senior",
          competencies: [
            { name: "Node.js", level: 93, category: "tech" },
            { name: "PostgreSQL", level: 90, category: "tech" },
            { name: "Microservicios", level: 88, category: "tech" },
            { name: "API Design", level: 91, category: "tech" },
          ],
        },
      ],
    },
    {
      id: "7",
      name: "Guillermo Vázquez",
      role: "Director de Productos",
      unit: "Productos & Innovación",
      level: "directivo",
      email: "guillermo.vazquez@itti.digital",
      seniority: "Director",
      competencies: [
        { name: "Product Management", level: 94, category: "soft" },
        { name: "Estrategia de Producto", level: 96, category: "soft" },
        { name: "UX Research", level: 87, category: "tech" },
        { name: "Data-Driven Decision", level: 90, category: "soft" },
      ],
      reports: [
        {
          id: "8",
          name: "Ana Martínez",
          role: "Product Manager - FINERA",
          unit: "Productos",
          level: "especialista",
          email: "ana.martinez@itti.digital",
          seniority: "Mid",
          competencies: [
            { name: "Product Discovery", level: 88, category: "soft" },
            { name: "Roadmap Planning", level: 85, category: "soft" },
            { name: "Stakeholder Management", level: 82, category: "soft" },
            { name: "Analytics", level: 80, category: "tech" },
          ],
          careerPlan: {
            currentRole: "Product Manager",
            targetRole: "Senior Product Manager",
            progress: 55,
            nextMilestone: "Lanzar feature de pagos internacionales",
          },
        },
        {
          id: "9",
          name: "Luis Fernández",
          role: "UX/UI Designer",
          unit: "Productos - Diseño",
          level: "especialista",
          email: "luis.fernandez@itti.digital",
          seniority: "Mid",
          competencies: [
            { name: "Figma", level: 92, category: "tech" },
            { name: "Design Systems", level: 88, category: "tech" },
            { name: "User Research", level: 85, category: "soft" },
            { name: "Prototipado", level: 90, category: "tech" },
          ],
        },
      ],
    },
    {
      id: "10",
      name: "Roberto Silva",
      role: "Gerente Comercial",
      unit: "Comercial",
      level: "gerencial",
      email: "roberto.silva@itti.digital",
      seniority: "Senior",
      competencies: [
        { name: "Negociación", level: 93, category: "soft" },
        { name: "Gestión de Cuentas", level: 91, category: "soft" },
        { name: "Estrategia Comercial", level: 89, category: "soft" },
        { name: "CRM", level: 85, category: "tech" },
      ],
      reports: [
        {
          id: "11",
          name: "Patricia López",
          role: "Account Manager",
          unit: "Comercial - Ventas",
          level: "especialista",
          email: "patricia.lopez@itti.digital",
          seniority: "Mid",
          competencies: [
            { name: "Prospección", level: 87, category: "soft" },
            { name: "Presentaciones Ejecutivas", level: 85, category: "soft" },
            { name: "Análisis de Mercado", level: 80, category: "soft" },
            { name: "Salesforce", level: 82, category: "tech" },
          ],
        },
      ],
    },
  ],
};

export default function Organigrama() {
  const [selectedEmployee, setSelectedEmployee] = useState<OrgNode | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleNodeClick = (node: OrgNode) => {
    setSelectedEmployee(node);
    setIsDialogOpen(true);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "directivo":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "gerencial":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "especialista":
        return "bg-green-100 text-green-800 border-green-300";
      case "operativo":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getUnitColor = (unit: string) => {
    if (unit.includes("Tecnología") || unit.includes("SRE") || unit.includes("Seguridad") || unit.includes("Desarrollo")) {
      return "border-l-4 border-l-green-500";
    }
    if (unit.includes("Productos") || unit.includes("Diseño")) {
      return "border-l-4 border-l-blue-500";
    }
    if (unit.includes("Comercial") || unit.includes("Ventas")) {
      return "border-l-4 border-l-orange-500";
    }
    return "border-l-4 border-l-purple-500";
  };

  const OrgNodeCard = ({ node, depth = 0 }: { node: OrgNode; depth?: number }) => {
    const hasReports = node.reports && node.reports.length > 0;

    return (
      <div className="flex flex-col items-center">
        {/* Nodo principal */}
        <Card
          className={`w-72 cursor-pointer hover:shadow-lg transition-all duration-200 ${getUnitColor(node.unit)}`}
          onClick={() => handleNodeClick(node)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-base font-semibold">{node.name}</CardTitle>
                <CardDescription className="text-sm mt-1">{node.role}</CardDescription>
              </div>
              <Badge className={getLevelColor(node.level)} variant="outline">
                {node.level}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span className="truncate">{node.unit}</span>
            </div>
            {node.careerPlan && (
              <div className="mt-3 p-2 bg-muted rounded-md">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <Target className="h-3 w-3" />
                  <span>Plan de Carrera</span>
                </div>
                <Progress value={node.careerPlan.progress} className="h-1.5" />
                <p className="text-xs mt-1 text-muted-foreground">{node.careerPlan.progress}% completado</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Línea conectora */}
        {hasReports && (
          <div className="w-0.5 h-8 bg-border my-2" />
        )}

        {/* Reportes directos */}
        {hasReports && (
          <div className="relative">
            {/* Línea horizontal superior */}
            {node.reports!.length > 1 && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-border" style={{ width: `${(node.reports!.length - 1) * 320}px`, left: "50%", transform: "translateX(-50%)" }} />
            )}

            {/* Nodos hijos */}
            <div className="flex gap-8 mt-2">
              {node.reports!.map((report, index) => (
                <div key={report.id} className="relative">
                  {/* Línea vertical conectora */}
                  <div className="absolute top-0 left-1/2 w-0.5 h-8 bg-border -translate-x-1/2 -mt-8" />
                  <OrgNodeCard node={report} depth={depth + 1} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organigrama Interactivo</h1>
          <p className="text-muted-foreground mt-2">
            Explora la estructura organizacional de Itti y los perfiles de cada miembro del equipo
          </p>
        </div>

        {/* Leyenda */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Leyenda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded" />
                <span className="text-sm">Dirección</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded" />
                <span className="text-sm">Tecnología</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded" />
                <span className="text-sm">Productos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded" />
                <span className="text-sm">Comercial</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organigrama */}
        <div className="overflow-x-auto pb-8">
          <div className="inline-block min-w-full">
            <div className="flex justify-center py-8">
              <OrgNodeCard node={orgData} />
            </div>
          </div>
        </div>

        {/* Modal de Perfil */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedEmployee && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedEmployee.name}</DialogTitle>
                  <DialogDescription className="text-base">
                    {selectedEmployee.role} • {selectedEmployee.unit}
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="profile" className="mt-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="profile">Perfil</TabsTrigger>
                    <TabsTrigger value="competencies">Competencias</TabsTrigger>
                    <TabsTrigger value="career">Plan de Carrera</TabsTrigger>
                  </TabsList>

                  <TabsContent value="profile" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p className="text-sm mt-1">{selectedEmployee.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Seniority</p>
                        <p className="text-sm mt-1">{selectedEmployee.seniority}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Nivel</p>
                        <Badge className={getLevelColor(selectedEmployee.level)} variant="outline">
                          {selectedEmployee.level}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Unidad</p>
                        <p className="text-sm mt-1">{selectedEmployee.unit}</p>
                      </div>
                    </div>

                    {selectedEmployee.reports && selectedEmployee.reports.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Reportes Directos</p>
                        <div className="space-y-2">
                          {selectedEmployee.reports.map((report) => (
                            <div key={report.id} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{report.name}</p>
                                <p className="text-xs text-muted-foreground">{report.role}</p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedEmployee(report);
                                }}
                              >
                                Ver perfil
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="competencies" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      {selectedEmployee.competencies.map((comp, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <Award className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">{comp.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {comp.category === "tech" ? "Técnica" : "Blanda"}
                              </Badge>
                              <span className="text-sm font-semibold">{comp.level}%</span>
                            </div>
                          </div>
                          <Progress value={comp.level} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="career" className="space-y-4 mt-4">
                    {selectedEmployee.careerPlan ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm font-medium text-muted-foreground mb-1">Rol Actual</p>
                            <p className="text-base font-semibold">{selectedEmployee.careerPlan.currentRole}</p>
                          </div>
                          <div className="p-4 bg-primary/10 rounded-lg">
                            <p className="text-sm font-medium text-muted-foreground mb-1">Rol Objetivo</p>
                            <p className="text-base font-semibold">{selectedEmployee.careerPlan.targetRole}</p>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium">Progreso del Plan</p>
                            <span className="text-sm font-semibold">{selectedEmployee.careerPlan.progress}%</span>
                          </div>
                          <Progress value={selectedEmployee.careerPlan.progress} className="h-3" />
                        </div>

                        <div className="p-4 border rounded-lg">
                          <div className="flex items-start gap-2">
                            <Target className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <p className="text-sm font-medium mb-1">Próximo Hito</p>
                              <p className="text-sm text-muted-foreground">{selectedEmployee.careerPlan.nextMilestone}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                          <p className="text-sm text-blue-900">
                            En camino hacia {selectedEmployee.careerPlan.targetRole}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <BookOpen className="h-12 w-12 text-muted-foreground mb-3" />
                        <p className="text-sm font-medium text-muted-foreground">
                          No hay plan de carrera definido para este empleado
                        </p>
                        <Button variant="outline" size="sm" className="mt-4">
                          Crear Plan de Carrera
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
