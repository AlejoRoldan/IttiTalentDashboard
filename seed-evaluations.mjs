import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { employeeCompetencies } from "./drizzle/schema.ts";

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Evaluaciones de competencias para cada empleado
// employeeId, competencyId, currentLevel (1-5), potentialLevel (1-5), source
const evaluations = [
  // María González (employeeId: 1) - Frontend Developer
  { employeeId: 1, competencyId: 4, currentLevel: 4, potentialLevel: 5, source: "manager_review" }, // Diseño UX/UI
  { employeeId: 1, competencyId: 1, currentLevel: 3, potentialLevel: 4, source: "self_assessment" }, // Arquitectura
  { employeeId: 1, competencyId: 10, currentLevel: 4, potentialLevel: 4, source: "peer_feedback" }, // Comunicación técnica
  { employeeId: 1, competencyId: 11, currentLevel: 2, potentialLevel: 4, source: "manager_review" }, // Mentoría
  { employeeId: 1, competencyId: 12, currentLevel: 3, potentialLevel: 5, source: "bootcamp_evaluation" }, // Liderazgo emergente
  
  // Carlos Rodríguez (employeeId: 2) - Backend Developer Senior
  { employeeId: 2, competencyId: 1, currentLevel: 5, potentialLevel: 5, source: "manager_review" }, // Arquitectura
  { employeeId: 2, competencyId: 3, currentLevel: 5, potentialLevel: 5, source: "peer_feedback" }, // Debugging avanzado
  { employeeId: 2, competencyId: 7, currentLevel: 4, potentialLevel: 5, source: "self_assessment" }, // Análisis de datos
  { employeeId: 2, competencyId: 11, currentLevel: 4, potentialLevel: 5, source: "manager_review" }, // Mentoría
  { employeeId: 2, competencyId: 15, currentLevel: 5, potentialLevel: 5, source: "bootcamp_evaluation" }, // Pensamiento sistémico
  
  // Ana Martínez (employeeId: 3) - UX/UI Designer Junior
  { employeeId: 3, competencyId: 4, currentLevel: 3, potentialLevel: 5, source: "manager_review" }, // Diseño UX/UI
  { employeeId: 3, competencyId: 10, currentLevel: 3, potentialLevel: 4, source: "peer_feedback" }, // Comunicación técnica
  { employeeId: 3, competencyId: 16, currentLevel: 4, potentialLevel: 5, source: "self_assessment" }, // Empatía
  { employeeId: 3, competencyId: 17, currentLevel: 4, potentialLevel: 4, source: "bootcamp_evaluation" }, // Proactividad
  { employeeId: 3, competencyId: 18, currentLevel: 5, potentialLevel: 5, source: "manager_review" }, // Aprendizaje acelerado
  
  // Luis Fernández (employeeId: 4) - AI Engineer
  { employeeId: 4, competencyId: 2, currentLevel: 4, potentialLevel: 5, source: "manager_review" }, // Pensamiento crítico AI
  { employeeId: 4, competencyId: 5, currentLevel: 4, potentialLevel: 5, source: "self_assessment" }, // Integración AI
  { employeeId: 4, competencyId: 6, currentLevel: 5, potentialLevel: 5, source: "peer_feedback" }, // Prompts avanzados
  { employeeId: 4, competencyId: 8, currentLevel: 3, potentialLevel: 4, source: "bootcamp_evaluation" }, // Automatización
  { employeeId: 4, competencyId: 12, currentLevel: 3, potentialLevel: 5, source: "manager_review" }, // Liderazgo emergente
  
  // Sofia López (employeeId: 5) - Full Stack Developer Senior
  { employeeId: 5, competencyId: 1, currentLevel: 4, potentialLevel: 5, source: "manager_review" }, // Arquitectura
  { employeeId: 5, competencyId: 4, currentLevel: 4, potentialLevel: 4, source: "peer_feedback" }, // Diseño UX/UI
  { employeeId: 5, competencyId: 7, currentLevel: 4, potentialLevel: 5, source: "self_assessment" }, // Análisis de datos
  { employeeId: 5, competencyId: 11, currentLevel: 5, potentialLevel: 5, source: "manager_review" }, // Mentoría
  { employeeId: 5, competencyId: 12, currentLevel: 4, potentialLevel: 5, source: "bootcamp_evaluation" }, // Liderazgo emergente
  { employeeId: 5, competencyId: 15, currentLevel: 5, potentialLevel: 5, source: "peer_feedback" }, // Pensamiento sistémico
];

console.log("🌱 Insertando evaluaciones de competencias...");

try {
  await db.insert(employeeCompetencies).values(evaluations);
  console.log(`✅ ${evaluations.length} evaluaciones insertadas exitosamente!`);
} catch (error) {
  console.error("❌ Error durante la inserción:", error);
} finally {
  await connection.end();
}
