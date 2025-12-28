import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";

export default function AIRecommendations() {
  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Recomendaciones IA</h1>
            <p className="text-muted-foreground">
              Motor de recomendaciones automáticas para organización y empleados
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones Organizacionales</CardTitle>
              <CardDescription>Sugerencias para mejorar la gestión de talento</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Próximamente: Recomendaciones IA</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones Personales</CardTitle>
              <CardDescription>Sugerencias individuales de desarrollo</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Próximamente: Recomendaciones personalizadas</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
