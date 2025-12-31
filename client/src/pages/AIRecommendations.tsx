import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { trpc } from "@/lib/trpc";
import { Brain, BookOpen, Briefcase, Users, Award, TrendingUp, Loader2, Sparkles, Target, Clock } from "lucide-react";
import { toast } from "sonner";

interface Recommendation {
  courses: Array<{
    title: string;
    provider: string;
    duration: string;
    priority: "high" | "medium" | "low";
    competencies: string[];
    reason: string;
  }>;
  projects: Array<{
    title: string;
    description: string;
    competencies: string[];
    estimatedDuration: string;
    impact: string;
  }>;
  mentorship: {
    recommendedMentor: string;
    focusAreas: string[];
    frequency: string;
  };
  certifications: Array<{
    name: string;
    issuer: string;
    relevance: string;
    preparationTime: string;
  }>;
  careerPath: {
    nextRole: string;
    timeframe: string;
    keyMilestones: string[];
    requiredCompetencies: string[];
  };
  summary: string;
}

export default function AIRecommendations() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation | null>(null);
  const [employeeName, setEmployeeName] = useState<string>("");

  const { data: employees } = trpc.employees.list.useQuery();
  const generateMutation = trpc.aiRecommendations.generate.useMutation({
    onSuccess: (data) => {
      setRecommendations(data.recommendations);
      setEmployeeName(data.employeeName);
      toast.success("Recomendaciones generadas exitosamente");
    },
    onError: (error) => {
      toast.error(`Error al generar recomendaciones: ${error.message}`);
    },
  });

  const handleGenerate = () => {
    if (!selectedEmployeeId) {
      toast.error("Por favor selecciona un empleado");
      return;
    }
    generateMutation.mutate({ employeeId: selectedEmployeeId });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta Prioridad";
      case "medium":
        return "Prioridad Media";
      case "low":
        return "Prioridad Baja";
      default:
        return priority;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Recomendaciones IA</h1>
            <p className="text-muted-foreground mt-1">
              Motor de recomendaciones automáticas basado en análisis de competencias y objetivos de carrera
            </p>
          </div>
        </div>

        {/* Selector y Generador */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Generar Recomendaciones Personalizadas
            </CardTitle>
            <CardDescription>
              Selecciona un empleado para generar recomendaciones de desarrollo profesional basadas en IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Empleado</label>
                <Select
                  value={selectedEmployeeId?.toString() || ""}
                  onValueChange={(value) => setSelectedEmployeeId(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un empleado" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees?.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id.toString()}>
                        {emp.name} - {emp.role || "Sin rol"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleGenerate}
                disabled={!selectedEmployeeId || generateMutation.isPending}
                className="gap-2"
              >
                {generateMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4" />
                    Generar Recomendaciones
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        {recommendations && (
          <div className="space-y-6">
            {/* Resumen */}
            <Alert className="border-primary/50 bg-primary/5">
              <Sparkles className="h-5 w-5 text-primary" />
              <AlertDescription className="ml-2">
                <p className="font-semibold mb-1">Recomendaciones para {employeeName}</p>
                <p className="text-sm">{recommendations.summary}</p>
              </AlertDescription>
            </Alert>

            {/* Tabs de Recomendaciones */}
            <Tabs defaultValue="courses" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="courses">Cursos</TabsTrigger>
                <TabsTrigger value="projects">Proyectos</TabsTrigger>
                <TabsTrigger value="certifications">Certificaciones</TabsTrigger>
                <TabsTrigger value="mentorship">Mentoría</TabsTrigger>
                <TabsTrigger value="career">Ruta de Carrera</TabsTrigger>
              </TabsList>

              {/* Cursos */}
              <TabsContent value="courses" className="space-y-4 mt-6">
                <div className="grid gap-4">
                  {recommendations.courses.map((course, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <BookOpen className="h-5 w-5 text-primary" />
                              {course.title}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {course.provider} • {course.duration}
                            </CardDescription>
                          </div>
                          <Badge className={getPriorityColor(course.priority)} variant="outline">
                            {getPriorityLabel(course.priority)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">{course.reason}</p>
                        <div>
                          <p className="text-sm font-medium mb-2">Competencias a desarrollar:</p>
                          <div className="flex flex-wrap gap-2">
                            {course.competencies.map((comp, idx) => (
                              <Badge key={idx} variant="secondary">
                                {comp}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Proyectos */}
              <TabsContent value="projects" className="space-y-4 mt-6">
                <div className="grid gap-4">
                  {recommendations.projects.map((project, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Briefcase className="h-5 w-5 text-blue-600" />
                          {project.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Clock className="h-4 w-4" />
                          {project.estimatedDuration}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm">{project.description}</p>
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <p className="text-sm font-medium text-blue-900 mb-1">Impacto Esperado:</p>
                          <p className="text-sm text-blue-800">{project.impact}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2">Competencias a desarrollar:</p>
                          <div className="flex flex-wrap gap-2">
                            {project.competencies.map((comp, idx) => (
                              <Badge key={idx} variant="secondary">
                                {comp}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Certificaciones */}
              <TabsContent value="certifications" className="space-y-4 mt-6">
                <div className="grid gap-4">
                  {recommendations.certifications.map((cert, index) => (
                    <Card key={index} className="border-l-4 border-l-orange-500">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Award className="h-5 w-5 text-orange-600" />
                          {cert.name}
                        </CardTitle>
                        <CardDescription className="mt-1">{cert.issuer}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm font-medium mb-1">Relevancia:</p>
                          <p className="text-sm text-muted-foreground">{cert.relevance}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Tiempo de preparación: {cert.preparationTime}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Mentoría */}
              <TabsContent value="mentorship" className="space-y-4 mt-6">
                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      Plan de Mentoría Recomendado
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Perfil de Mentor Ideal:</p>
                      <p className="text-sm text-muted-foreground">{recommendations.mentorship.recommendedMentor}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Áreas de Enfoque:</p>
                      <div className="flex flex-wrap gap-2">
                        {recommendations.mentorship.focusAreas.map((area, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-purple-100 text-purple-800">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-md">
                      <p className="text-sm font-medium text-purple-900 mb-1">Frecuencia Sugerida:</p>
                      <p className="text-sm text-purple-800">{recommendations.mentorship.frequency}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Ruta de Carrera */}
              <TabsContent value="career" className="space-y-4 mt-6">
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Ruta de Carrera Sugerida
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-medium text-green-900 mb-1">Siguiente Rol:</p>
                        <p className="text-base font-semibold text-green-800">{recommendations.careerPath.nextRole}</p>
                      </div>
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 mb-1">Tiempo Estimado:</p>
                        <p className="text-base font-semibold text-blue-800">{recommendations.careerPath.timeframe}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Hitos Clave:
                      </p>
                      <div className="space-y-2">
                        {recommendations.careerPath.keyMilestones.map((milestone, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-3 bg-muted rounded-md">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold mt-0.5">
                              {idx + 1}
                            </div>
                            <p className="text-sm flex-1">{milestone}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Competencias Requeridas:</p>
                      <div className="flex flex-wrap gap-2">
                        {recommendations.careerPath.requiredCompetencies.map((comp, idx) => (
                          <Badge key={idx} variant="outline" className="border-green-500 text-green-700">
                            {comp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Estado vacío */}
        {!recommendations && !generateMutation.isPending && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Brain className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground mb-2">
                No hay recomendaciones generadas
              </p>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Selecciona un empleado y haz clic en "Generar Recomendaciones" para obtener sugerencias
                personalizadas de desarrollo profesional basadas en IA
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
