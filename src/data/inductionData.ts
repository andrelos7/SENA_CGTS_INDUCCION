import { InductionModule, BadgeInfo, CaseScenario } from '../types/induction';

export const SENA_BADGES: BadgeInfo[] = [
  {
    id: 'badge-identidad',
    name: 'Identidad SENA',
    description: 'Completaste el módulo de historia, símbolos y plataformas institucionales.',
    icon: '🏛️',
    unlockedAtModule: 1
  },
  {
    id: 'badge-deberes',
    name: 'Guardián del Reglamento',
    description: 'Dominaste los deberes y prohibiciones según el Acuerdo 009 de 2024.',
    icon: '⚖️',
    unlockedAtModule: 2
  },
  {
    id: 'badge-derechos',
    name: 'Voz y Bienestar',
    description: 'Conoces tus 24 derechos fundamentales y rutas de bienestar al aprendiz.',
    icon: '🛡️',
    unlockedAtModule: 3
  },
  {
    id: 'badge-productiva',
    name: 'Rumbo Productivo',
    description: 'Identificaste las 5 alternativas oficiales para tu etapa práctica.',
    icon: '🚀',
    unlockedAtModule: 4
  },
  {
    id: 'badge-disciplina',
    name: 'Líder de Convivencia',
    description: 'Superaste el módulo sobre el Comité de Evaluación y debido proceso.',
    icon: '📜',
    unlockedAtModule: 5
  },
  {
    id: 'badge-maestro',
    name: 'Aprendiz Ejemplar SENA',
    description: 'Aprobaste la inducción integral con un puntaje superior al 85%.',
    icon: '🏆'
  }
];

