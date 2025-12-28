import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function Opportunities() {
  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-secondary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Oportunidades de Talento</h1>
            <p className="text-muted-foreground">
              Matriz de carrera, oportunidades inmediatas y análisis de necesidades vs talento
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Matriz de Oportunidades</CardTitle>
              <CardDescription>Cuadrantes de carrera y recomendaciones personalizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Próximamente: Matriz interactiva</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Oportunidades Inmediatas</CardTitle>
              <CardDescription>Tabla dinámica filtrable por tipo, industria y timing</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Próximamente: Tabla de oportunidades</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
