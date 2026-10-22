import React, { useState } from 'react';
import { Search, Scale, BookOpen, AlertCircle, CheckCircle2, ChevronRight, FileText } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface ArticleItem {
  number: string;
  title: string;
  chapter: string;
  summary: string;
  keyPoints: string[];
  tags: string[];
}

const REGULATION_ARTICLES: ArticleItem[] = [
  {
    number: 'Capítulo I',
    title: 'Definiciones y Principios de la Formación Profesional Integral',
    chapter: 'Capítulo I: Marco General',
    summary: 'Define los conceptos clave: Formación Profesional Integral (FPI), Comunidad Educativa SENA, Aspirante, Aprendiz y Modelo Pedagógico Institucional.',
    keyPoints: [
      'El aprendiz es el centro de la formación profesional integral.',
      'La formación fomenta el libre pensamiento, la solidaridad, la dignidad humana y el rigor técnico.',
      'Aplica a formación presencial, virtual y combinada en todo el territorio nacional.'
    ],
    tags: ['definiciones', 'principios', 'fpi', 'aprendiz', 'comunidad']
  },
  {
    number: 'Artículo 5',
    title: 'Derechos Fundamentales del Aprendiz SENA (24 Derechos)',
    chapter: 'Capítulo II: Derechos y Reconocimientos',
    summary: 'Consagra 24 garantías explícitas que amparan al aprendiz durante toda su trayectoria en el SENA.',
    keyPoints: [
      'Derecho a recibir una inducción oportuna y completa.',
      'Derecho a formación de calidad y trato digno sin discriminación.',
      'Derecho al debido proceso, presunción de inocencia y a ser escuchado en descargos.',
      'Derecho a utilizar la infraestructura, laboratorios y biblioteca virtual.',
      'Derecho a la libre expresión y a postularse como vocero o representante estudiantil.',
      'Derecho a solicitar planes de mejoramiento pedagógico ante evaluaciones insatisfechas.'
    ],
    tags: ['derechos', 'artículo 5', 'debido proceso', 'inducción', 'garantías', '24 derechos']
  },
  {
    number: 'Artículo 8',
    title: 'Deberes del Aprendiz SENA',
    chapter: 'Capítulo III: Deberes y Prohibiciones',
    summary: 'Establece las responsabilidades académicas, éticas y de convivencia que asume cada aprendiz matriculado.',
    keyPoints: [
      'Portar visiblemente el carné institucional dentro de las instalaciones.',
      'Cumplir puntualmente con los horarios y el cronograma de evidencias en Zajuna.',
      'Utilizar los uniformes y elementos de protección personal (EPP) según la especialidad.',
      'Cuidar los bienes, maquinarias y herramientas asignadas.',
      'Custodiar de forma personal e intransferible las credenciales de acceso a las plataformas.'
    ],
    tags: ['deberes', 'artículo 8', 'carné', 'uniforme', 'epp', 'asistencia', 'zajuna']
  },
  {
    number: 'Artículo 9',
    title: 'Prohibiciones Expresas del Aprendiz',
    chapter: 'Capítulo III: Deberes y Prohibiciones',
    summary: 'Lista taxativamente los comportamientos que quebrantan la convivencia, la ley o la integridad académica.',
    keyPoints: [
      'Prohibido el plagio, la copia o fraude en evaluaciones y proyectos formativos.',
      'Prohibida la suplantación de identidad en Zajuna, Sofia Plus o actividades presenciales.',
      'Prohibido ingresar, comercializar o consumir bebidas alcohólicas o sustancias psicoactivas.',
      'Prohibido portar armas de fuego, blancas o cualquier artefacto peligroso.',
      'Prohibido el acoso, la agresión física, verbal o virtual contra cualquier miembro de la comunidad.'
    ],
    tags: ['prohibiciones', 'artículo 9', 'plagio', 'fraude', 'alcohol', 'drogas', 'armas', 'violencia', 'suplantación']
  },
  {
    number: 'Capítulo IV',
    title: 'Clasificación y Criterios de Calificación de las Faltas',
    chapter: 'Capítulo IV: Régimen Disciplinario',
    summary: 'Clasifica las faltas en académicas o disciplinarias, y las califica según su gravedad en leves, graves o gravísimas.',
    keyPoints: [
      'Faltas Académicas: Incumplimiento de evidencias, bajo rendimiento o inasistencia.',
      'Faltas Disciplinarias: Violación de normas de convivencia, daño a bienes o agresión.',
      'Criterios de graduación: Daño causado, reiteración, intencionalidad y antecedentes.'
    ],
    tags: ['faltas', 'graves', 'gravísimas', 'leves', 'académicas', 'disciplinarias']
  },
  {
    number: 'Capítulo V',
    title: 'Medidas Formativas y Sanciones Disciplinarias',
    chapter: 'Capítulo V: Procedimiento Formativo y Sanciones',
    summary: 'Distingue entre acciones pedagógicas preventivas y sanciones formales expedidas por el Subdirector de Centro.',
    keyPoints: [
      'Medidas Formativas: Llamado de atención verbal y Plan de Mejoramiento concertado.',
      'Sanciones: Llamado de atención por escrito, Condicionamiento de matrícula y Cancelación de matrícula.',
      'La Cancelación de Matrícula acarrea inhabilidad de entre 6 meses y hasta 2 años.'
    ],
    tags: ['sanciones', 'plan de mejoramiento', 'cancelación de matrícula', 'condicionamiento', 'inhabilidad']
  },
  {
    number: 'Capítulo VI',
    title: 'Comité de Evaluación y Seguimiento y Recursos de Ley',
    chapter: 'Capítulo VI: Debido Proceso e Instancias',
    summary: 'Reglamenta el funcionamiento del comité de evaluación, la citación a descargos y los recursos jurídicos.',
    keyPoints: [
      'El comité está compuesto por coordinadores, instructores, vocero y bienestar.',
      'Garantía de traslado de pruebas y derecho a presentar descargos escritos o verbales.',
      'Contra el acto sancionatorio procede el Recurso de Reposición ante el Subdirector de Centro.'
    ],
    tags: ['comité', 'descargos', 'recurso de reposición', 'debido proceso', 'subdirector']
  }
];