export const INDUCTION_MODULES: InductionModule[] = [
  {
    id: 'modulo-1',
    number: 1,
    title: 'Identidad, Historia y Plataformas SENA',
    tagline: 'Conoce la institución más querida por los colombianos',
    estimatedMinutes: 20,
    iconName: 'Compass',
    color: '#39A900',
    summary: 'Explora los orígenes del SENA desde su fundación en 1957, su misión formadora, los símbolos patrios e institucionales, y las herramientas tecnológicas (Zajuna, Sofia Plus y APE) que impulsarán tu formación.',
    officialAgreement: 'Constitución Nacional & Estatutos Generales SENA',
    sections: [
      {
        id: 'sec-1-1',
        title: 'Nacimiento e Historia del SENA',
        subtitle: 'Una iniciativa de visión social y desarrollo productivo',
        content: `El Servicio Nacional de Aprendizaje (SENA) nació el 21 de junio de 1957 durante el gobierno de la Junta Militar, gracias a la visión visionaria del economista cartagenero **Rodolfo Martínez Tono** (1927-2015), en estrecha alianza con organizaciones de trabajadores sindicalizados y gremios empresariales. 

Su propósito fundacional fue brindar formación profesional y técnica a millones de trabajadores colombianos para dinamizar la industria y el campo nacional con inclusión y equidad.`,
        highlights: [
          'Fundado el 21 de junio de 1957 por Rodolfo Martínez Tono.',
          'Misión: Invertir en el desarrollo social y técnico de los trabajadores colombianos.',
          'Presencia en los 32 departamentos de Colombia con más de 117 centros de formación.',
          'Entidad pública de carácter tripartito: Gobierno, Trabajadores y Empresarios.'
        ],
        interactiveElement: {
          type: 'timeline',
          data: [
            { year: '1957', event: 'Creación del SENA mediante Decreto Ley 118 de 1957 por Rodolfo Martínez Tono.' },
            { year: '1960s', event: 'Expansión a centros agropecuarios e industriales en toda Colombia.' },
            { year: '1990s', event: 'Ley 119 de 1994: Reestructuración y modernización de la Formación Profesional Integral.' },
            { year: '2020+', event: 'Evolución digital con Zajuna LMS, Inteligencia Artificial y SENA Digital.' }
          ]
        }
      },
      {
        id: 'sec-1-2',
        title: 'Símbolos Institucionales',
        subtitle: 'El Escudo, la Bandera, el Logotipo y el Himno del SENA',
        content: `Los símbolos del SENA representan la trilogía de los sectores de la economía colombiana: el campo (primario), la industria (secundario) y los servicios (terciario).

- **El Escudo**: Refleja los tres sectores productivos sobre los cuales se proyecta la labor del SENA: la rueda dentada (industria y construcción), el caduceo (comercio y servicios) y la rama de café (sector agropecuario).
- **La Bandera**: De color blanco puro de fondo con el escudo del SENA en el centro, simboliza la paz, la tranquilidad y la transparencia en la formación de los aprendices.
- **El Logosímbolo**: Representa a un aprendiz caminando con paso firme y brazos en alto hacia el futuro, superando los caminos del conocimiento y el trabajo.
- **El Himno**: Compuesto en su letra por Jesús Briceño Sánchez y música de Luis Alfredo Sarmiento, entona con orgullo: *"Estudiantes del SENA adelante, por Colombia luchad con amor..."*`,
        regulatoryReference: 'Manual de Identidad Visual Institucional SENA',
        highlights: [
          'Escudo: Rueda dentada (industria), caduceo (comercio/servicios), rama de café (agro).',
          'Bandera: Fondo blanco con escudo institucional.',
          'Logosímbolo: Hombre caminando hacia el horizonte del conocimiento y la tecnología.',
          'Himno: Llamado cívico al esfuerzo, la disciplina y el amor patrio.'
        ],
        interactiveElement: {
          type: 'audio-hymn',
          data: {
            title: 'Coro del Himno SENA',
            lyrics: 'Estudiantes del SENA, ¡adelante!\nPor Colombia luchad con amor,\ncon el ánimo noble y radiante,\ntransformemos el mundo en mejor.'
          }
        }
      },
      {
        id: 'sec-1-3',
        title: 'Ecosistema Digital: Zajuna, Sofia Plus y APE',
        subtitle: 'Tus canales oficiales para la gestión del aprendizaje y empleo',
        content: `Como aprendiz SENA interactuarás permanentemente con el ecosistema digital institucional:

1. **Zajuna (LMS Oficial)**: Plataforma de aprendizaje virtual donde descargas guías de aprendizaje, participas en foros, subes evidencias y recibes retroalimentación técnica de tus instructores.
2. **SENA SOFIA Plus**: Sistema de gestión académica donde consultas tu ficha de matrícula, estado académico, asignación de rutas y certificaciones formales.
3. **Agencia Pública de Empleo (APE)**: Plataforma de intermediación laboral gratuita que conecta el talento de los aprendices y egresados con empresas colombianas e internacionales.
4. **Sistema de Bibliotecas SENA (SBS)**: Acceso a millones de bases de datos científicas, normas técnicas ICONTEC y libros digitales.`,
        highlights: [
          'Zajuna: Tu aula virtual para evidencias, foros y calificaciones.',
          'Sofia Plus: Registro académico, estado de matrícula y certificados.',
          'APE: Bolsa de empleo pública y gratuita del Estado colombiano.',
          'SBS: Biblioteca digital con bases de datos especializadas y normas técnicas.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q-1-1',
        question: '¿Quién fue el principal fundador del SENA en el año 1957?',
        options: [
          'Rodolfo Martínez Tono',
          'Alberto Lleras Camargo',
          'Jesús Briceño Sánchez',
          'Luis Alfredo Sarmiento'
        ],
        correctAnswer: 0,
        explanation: 'Rodolfo Martínez Tono concibió y lideró la creación del SENA en 1957 en conjunto con gremios y sindicatos.',
        articleCitation: 'Historia Institucional SENA (Decreto Ley 118 de 1957)',
        xpReward: 50,
        difficulty: 'básico'
      },
      {
        id: 'q-1-2',
        question: '¿Qué representan los elementos del Escudo del SENA (rueda dentada, caduceo y rama de café)?',
        options: [
          'Las tres regiones climáticas de Colombia',
          'Los tres sectores económicos: industria, comercio/servicios y agropecuario',
          'Las tres sedes principales: Bogotá, Medellín y Cali',
          'Los tres niveles de formación: operario, técnico y tecnólogo'
        ],
        correctAnswer: 1,
        explanation: 'El escudo del SENA representa los tres grandes sectores productivos colombianos: la industria (rueda), el comercio/servicios (caduceo) y el agro (rama de café).',
        articleCitation: 'Manual de Identidad Visual y Símbolos SENA',
        xpReward: 50,
        difficulty: 'básico'
      },
      {
        id: 'q-1-3',
        question: '¿Cuál es la plataforma LMS oficial donde el aprendiz gestiona sus evidencias, guías y actividades formativas virtuales?',
        options: [
          'Google Classroom',
          'Zajuna',
          'SENA Web Master',
          'Moodle General'
        ],
        correctAnswer: 1,
        explanation: 'Zajuna es el ambiente virtual de aprendizaje (LMS) oficial del SENA para el desarrollo de la formación.',
        articleCitation: 'Ecosistema Tecnológico SENA',
        xpReward: 60,
        difficulty: 'intermedio'
      }
    ]
  },
  {
    id: 'modulo-2',
    number: 2,
    title: 'Reglamento del Aprendiz: Deberes y Prohibiciones',
    tagline: 'Conoce tus responsabilidades bajo el Acuerdo 009 de 2024',
    estimatedMinutes: 25,
    iconName: 'Scale',
    color: '#00324D',
    summary: 'Aprende los deberes ineludibles y las conductas prohibidas estipuladas en el nuevo Reglamento del Aprendiz (Acuerdo 009 de 2024), garantizando una convivencia armónica y excelencia académica.',
    officialAgreement: 'Acuerdo 009 de 2024 - Capítulos I y III',
    sections: [
      {
        id: 'sec-2-1',
        title: 'Marco Normativo: El Acuerdo 009 de 2024',
        subtitle: 'La norma vigente que rige a todos los aprendices del SENA',
        content: `El Consejo Directivo Nacional del SENA expidió el **Acuerdo 009 de 2024**, el cual adopta el nuevo Reglamento del Aprendiz SENA y deroga formalmente los antiguos Acuerdos 007 de 2012, 002 de 2014, 006 de 2023 y 002 de 2024.

Este reglamento rige de manera obligatoria para todas las personas matriculadas en el SENA en cualquier modalidad (presencial, virtual, a distancia o dual), desde la matrícula inicial hasta la obtención del certificado laboral o técnico.`,
        regulatoryReference: 'Acuerdo 009 de 2024 - Preámbulo y Ámbito de Aplicación',
        highlights: [
          'Acuerdo 009 de 2024 es el ÚNICO reglamento vigente aplicable.',
          'Derogó en su totalidad el Acuerdo 007 de 2012 y el 002 de 2014.',
          'Aplica a formación presencial, virtual, combinada y modalidades especiales.',
          'Define los estándares de permanencia, evaluación y convivencia.'
        ]
      },
      {
        id: 'sec-2-2',
        title: 'Deberes del Aprendiz SENA (Artículo 8)',
        subtitle: 'Compromisos académicos, éticos y de convivencia ciudadana',
        content: `El Artículo 8 del Acuerdo 009 de 2024 consagra los deberes que asume cada aprendiz:

1. **Cumplimiento Formativo**: Asistir con puntualidad a las sesiones presenciales o sincrónicas y desarrollar activamente las actividades formativas y evidencias en los plazos fijados.
2. **Identificación Institucional**: Portar permanentemente y de manera visible el carné institucional dentro de las sedes y durante actividades externas de formación.
3. **Uso de Uniforme**: Portar la indumentaria o elementos de protección personal (EPP) y uniforme exigidos por el Centro de Formación y la especialidad técnica.
4. **Cuidado de Bienes**: Velar por el buen estado de la infraestructura, equipos, herramientas y recursos físicos o virtuales del SENA.
5. **Auto-Reconocimiento y Respeto**: Tratar con dignidad a instructores, administrativos y compañeros; y en caso de personas con discapacidad, informar oportunamente para recibir los ajustes razonables.
6. **Uso Responsable de Plataformas**: Custodiar las contraseñas de Zajuna y Sofia Plus con absoluta confidencialidad.`,
        regulatoryReference: 'Acuerdo 009 de 2024 - Artículo 8',
        highlights: [
          'Portar visiblemente el carné del SENA.',
          'Cumplir con puntualidad el horario y la entrega de evidencias formativas.',
          'Uso obligatorio de Elementos de Protección Personal (EPP) en talleres.',
          'Cuidado de los bienes públicos del Estado colombiano en custodia del SENA.',
          'Confidencialidad intransferible de credenciales de Sofia Plus y Zajuna.'
        ]
      },
      {
        id: 'sec-2-3',
        title: 'Prohibiciones Expresas (Artículo 9)',
        subtitle: 'Conductas sancionables que atentan contra la formación y la ley',
        content: `El Artículo 9 del Acuerdo 009 de 2024 especifica de forma taxativa las prohibiciones:

- **Plagio Académico y Fraude**: Presentar como propios trabajos, investigaciones, códigos o tareas ajenas sin la debida citación, o incurrir en copia durante evaluaciones.
- **Suplantación de Identidad**: Permitir que un tercero acceda a Zajuna o evaluaciones con tus credenciales, o suplantar a otro aprendiz.
- **Sustancias Prohibidas**: Ingresar, comercializar o consumir bebidas alcohólicas, estupefacientes o sustancias psicoactivas en cualquier sede del SENA o empresas de práctica.
- **Armas y Violencia**: Ingresar armas de fuego o cortopunzantes, así como protagonizar agresiones físicas, verbales, ciberacoso o cualquier tipo de violencia basada en género.
- **Uso no autorizado de la marca**: Utilizar el nombre o los símbolos del SENA para beneficio personal, proselitismo político o lucros no autorizados.`,
        regulatoryReference: 'Acuerdo 009 de 2024 - Artículo 9',
        highlights: [
          'Prohibido el plagio y la copia en exámenes o proyectos.',
          'Prohibida la suplantación de identidad en plataformas digitales.',
          'Tolerancia cero con el alcohol y sustancias psicoactivas en sedes.',
          'Prohibido el porte de armas e incitación a actos violentos.',
          'Prohibido el proselitismo político o religioso en ambientes de formación.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q-2-1',
        question: '¿Cuál es el Acuerdo actual que reglamenta los derechos, deberes y trámite sancionatorio del aprendiz SENA?',
        options: [
          'Acuerdo 009 de 2024',
          'Acuerdo 007 de 2012',
          'Acuerdo 002 de 2014',
          'Ley 119 de 1994'
        ],
        correctAnswer: 0,
        explanation: 'El Acuerdo 009 de 2024 es el reglamento actual y vigente, el cual derogó expresamente los acuerdos anteriores.',
        articleCitation: 'Acuerdo 009 de 2024, Consejo Directivo Nacional',
        xpReward: 60,
        difficulty: 'básico'
      },
      {
        id: 'q-2-2',
        question: 'De acuerdo con el Artículo 8 del Reglamento, ¿qué deber tiene el aprendiz con respecto a su carné institucional?',
        options: [
          'Guardarlo en la billetera y presentarlo solo si se le solicita por escrito',
          'Portarlo de manera visible en todo momento dentro del Centro de Formación',
          'Prestarlo a compañeros de otra ficha si olvidaron el suyo',
          'Usarlo únicamente el primer día de inducción'
        ],
        correctAnswer: 1,
        explanation: 'El carné institucional debe portarse de manera visible y permanente en los centros de formación para la seguridad y control de la comunidad.',
        articleCitation: 'Acuerdo 009 de 2024 - Artículo 8, Numeral 5',
        xpReward: 50,
        difficulty: 'básico'
      },
      {
        id: 'q-2-3',
        question: 'Si un aprendiz entrega como propia una evidencia de código o diseño descargada íntegramente de internet sin atribución, ¿en qué conducta incurre?',
        options: [
          'En un error menor subsanable sin registro',
          'En una prohibición expresa de plagio y falta a la integridad académica',
          'En un derecho de autor compartido con el centro',
          'En una alternativa de innovación permitida'
        ],
        correctAnswer: 1,
        explanation: 'El plagio y fraude académico están clasificados como prohibiciones expresas en el Artículo 9 del Acuerdo 009 de 2024.',
        articleCitation: 'Acuerdo 009 de 2024 - Artículo 9, Prohibición de Plagio',
        xpReward: 60,
        difficulty: 'intermedio'
      }
    ]
  },
  {
    id: 'modulo-3',
    number: 3,
    title: 'Derechos del Aprendiz y Bienestar Integral',
    tagline: 'Conoce tus 24 derechos fundamentales y programas de apoyo',
    estimatedMinutes: 20,
    iconName: 'Shield',
    color: '#39A900',
    summary: 'Conoce los 24 derechos que te asisten como aprendiz según el Artículo 5 del Acuerdo 009 de 2024, las instancias de participación democrática y los programas de bienestar: apoyos de sostenimiento, salud, deporte y cultura.',
    officialAgreement: 'Acuerdo 009 de 2024 - Capítulo II (Artículos 5, 6 y 7)',
    sections: [
      {
        id: 'sec-3-1',
        title: 'Los 24 Derechos del Aprendiz (Artículo 5)',
        subtitle: 'Garantías para una formación profesional integral con dignidad',
        content: `El Artículo 5 del Acuerdo 009 de 2024 amplía y precisa los **24 derechos de los aprendices**, destacando:

1. **Inducción Integral**: Recibir inducción completa y oportuna sobre la entidad, el programa formativo y el reglamento.
2. **Formación de Calidad**: Recibir formación profesional integral coherente con el diseño curricular, orientada por instructores competentes.
3. **Acceso a Infraestructura**: Utilizar los ambientes de aprendizaje, laboratorios, maquinaria, biblioteca virtual y tecnologías del centro.
4. **Retroalimentación y Calificaciones**: Conocer oportunamente las evaluaciones y recibir explicaciones pedagógicas claras para mejorar.
5. **Debido Proceso**: Ser escuchado en descargos, aportar pruebas y contar con el derecho a la defensa ante cualquier queja o queja disciplinaria.
6. **Representatividad**: Elegir y ser elegido democráticamente como vocero de ficha o representante de aprendices del centro.`,
        regulatoryReference: 'Acuerdo 009 de 2024 - Artículo 5',
        highlights: [
          '24 derechos reconocidos explícitamente en el reglamento.',
          'Derecho a la inducción integral al inicio del proceso.',
          'Derecho a retroalimentación continua y plan de mejoramiento.',
          'Garantía plena del debido proceso y presunción de inocencia.',
          'Acceso libre a ambientes, herramientas y bases de datos.'
        ]
      },
      {
        id: 'sec-3-2',
        title: 'Bienestar al Aprendiz y Apoyos de Sostenimiento',
        subtitle: 'Una política integral para la permanencia y el éxito educativo',
        content: `El Plan Nacional de Bienestar al Aprendiz acompaña tu desarrollo socioemocional, físico y cultural mediante diversos ejes:

- **Salud y Deporte**: Jornadas de medicina preventiva, torneos deportivos intercentros y gimnasios.
- **Arte y Cultura**: Danza, música, teatro y expresiones autóctonas colombianas.
- **Liderazgo y Habilidades Blandas**: Talleres de comunicación asertiva, resolución de conflictos y resiliencia.
- **Apoyos de Sostenimiento**: Subsidios económicos para aprendices en condición de vulnerabilidad (SISBÉN) durante la etapa lectiva y productiva.
- **Apoyo FIC**: Fondo de la Industria de la Construcción para programas afines.
- **Monitorías**: Reconocimiento económico a aprendices destacados que apoyan procesos pedagógicos o tecnológicos.`,
        highlights: [
          'Deporte y cultura con participación en torneos nacionales SENA.',
          'Apoyos de sostenimiento regular y FIC para poblaciones priorizadas.',
          'Monitorías para aprendices con alto rendimiento académico.',
          'Atención psicosocial y acompañamiento de salud preventiva.'
        ]
      },
      {
        id: 'sec-3-3',
        title: 'Representación Estudiantil (Artículo 7)',
        subtitle: 'Tu voz en la toma de decisiones del Centro de Formación',
        content: `La democracia participativa en el SENA se vive a través de:
- **Vocero de Ficha**: Elegido por sus compañeros de grupo para coordinar inquietudes académicas con el equipo de instructores.
- **Representante de Centro**: Elegido anualmente por voto universal de todos los aprendices del centro para integrar el Comité de Centro y canalizar proyectos de bienestar e infraestructura.`,
        regulatoryReference: 'Acuerdo 009 de 2024 - Artículo 7'
      }
    ],
    quiz: [
      {
        id: 'q-3-1',
        question: '¿Cuántos derechos fundamentales para el aprendiz consagra taxativamente el Artículo 5 del Acuerdo 009 de 2024?',
        options: [
          '10 derechos',
          '24 derechos',
          '15 derechos',
          '5 derechos'
        ],
        correctAnswer: 1,
        explanation: 'El Artículo 5 enumera 24 derechos integrales para garantizar la calidad, el debido proceso y la inclusión del aprendiz.',
        articleCitation: 'Acuerdo 009 de 2024 - Artículo 5',
        xpReward: 60,
        difficulty: 'básico'
      },
      {
        id: 'q-3-2',
        question: 'Si un instructor califica una evidencia como "No Aprobado" (D), ¿qué derecho tiene el aprendiz según el reglamento?',
        options: [
          'Abandonar la formación de manera inmediata',
          'Solicitar retroalimentación pedagógica y concertar un plan de mejoramiento',
          'Denunciar penalmente al centro de formación',
          'Repetir todo el año sin presentar la evidencia'
        ],
        correctAnswer: 1,
        explanation: 'El aprendiz tiene derecho a conocer la justificación técnica de la calificación y a solicitar un plan de mejoramiento para alcanzar la competencia.',
        articleCitation: 'Acuerdo 009 de 2024 - Artículo 5 (Derecho a la evaluación formativa)',
        xpReward: 60,
        difficulty: 'intermedio'
      },
      {
        id: 'q-3-3',
        question: '¿A qué beneficio puede postularse un aprendiz destacado académicamente para brindar apoyo pedagógico en su centro?',
        options: [
          'A un crédito bancario con tasa comercial',
          'A una Monitoría con reconocimiento económico mensual',
          'A un contrato indefinido de instructor titular',
          'A la exoneración total de evaluaciones futuras'
        ],
        correctAnswer: 1,
        explanation: 'Las monitorías son una modalidad de estímulo y apoyo económico para aprendices sobresalientes en áreas técnicas o de bienestar.',
        articleCitation: 'Plan Nacional de Bienestar al Aprendiz SENA',
        xpReward: 50,
        difficulty: 'intermedio'
      }
    ]
  },
  {
    id: 'modulo-4',
    number: 4,
    title: 'Etapas de Formación y Alternativas Productivas',
    tagline: 'Del aula al mundo del trabajo real',
    estimatedMinutes: 25,
    iconName: 'Briefcase',
    color: '#00324D',
    summary: 'Comprende la estructura de la Formación Profesional Integral dividida en Etapa Lectiva y Etapa Productiva. Conoce las 5 alternativas oficiales para certificar tu práctica laboral.',
    officialAgreement: 'Acuerdo 009 de 2024 - Capítulos de Formación y Etapa Productiva',
    sections: [
      {
        id: 'sec-4-1',
        title: 'Etapa Lectiva y Etapa Productiva',
        subtitle: 'La dualidad formadora del modelo pedagógico SENA',
        content: `La Formación Profesional Integral del SENA se compone de dos etapas complementarias:

1. **Etapa Lectiva**: Periodo donde adquieres conocimientos teóricos, habilidades técnicas de tu programa y competencias transversales (bilingüismo, ética, seguridad y salud en el trabajo, TIC).
2. **Etapa Productiva**: Periodo donde aplicas, complementas y consolidas las competencias adquiridas directamente en el sector productivo o empresarial. Es requisito indispensable para recibir el título de Técnico o Tecnólogo.`,
        highlights: [
          'Etapa Lectiva: Ambientes de aprendizaje, proyectos formativos y guías.',
          'Etapa Productiva: Aplicación práctica y real de las competencias.',
          'Bitácoras periódicas obligatorias de seguimiento con el instructor asignado.'
        ]
      },
      {
        id: 'sec-4-2',
        title: 'Las 5 Alternativas Oficiales para la Etapa Productiva',
        subtitle: 'Opciones flexibles para cumplir tu requisito de certificación',
        content: `El SENA ofrece cinco modalidades formales para realizar la etapa productiva:

1. **Contrato de Aprendizaje (Ley 789 de 2002)**: Modalidad contractual formativa donde una empresa te vincula, cubre tu ARL y EPS, y te brinda un apoyo de sostenimiento mensual fijado por ley.
2. **Proyecto Productivo (SENNOVA / Emprendimiento)**: Desarrollo de un proyecto de I+D+i, formulación con Fondo Emprender o prestación de servicios técnicos dentro del centro.
3. **Pasantía**: Práctica en empresas u organizaciones no gubernamentales (ONG) o entidades del Estado con concertación de objetivos de aprendizaje.
4. **Vínculo Laboral o Contractual**: Si ya trabajas formalmente en una empresa en funciones directamente relacionadas con tu especialidad de formación.
5. **Monitoría**: Realización de actividades de apoyo técnico o pedagógico dentro del Centro de Formación en la especialidad respectiva.`,
        regulatoryReference: 'Acuerdo 009 de 2024 & Ley 789 de 2002',
        highlights: [
          '1. Contrato de aprendizaje (con apoyo económico y seguridad social).',
          '2. Proyecto productivo con Fondo Emprender o SENNOVA.',
          '3. Pasantía empresarial o social.',
          '4. Vínculo laboral existente afín al programa.',
          '5. Monitoría técnica en el Centro de Formación.'
        ]
      },
      {
        id: 'sec-4-3',
        title: 'Seguimiento y Bitácoras de Etapa Práctica',
        subtitle: 'Evidencias periódicas para la evaluación de desempeño',
        content: `Durante la etapa productiva, debes registrar quincenalmente tus actividades en el formato de bitácora institucional y coordinar al menos dos visitas de concertación y seguimiento con el instructor de seguimiento asignado por el Centro de Formación.`,
        regulatoryReference: 'Procedimiento de Ejecución de la Formación Profesional'
      }
    ],
    quiz: [
      {
        id: 'q-4-1',
        question: '¿Cuál de las siguientes NO es una alternativa válida para realizar la Etapa Productiva en el SENA?',
        options: [
          'Contrato de Aprendizaje empresarial',
          'Proyecto Productivo con Fondo Emprender',
          'Trabajar en un empleo informal sin relación con el programa formativo',
          'Pasantía empresarial o comunitaria afín a la especialidad'
        ],
        correctAnswer: 2,
        explanation: 'Para validar la etapa productiva, las funciones deben tener relación directa con las competencias del programa de formación matriculado.',
        articleCitation: 'Reglamento del Aprendiz - Alternativas de Etapa Productiva',
        xpReward: 60,
        difficulty: 'básico'
      },
      {
        id: 'q-4-2',
        question: 'Bajo el Contrato de Aprendizaje (Ley 789 de 2002), ¿qué coberturas de seguridad social son de obligatorio cumplimiento por parte de la empresa patrocinadora?',
        options: [
          'Únicamente seguro funerario privado',
          'ARL (Riesgos Laborales) y EPS (Salud)',
          'Fondo de pensiones y cesantías únicamente',
          'Ninguna, el aprendiz asume todos los costos'
        ],
        correctAnswer: 1,
        explanation: 'La ley exige que la empresa cubra el 100% de la afiliación a ARL y EPS durante la etapa productiva del contrato de aprendizaje.',
        articleCitation: 'Ley 789 de 2002 y Acuerdo 009 de 2024',
        xpReward: 50,
        difficulty: 'intermedio'
      },
      {
        id: 'q-4-3',
        question: '¿Qué documento oficial debe diligenciar y entregar periódicamente el aprendiz a su instructor de seguimiento en etapa productiva?',
        options: [
          'Facturas de venta de la empresa',
          'Bitácoras periódicas de actividades firmadas por el coformador',
          'El examen de admisión del SENA',
          'Una carta de recomendación personal'
        ],
        correctAnswer: 1,
        explanation: 'Las bitácoras periódicas registran las evidencias y horas de práctica del aprendiz validadas por el jefe inmediato (coformador).',
        articleCitation: 'Manual de Procedimientos de Formación Profesional Integral',
        xpReward: 60,
        difficulty: 'intermedio'
      }
    ]
  },
  {
    id: 'modulo-5',
    number: 5,
    title: 'Faltas, Trámite Sancionatorio y Comité de Evaluación',
    tagline: 'Convivencia, debido proceso y comités de centro',
    estimatedMinutes: 25,
    iconName: 'Gavel',
    color: '#39A900',
    summary: 'Aprende la tipificación de faltas (académicas y disciplinarias; leves, graves y gravísimas), la diferencia entre medidas formativas y sanciones, y cómo opera el Comité de Evaluación y Seguimiento.',
    officialAgreement: 'Acuerdo 009 de 2024 - Capítulos IV, V y VI',
    sections: [
      {
        id: 'sec-5-1',
        title: 'Tipificación de las Faltas',
        subtitle: 'Faltas académicas, disciplinarias y sus grados de gravedad',
        content: `El Acuerdo 009 de 2024 clasifica las infracciones en dos naturalezas:

1. **Falta Académica**: Se relaciona directamente con el incumplimiento en la entrega de evidencias, bajo rendimiento sin justificación o inasistencia reiterada a los ambientes de formación.
2. **Falta Disciplinaria**: Se relaciona con el quebrantamiento de normas de convivencia, respeto, agresión, suplantación o afectación a los bienes de la entidad.

Las faltas se gradúan de acuerdo a su impacto en:
- **Leves**: Descuido involuntario sin daño grave que admite corrección pedagógica inmediata.
- **Graves**: Acciones que entorpecen significativamente el proceso formativo propio o de terceros.
- **Gravísimas**: Plagio reiterado, agresión física, porte de armas, consumo de sustancias ilícitas, suplantación o fraude sistemático.`,
        regulatoryReference: 'Acuerdo 009 de 2024 - Clasificación de Faltas',
        highlights: [
          'Faltas Académicas vs. Faltas Disciplinarias.',
          'Graduación: Leves, Graves y Gravísimas.',
          'Criterios: Grado de culpabilidad, daño causado y reiteración.'
        ]
      },
      {
        id: 'sec-5-2',
        title: 'Medidas Formativas vs. Sanciones Disciplinarias',
        subtitle: 'El enfoque primordial del SENA es pedagógico y restaurativo',
        content: `El reglamento diferencia claramente dos caminos:

**Medidas Formativas (Preventivas y Pedagógicas)**:
- **Llamado de atención verbal reflexivo**: Diálogo formativo con el instructor.
- **Plan de Mejoramiento Académico o Disciplinario**: Acuerdo concertado con tareas específicas y plazo definido para alcanzar los logros formativos pendientes.

**Sanciones (Aplicadas mediante Acto Administrativo motivado)**:
- **Llamado de atención por escrito**: Con copia a la hoja de vida del aprendiz en el sistema de registro.
- **Condicionamiento de matrícula**: Alerta máxima; una nueva falta ocasionará la pérdida del cupo.
- **Cancelación de Matrícula**: Implica la desvinculación formal del SENA y una inhabilidad para ingresar a programas del SENA por un periodo de entre 6 meses y hasta 2 años según la gravedad.`,
        regulatoryReference: 'Acuerdo 009 de 2024 - Medidas Formativas y Sanciones',
        highlights: [
          'Medidas formativas buscan la reflexión y corrección pedagógica.',
          'El plan de mejoramiento no constituye sanción en la hoja de vida.',
          'Cancelación de matrícula genera inhabilidad de 6 meses a 2 años.'
        ]
      },
      {
        id: 'sec-5-3',
        title: 'El Comité de Evaluación y Seguimiento',
        subtitle: 'Garantía del Debido Proceso y Derecho a la Defensa',
        content: `Cuando se presume una falta grave o gravísima, se convoca al **Comité de Evaluación y Seguimiento**:

- Está conformado por el Coordinador Misional o Académico, instructores del programa, el vocero de la ficha, bienestar al aprendiz y el aprendiz involucrado.
- Se notifica con antelación los cargos formulados para que el aprendiz ejerza su derecho a ser escuchado, presentar descargos y aportar pruebas.
- El comité emite una recomendación motivada al Subdirector de Centro, quien es la única autoridad con facultad legal para sancionar mediante resolución.
- Contra la sanción procede el **Recurso de Reposición** dentro del término legal fijado en el reglamento.`,
        regulatoryReference: 'Acuerdo 009 de 2024 - Debido Proceso y Comité de Evaluación'
      }
    ],
    quiz: [
      {
        id: 'q-5-1',
        question: '¿Quién es el único funcionario legalmente facultado para imponer una sanción de cancelación de matrícula a un aprendiz?',
        options: [
          'El instructor del área técnica',
          'El Subdirector del Centro de Formación mediante acto administrativo',
          'El vocero de la ficha',
          'El celador o guarda de seguridad de la sede'
        ],
        correctAnswer: 1,
        explanation: 'El Comité de Evaluación solo emite una recomendación; la potestad sancionatoria formal recae exclusivamente en el Subdirector de Centro mediante resolución.',
        articleCitation: 'Acuerdo 009 de 2024 - Competencia Sancionatoria',
        xpReward: 60,
        difficulty: 'intermedio'
      },
      {
        id: 'q-5-2',
        question: '¿Qué inhabilidad general conlleva la sanción de Cancelación de Matrícula para volver a inscribirse a programas del SENA?',
        options: [
          'Inhabilidad de por vida en todas las universidades',
          'Inhabilidad de entre 6 meses y hasta 2 años según la gravedad de la falta',
          'Ninguna, puede matricularse al día siguiente en otro centro',
          'Inhabilidad de 10 años'
        ],
        correctAnswer: 1,
        explanation: 'La cancelación de matrícula por faltas graves o gravísimas acarrea una inhabilidad legal que oscila entre 6 meses y 2 años.',
        articleCitation: 'Acuerdo 009 de 2024 - Efectos de las Sanciones',
        xpReward: 60,
        difficulty: 'intermedio'
      },
      {
        id: 'q-5-3',
        question: '¿Cuál es la primera medida preventiva y formativa que se concerta con un aprendiz que presenta dificultades académicas antes de una sanción?',
        options: [
          'Expulsión inmediata del grupo de WhatsApp',
          'Plan de Mejoramiento Académico concertado con actividades específicas',
          'Multa en dinero en efectivo',
          'Trabajo forzoso en el archivo'
        ],
        correctAnswer: 1,
        explanation: 'El Plan de Mejoramiento es la medida pedagógica fundamental para permitir al aprendiz superar sus deficiencias antes de iniciar trámites sancionatorios.',
        articleCitation: 'Acuerdo 009 de 2024 - Medidas Formativas',
        xpReward: 50,
        difficulty: 'básico'
      }
    ]
  }
];

export const REGULATION_CASE_STUDIES: CaseScenario[] = [
  {
    id: 'caso-1',
    title: 'El Préstamo de Credenciales en Zajuna',
    character: 'Fabián',
    role: 'Aprendiz Tecnólogo en ADSO',
    situation: 'Fabián no pudo terminar la evaluación de la fase de análisis debido a problemas de internet en su casa. Un compañero le ofrece su usuario y contraseña para ingresar y descargar las preguntas y respuestas del cuestionario.',
    options: [
      {
        text: 'Aceptar el usuario de su compañero y responder la evaluación rápidamente sin que nadie lo note.',
        isCorrect: false,
        consequence: 'Incurre en falta gravísima por suplantación de identidad y uso indebido de credenciales según el Artículo 9 del Acuerdo 009 de 2024.',
        regulatoryOutcome: 'Remisión directa a Comité de Evaluación y Seguimiento con posible cancelación de matrícula.'
      },
      {
        text: 'Rechazar la oferta e informar oportunamente a su instructor con las evidencias de la falla de conectividad para solicitar reapertura formal.',
        isCorrect: true,
        consequence: 'Actuación ética correcta. El instructor revisa el caso y otorga un plazo extraordinario justificado.',
        regulatoryOutcome: 'Respeto al principio de transparencia institucional y preservación de su historial académico.'
      },
      {
        text: 'Copiar las respuestas de otro compañero y compartirlas en un grupo público de redes sociales.',
        isCorrect: false,
        consequence: 'Agrava la falta al incurrir en fraude masivo y difusión no autorizada de material evaluativo.',
        regulatoryOutcome: 'Apertura de proceso sancionatorio para todos los aprendices involucrados.'
      }
    ]
  },
  {
    id: 'caso-2',
    title: 'Dificultad en el Ambiente de Aprendizaje y EPP',
    character: 'Mariana',
    role: 'Aprendiz en Mantenimiento Mecatrónico',
    situation: 'Durante la práctica en el taller de soldadura y mecanizado, Mariana olvidó sus gafas de seguridad y botas dieléctricas reglamentarias. El instructor le indica que no puede ingresar a la máquina torno sin sus EPP.',
    options: [
      {
        text: 'Ingresar a escondidas cuando el instructor esté atendiendo a otro grupo.',
        isCorrect: false,
        consequence: 'Pone en riesgo su integridad física y la de sus compañeros, violando normas de Seguridad y Salud en el Trabajo (SST).',
        regulatoryOutcome: 'Falta disciplinaria grave con llamado de atención por escrito.'
      },
      {
        text: 'Acudir a la oficina de bienestar o almacén del centro para verificar préstamo temporal de EPP y acatar las indicaciones de seguridad.',
        isCorrect: true,
        consequence: 'Preserva su salud ocupacional y cumple con el Artículo 8 del Reglamento sobre porte de indumentaria de seguridad.',
        regulatoryOutcome: 'Desarrollo seguro de la competencia práctica sin incidentes.'
      },
      {
        text: 'Discutir agresivamente con el instructor acusándolo de impedirle su derecho a la educación.',
        isCorrect: false,
        consequence: 'Incurre en irrespeto a la autoridad pedagógica e insubordinación a protocolos de seguridad industrial.',
        regulatoryOutcome: 'Reporte a coordinación y citación a descargos.'
      }
    ]
  },
  {
    id: 'caso-3',
    title: 'Elección de la Modalidad Productiva',
    character: 'Camilo',
    role: 'Aprendiz en Gestión Contable y Financiera',
    situation: 'Camilo culminó exitosamente su etapa lectiva y una microempresa familiar informal le ofrece trabajar como repartidor en moto, ofreciéndole firmar una certificación como si fuera auxiliar contable.',
    options: [
      {
        text: 'Aceptar la propuesta informal para salir del paso rápido de su etapa práctica.',
        isCorrect: false,
        consequence: 'Fraude documental y simulación de práctica laboral. Si la visita de seguimiento detecta funciones no afines, la práctica será anulada.',
        regulatoryOutcome: 'Pérdida del periodo de práctica y apertura de investigación disciplinaria.'
      },
      {
        text: 'Buscar una empresa mediante la plataforma SGVA para contrato de aprendizaje o postular su proyecto a Fondo Emprender en el Centro.',
        isCorrect: true,
        consequence: 'Garantiza experiencia laboral real, cobertura de ley (ARL/EPS) y certificación transparente de competencias.',
        regulatoryOutcome: 'Certificación exitosa como Tecnólogo SENA con alta empleabilidad.'
      }
    ]
  }
];
