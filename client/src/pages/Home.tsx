import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { BarChart3, Brain, Lightbulb, Map, TrendingUp, Users } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { data: employees, isLoading: loadingEmployees } = trpc.employees.list.useQuery();
  const { data: opportunities, isLoading: loadingOpportunities } = trpc.opportunities.list.useQuery();
  const { data: recommendations, isLoading: loadingRecommendations } = trpc.aiRecommendations.list.useQuery();

  const stats = [
    {
      title: "Total Empleados",
      value: loadingEmployees ? "..." : employees?.length || 0,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
      href: "/talent-mapping",
    },
    {
      title: "Oportunidades Activas",
      value: loadingOpportunities ? "..." : opportunities?.filter(o => o.status === "open").length || 0,
      icon: TrendingUp,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      href: "/opportunities",
    },
    {
      title: "Recomendaciones IA",
      value: loadingRecommendations ? "..." : recommendations?.filter(r => r.status === "pending").length || 0,
      icon: Brain,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
      href: "/ai-recommendations",
    },
  ];

  const sections = [
    {
      title: "Mapeo de Talento",
      description: "Visualiza competencias técnicas y blandas con heatmap interactivo y radar de potencial",
      icon: Map,
      href: "/talent-mapping",
      color: "text-primary",
    },
    {
      title: "Oportunidades",
      description: "Matriz de carrera, oportunidades inmediatas y análisis de necesidades vs talento",
      icon: TrendingUp,
      href: "/opportunities",
      color: "text-secondary",
    },
    {
      title: "Planes de Carrera",
      description: "Desarrollo individual, roadmaps de competencias e indicadores de progreso",
      icon: BarChart3,
      href: "/career-plans",
      color: "text-chart-3",
    },
    {
      title: "Análisis de Fortalezas",
      description: "Fortalezas organizacionales, matriz de impacto y análisis de brechas",
      icon: Lightbulb,
      href: "/strengths-analysis",
      color: "text-chart-2",
    },
    {
      title: "Recomendaciones IA",
      description: "Motor de recomendaciones automáticas para organización y empleados",
      icon: Brain,
      href: "/ai-recommendations",
      color: "text-primary",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard de Gestión de Talento</h1>
          <p className="text-muted-foreground">
            Plataforma integral para identificar, visualizar y potenciar las capacidades del equipo Itti
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.title} href={stat.href}>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className={`h-10 w-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Sections */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Secciones Principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Link key={section.title} href={section.href}>
                  <Card className="cursor-pointer hover:shadow-lg transition-all h-full">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className={`h-6 w-6 ${section.color}`} />
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                      </div>
                      <CardDescription>{section.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
