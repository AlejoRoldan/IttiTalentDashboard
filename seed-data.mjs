import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { competencies, employees, opportunities } from "./drizzle/schema.ts";

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Competencias técnicas
const technicalCompetencies = [
  { name: "Arquitectura de sistemas", category: "technical", description: "Diseño de sistemas escalables y mantenibles" },
  { name: "Pensamiento crítico sobre AI", category: "technical", description: "Análisis y evaluación de soluciones de IA" },
  { name: "Debugging avanzado", category: "technical", description: "Resolución de problemas complejos" },
  { name: "Diseño UX/UI", category: "technical", description: "Experiencia de usuario y diseño de interfaces" },
  { name: "Integración de AI en workflows", category: "technical", description: "Incorporación de IA en procesos" },
  { name: "Escritura de prompts avanzados", category: "technical", description: "Optimización de prompts para LLMs" },
  { name: "Análisis de datos", category: "technical", description: "Procesamiento y análisis de datos" },
  { name: "Automatización de procesos", category: "technical", description: "Creación de scripts y automatizaciones" },
  { name: "Documentación técnica", category: "technical", description: "Escritura de documentación clara" },
];

// Competencias blandas
const softCompetencies = [
  { name: "Comunicación técnica clara", category: "soft", description: "Explicar conceptos técnicos de forma accesible" },
  { name: "Mentoría y coaching", category: "soft", description: "Guiar y desarrollar a otros" },
  { name: "Liderazgo emergente", category: "soft", description: "Tomar iniciativa y liderar equipos" },
  { name: "Resolución de conflictos", category: "soft", description: "Mediar y resolver disputas" },
  { name: "Pensamiento sistémico", category: "soft", description: "Ver el panorama completo" },
  { name: "Empatía e inteligencia emocional", category: "soft", description: "Comprender y gestionar emociones" },
  { name: "Proactividad e iniciativa", category: "soft", description: "Anticiparse y actuar" },
  { name: "Capacidad de aprendizaje acelerado", category: "soft", description: "Aprender rápidamente nuevas tecnologías" },
];

// Empleados de ejemplo
const sampleEmployees = [
  {
    name: "María González",
    email: "maria.gonzalez@itti.com",
    role: "Frontend Developer",
    bootcamp: "Frontend Bootcamp 2024",
    seniority: "mid",
    department: "Desarrollo",
    position: "Desarrolladora Frontend",
    joinDate: new Date("2023-06-01"),
    careerGoal: "tech_lead",
  },
  {
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@itti.com",
    role: "Backend Developer",
    bootcamp: "Backend Bootcamp 2023",
    seniority: "senior",
    department: "Desarrollo",
    position: "Desarrollador Backend",
    joinDate: new Date("2022-03-15"),
    careerGoal: "technical_expert",
  },
  {
    name: "Ana Martínez",
    email: "ana.martinez@itti.com",
    role: "UX/UI Designer",
    bootcamp: "UX/UI Bootcamp 2024",
    seniority: "junior",
    department: "Diseño",
    position: "Diseñadora UX/UI",
    joinDate: new Date("2024-01-10"),
    careerGoal: "mentor",
  },
  {
    name: "Luis Fernández",
    email: "luis.fernandez@itti.com",
    role: "AI Engineer",
    bootcamp: "GenAI Bootcamp 2024",
    seniority: "mid",
    department: "Inteligencia Artificial",
    position: "Ingeniero de IA",
    joinDate: new Date("2023-09-01"),
    careerGoal: "tech_lead",
  },
  {
    name: "Sofia López",
    email: "sofia.lopez@itti.com",
    role: "Full Stack Developer",
    bootcamp: "Full Stack Bootcamp 2023",
    seniority: "senior",
    department: "Desarrollo",
    position: "Desarrolladora Full Stack",
    joinDate: new Date("2021-11-20"),
    careerGoal: "manager",
  },
];

// Oportunidades de ejemplo
const sampleOpportunities = [
  {
    title: "Tech Lead Frontend",
    description: "Liderar equipo de desarrollo frontend en proyecto de e-commerce",
    type: "leadership",
    industry: "Fintech",
    timing: "immediate",
    developmentLevel: "advanced",
    status: "open",
  },
  {
    title: "Mentor de UX/UI",
    description: "Mentorar a nuevos estudiantes del bootcamp de diseño",
    type: "mentoring",
    industry: "EdTech",
    timing: "3_6_months",
    developmentLevel: "intermediate",
    status: "open",
  },
  {
    title: "Especialista en AI Agents",
    description: "Desarrollar agentes de IA para automatización de procesos",
    type: "technical",
    industry: "Startups",
    timing: "immediate",
    developmentLevel: "advanced",
    status: "open",
  },
];

console.log("🌱 Iniciando seed de datos...");

try {
  // Insertar competencias
  console.log("📚 Insertando competencias...");
  await db.insert(competencies).values([...technicalCompetencies, ...softCompetencies]);

  // Insertar empleados
  console.log("👥 Insertando empleados...");
  await db.insert(employees).values(sampleEmployees);

  // Insertar oportunidades
  console.log("🎯 Insertando oportunidades...");
  await db.insert(opportunities).values(sampleOpportunities);

  console.log("✅ Seed completado exitosamente!");
} catch (error) {
  console.error("❌ Error durante el seed:", error);
} finally {
  await connection.end();
}
