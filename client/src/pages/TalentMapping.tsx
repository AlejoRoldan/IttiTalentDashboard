import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Filter, Map } from "lucide-react";
import { useMemo, useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";

export default function TalentMapping() {
  const { data, isLoading } = trpc.talentMapping.heatmapData.useQuery();
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterSeniority, setFilterSeniority] = useState<string>("all");
  
  const { data: radarData } = trpc.talentMapping.radarData.useQuery(
    { employeeId: selectedEmployee! },
    { enabled: selectedEmployee !== null }
  );

  // Filtrar empleados según criterios
  const filteredEmployees = useMemo(() => {
    if (!data?.employees) return [];
    
    return data.employees.filter((emp) => {
      if (filterRole !== "all" && emp.role !== filterRole) return false;
      if (filterSeniority !== "all" && emp.seniority !== filterSeniority) return false;
      return true;
    });
  }, [data?.employees, filterRole, filterSeniority]);

  // Calcular matriz de heatmap
  const heatmapMatrix = useMemo(() => {
    if (!data?.competencies || !data?.evaluations || !filteredEmployees) return [];

    return data.competencies.map((comp) => {
      const employeeScores = filteredEmployees.map((emp) => {
        const evaluation = data.evaluations.find(
          (ev) => ev.employeeId === emp.id && ev.competencyId === comp.id
        );
        return evaluation?.currentLevel || 0;
      });

      const avgScore = employeeScores.length > 0
        ? employeeScores.reduce((a, b) => a + b, 0) / employeeScores.length
        : 0;

      return {
        competency: comp.name,
        category: comp.category,
        avgScore: avgScore.toFixed(1),
        color: getHeatmapColor(avgScore),
      };
    });
  }, [data, filteredEmployees]);

  // Preparar datos para el radar
  const radarChartData = useMemo(() => {
    if (!radarData?.competencies) return [];

    return radarData.competencies.map((comp) => ({
      competency: comp.competencyName?.substring(0, 20) || "N/A",
      actual: comp.currentLevel || 0,
      potencial: comp.potentialLevel || 0,
    }));
  }, [radarData]);

  const roles = useMemo(() => {
    if (!data?.employees) return [];
    return Array.from(new Set(data.employees.map((e) => e.role).filter((r): r is string => Boolean(r))));
  }, [data?.employees]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-8 flex items-center justify-center">
          <p className="text-muted-foreground">Cargando datos...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Map className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mapeo de Talento</h1>
              <p className="text-muted-foreground">
                Visualiza competencias técnicas y blandas con heatmap interactivo y radar de potencial
              </p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Rol</label>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los roles</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Seniority</label>
                <Select value={filterSeniority} onValueChange={setFilterSeniority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los niveles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los niveles</SelectItem>
                    <SelectItem value="junior">Junior</SelectItem>
                    <SelectItem value="mid">Mid</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterRole("all");
                    setFilterSeniority("all");
                  }}
                  className="w-full"
                >
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Heatmap de Competencias */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Heatmap de Competencias</CardTitle>
              <CardDescription>
                Promedio de nivel de competencias del equipo filtrado ({filteredEmployees.length} empleados)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {heatmapMatrix.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-48 text-sm font-medium truncate">{item.competency}</div>
                    <div className="flex-1 h-8 rounded-lg relative overflow-hidden bg-muted">
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${(parseFloat(item.avgScore) / 5) * 100}%`,
                          backgroundColor: item.color,
                        }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-foreground">
                        {item.avgScore} / 5.0
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground w-20 capitalize">{item.category}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selector de Empleado para Radar */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Radar de Potencial Individual</CardTitle>
              <CardDescription>Selecciona un empleado para ver su perfil de competencias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Select
                  value={selectedEmployee?.toString() || ""}
                  onValueChange={(val) => setSelectedEmployee(parseInt(val))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un empleado" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredEmployees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id.toString()}>
                        {emp.name} - {emp.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {radarChartData.length > 0 && (
                <div className="mt-6">
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={radarChartData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis
                        dataKey="competency"
                        tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                      />
                      <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                      <Radar
                        name="Nivel Actual"
                        dataKey="actual"
                        stroke="hsl(var(--chart-2))"
                        fill="hsl(var(--chart-2))"
                        fillOpacity={0.5}
                      />
                      <Radar
                        name="Potencial Estimado"
                        dataKey="potencial"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
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

                  {radarData?.employee && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <h3 className="font-semibold mb-2">{radarData.employee.name}</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Rol:</span> {radarData.employee.role || "N/A"}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Seniority:</span>{" "}
                          <span className="capitalize">{radarData.employee.seniority || "N/A"}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Departamento:</span> {radarData.employee.department || "N/A"}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Bootcamp:</span> {radarData.employee.bootcamp || "N/A"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!selectedEmployee && (
                <div className="mt-6 p-8 text-center text-muted-foreground">
                  Selecciona un empleado para visualizar su radar de potencial
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function getHeatmapColor(score: number): string {
  if (score >= 4.5) return "hsl(var(--primary))"; // Verde Itti
  if (score >= 3.5) return "hsl(var(--chart-2))"; // Azul
  if (score >= 2.5) return "hsl(var(--chart-4))"; // Beige
  if (score >= 1.5) return "hsl(var(--chart-3))"; // Azul marino
  return "hsl(var(--muted))"; // Gris
}
