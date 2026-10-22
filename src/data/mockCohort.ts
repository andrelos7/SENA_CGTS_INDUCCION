import { CohortStudent, LiveActivityFeedItem } from '../types/induction';

export const INITIAL_COHORT_STUDENTS: CohortStudent[] = [
  {
    id: 'sena-001',
    name: 'Valentina Restrepo Henao',
    documentId: '1020492811',
    email: 'vrestrepo@soy.sena.edu.co',
    program: 'ADSO - Análisis y Desarrollo de Software',
    ficha: '2714520',
    regional: 'Antioquia - Centro de Servicios y Gestión Empresarial',
    progressPercent: 100,
    scoreAvg: 96,
    status: 'completado',
    lastActive: 'Hace 3 minutos',
    completedModulesCount: 5
  },
  {
    id: 'sena-002',
    name: 'Brayan Alexis Gómez Pardo',
    documentId: '1098412033',
    email: 'bgomez.p@soy.sena.edu.co',
    program: 'ADSO - Análisis y Desarrollo de Software',
    ficha: '2714520',
    regional: 'Distrito Capital - Centro de Tecnologías del Transporte',
    progressPercent: 80,
    scoreAvg: 90,
    status: 'en_progreso',
    lastActive: 'Hace 12 minutos',
    completedModulesCount: 4
  },
  {
    id: 'sena-003',
    name: 'Daniela Sofía Cuéllar Morales',
    documentId: '1014829302',
    email: 'dcuellar@soy.sena.edu.co',
    program: 'Gestión Empresarial y Comercial',
    ficha: '2841029',
    regional: 'Santander - Centro de Servicios Empresariales',
    progressPercent: 60,
    scoreAvg: 85,
    status: 'en_progreso',
    lastActive: 'Hace 25 minutos',
    completedModulesCount: 3
  },
  {
    id: 'sena-004',
    name: 'Juan Sebastián Rojas Méndez',
    documentId: '1033948271',
    email: 'jsrojas@soy.sena.edu.co',
    program: 'Mantenimiento Mecatrónico Industrial',
    ficha: '2690182',
    regional: 'Valle del Cauca - Centro de Electricidad y Automatización',
    progressPercent: 20,
    scoreAvg: 55,
    status: 'en_riesgo',
    lastActive: 'Hace 2 horas',
    completedModulesCount: 1
  },
  {
    id: 'sena-005',
    name: 'Camila Andrea Ospina Vargas',
    documentId: '1019283746',
    email: 'cospina.v@soy.sena.edu.co',
    program: 'ADSO - Análisis y Desarrollo de Software',
    ficha: '2714520',
    regional: 'Caldas - Centro de Automatización Industrial',
    progressPercent: 100,
    scoreAvg: 94,
    status: 'completado',
    lastActive: 'Hace 15 minutos',
    completedModulesCount: 5
  },
  {
    id: 'sena-006',
    name: 'Mateo Alejandro Torres Ortiz',
    documentId: '1022837465',
    email: 'mtorres@soy.sena.edu.co',
    program: 'Gestión Empresarial y Comercial',
    ficha: '2841029',
    regional: 'Atlántico - Centro de Comercio y Servicios',
    progressPercent: 40,
    scoreAvg: 78,
    status: 'en_progreso',
    lastActive: 'Hace 40 minutos',
    completedModulesCount: 2
  },
  {
    id: 'sena-007',
    name: 'Luisa Fernanda Caicedo',
    documentId: '1088293741',
    email: 'lcaicedo@soy.sena.edu.co',
    program: 'Mantenimiento Mecatrónico Industrial',
    ficha: '2690182',
    regional: 'Risaralda - Centro de Diseño e Innovación',
    progressPercent: 0,
    scoreAvg: 0,
    status: 'iniciado',
    lastActive: 'Ayer',
    completedModulesCount: 0
  },
  {
    id: 'sena-008',
    name: 'Andrés Felipe Muñoz Gil',
    documentId: '1017823904',
    email: 'afmunoz@soy.sena.edu.co',
    program: 'ADSO - Análisis y Desarrollo de Software',
    ficha: '2714520',
    regional: 'Boyacá - Centro Minero',
    progressPercent: 80,
    scoreAvg: 88,
    status: 'en_progreso',
    lastActive: 'Hace 5 minutos',
    completedModulesCount: 4
  }
];



export const INITIAL_LIVE_ACTIVITIES: LiveActivityFeedItem[] = [
  {
    id: 'act-1',
    timestamp: 'Ahora mismo',
    apprenticeName: 'Valentina Restrepo',
    action: 'Certificado Emitido',
    type: 'certificate_issued',
    detail: 'Completó 100% de la inducción - Promedio 96%'
  },
  {
    id: 'act-2',
    timestamp: 'Hace 3 min',
    apprenticeName: 'Brayan Alexis Gómez',
    action: 'Módulo Aprobado',
    type: 'module_completed',
    detail: 'Módulo 4: Etapas de Formación y Alternativas'
  },
  {
    id: 'act-3',
    timestamp: 'Hace 7 min',
    apprenticeName: 'Andrés Felipe Muñoz',
    action: 'Insignia Desbloqueada',
    type: 'badge_earned',
    detail: 'Guardián del Reglamento (Acuerdo 009 de 2024)'
  },
  {
    id: 'act-4',
    timestamp: 'Hace 14 min',
    apprenticeName: 'Daniela Sofía Cuéllar',
    action: 'Evaluación Gamificada',
    type: 'quiz_passed',
    detail: 'Racha de 3 aciertos en Módulo 3 (+170 XP)'
  }
];