export const RegulationSearchDrawer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem>(REGULATION_ARTICLES[1]);

  const filteredArticles = REGULATION_ARTICLES.filter(art => {
    const term = searchTerm.toLowerCase();
    return (
      art.title.toLowerCase().includes(term) ||
      art.summary.toLowerCase().includes(term) ||
      art.number.toLowerCase().includes(term) ||
      art.tags.some(tag => tag.toLowerCase().includes(term))
    );
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Search Header Banner */}
      <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#00324D] uppercase tracking-wider">
            <Scale className="w-4 h-4 text-[#39A900]" />
            <span>Marco Normativo Oficial SENA</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Acuerdo 009 de 2024 · Consejo Directivo Nacional
          </span>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Compendio Oficial del Reglamento del Aprendiz
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Consulta artículos, derechos, deberes y protocolos de evaluación vigentes. Utiliza el buscador para localizar cualquier concepto clave.
        </p>

        {/* Search Input Bar */}
        <div className="mt-6 relative max-w-xl">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por artículo, término (ej. plagio, carné, 24 derechos, comité, falta gravísima)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Main Two-Column Articles Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of Articles */}
        <div className="lg:col-span-5 space-y-3">
          {filteredArticles.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-sm text-slate-500">
              No se encontraron artículos que coincidan con "{searchTerm}".
            </div>
          ) : (
            filteredArticles.map(art => {
              const isSelected = selectedArticle.number === art.number;
              return (
                <button
                  key={art.number}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedArticle(art);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-white border-[#39A900] shadow-xs ring-1 ring-[#39A900]'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      isSelected
                        ? 'bg-emerald-50 text-[#39A900]'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[#00324D]">
                      {art.number}
                    </div>
                    <div className="text-sm font-semibold text-slate-900 truncate mt-0.5">
                      {art.title}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {art.summary}
                    </p>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'text-[#39A900] translate-x-1' : 'text-slate-300'
                    }`}
                  />
                </button>
              );
            })
          )}
        </div>

        {/* Right Article Detail Sheet */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span>{selectedArticle.chapter}</span>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 tracking-tight">
              {selectedArticle.title}
            </h3>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed mb-6">
              {selectedArticle.summary}
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#39A900]" />
              Disposiciones y Puntos Clave
            </h4>

            <ul className="space-y-2.5 text-xs md:text-sm text-slate-700">
              {selectedArticle.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#39A900] mt-2 shrink-0" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>

            {/* Keyword tags */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
              {selectedArticle.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Fuente: Acuerdo 009 de 2024 SENA</span>
            <span className="font-semibold text-[#39A900]">Documento Oficial Vigente</span>
          </div>
        </div>
      </div>
    </div>
  );
};
