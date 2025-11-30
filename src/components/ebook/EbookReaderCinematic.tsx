import { useState, useEffect, useRef } from 'react';
import { 
  Book, ChevronLeft, ChevronRight, Menu, X, CheckCircle2, 
  Circle, Home, BookOpen, ChevronDown, Maximize2, Minimize2,
  Clock, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import ebookData from '@/data/ebook-content';
import ebookCover from '@/assets/ebook-cover-new.png';

import type { ChecklistItem as BaseChecklistItem } from '@/data/ebook-content';

interface ChecklistItem extends BaseChecklistItem {
  checked: boolean;
}

const EbookReaderCinematic = () => {
  const navigate = useNavigate();
  const [activeChapter, setActiveChapter] = useState(-1); // -1 = capa
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCover, setShowCover] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [checklists, setChecklists] = useState<Record<string, ChecklistItem[]>>(
    ebookData.chapters.reduce((acc, chapter) => {
      if (chapter.checklist && chapter.checklist.length > 0) {
        acc[chapter.id] = chapter.checklist.map(item => ({
          ...item,
          checked: false
        }));
      }
      return acc;
    }, {} as Record<string, ChecklistItem[]>)
  );

  // Calcular progresso de leitura
  useEffect(() => {
    const totalChapters = ebookData.chapters.length;
    const progress = activeChapter >= 0 ? ((activeChapter + 1) / totalChapters) * 100 : 0;
    setReadingProgress(progress);
  }, [activeChapter]);

  // Scroll tracking para progresso
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        const scrollProgress = (scrollTop / (scrollHeight - clientHeight)) * 100;
        // Pode ser usado para micro-progresso dentro do capítulo
      }
    };
    
    contentRef.current?.addEventListener('scroll', handleScroll);
    return () => contentRef.current?.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goToNextChapter();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevChapter();
      } else if (e.key === 'Escape') {
        if (isFullscreen) toggleFullscreen();
        if (isSidebarOpen) setIsSidebarOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeChapter, isFullscreen, isSidebarOpen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const startReading = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowCover(false);
      setActiveChapter(0);
      setIsTransitioning(false);
    }, 600);
  };

  const goToChapter = (index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveChapter(index);
      setShowCover(false);
      setIsSidebarOpen(false);
      setIsTransitioning(false);
      contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
  };

  const goToNextChapter = () => {
    if (activeChapter < ebookData.chapters.length - 1) {
      goToChapter(activeChapter + 1);
    }
  };

  const goToPrevChapter = () => {
    if (activeChapter > 0) {
      goToChapter(activeChapter - 1);
    } else if (activeChapter === 0) {
      setShowCover(true);
      setActiveChapter(-1);
    }
  };

  const toggleChecklistItem = (chapterId: string, itemId: string) => {
    setChecklists(prev => ({
      ...prev,
      [chapterId]: prev[chapterId].map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    }));
  };

  const currentChapter = activeChapter >= 0 ? ebookData.chapters[activeChapter] : null;

  const renderContent = (content: any) => {
    if (!content) return null;

    return (
      <div className="space-y-10">
        {/* Intro */}
        {content.intro && (
          <p 
            className="text-xl md:text-2xl leading-relaxed text-slate-300 font-light animate-fade-in"
            dangerouslySetInnerHTML={{ 
              __html: content.intro.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>') 
            }}
          />
        )}

        {/* Sections */}
        {content.sections && content.sections.map((section: any, idx: number) => (
          <div 
            key={idx} 
            className="space-y-6 animate-fade-in"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            {section.title && (
              <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 flex items-center gap-3">
                <span className="w-1 h-8 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full"></span>
                {section.title}
              </h2>
            )}

            {section.description && (
              <p 
                className="text-lg leading-relaxed text-slate-300"
                dangerouslySetInnerHTML={{ 
                  __html: section.description.replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-400">$1</strong>') 
                }}
              />
            )}

            {section.items && (
              <ul className="space-y-4 ml-2">
                {section.items.map((item: string, i: number) => (
                  <li 
                    key={i} 
                    className="flex items-start gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span 
                      className="text-lg text-slate-200" 
                      dangerouslySetInnerHTML={{ 
                        __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') 
                      }} 
                    />
                  </li>
                ))}
              </ul>
            )}

            {section.example && (
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 p-6 my-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                <h3 className="font-bold text-xl mb-4 text-emerald-400 flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  {section.example.title}
                </h3>
                <p className="text-lg text-slate-200 mb-4 whitespace-pre-line">{section.example.scenario}</p>
                {section.example.key_point && (
                  <p className="text-emerald-400 font-medium mt-4 p-3 bg-emerald-500/10 rounded-lg">
                    ✨ {section.example.key_point}
                  </p>
                )}
                {section.example.warning && (
                  <p className="text-amber-400 font-medium mt-4 p-3 bg-amber-500/10 rounded-lg">
                    ⚠️ {section.example.warning}
                  </p>
                )}
              </div>
            )}

            {section.features && (
              <div className="grid gap-4">
                {section.features.map((feature: string, i: number) => (
                  <div 
                    key={i} 
                    className="flex items-start gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-emerald-500/30 transition-all duration-300 group"
                  >
                    <Circle className="w-3 h-3 text-emerald-400 mt-2 flex-shrink-0 fill-current group-hover:scale-125 transition-transform" />
                    <span 
                      className="text-lg text-slate-300" 
                      dangerouslySetInnerHTML={{ 
                        __html: feature.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') 
                      }} 
                    />
                  </div>
                ))}
              </div>
            )}

            {section.steps && (
              <ol className="space-y-4">
                {section.steps.map((step: string, i: number) => (
                  <li key={i} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center flex-shrink-0 font-bold text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                      {i + 1}
                    </div>
                    <span className="text-lg text-slate-200 pt-2">{step}</span>
                  </li>
                ))}
              </ol>
            )}

            {section.criteria && (
              <div className="space-y-6">
                {section.criteria.map((criterion: any, i: number) => (
                  <div 
                    key={i} 
                    className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 p-6 hover:border-emerald-500/30 transition-all duration-300"
                  >
                    <h3 className="font-bold text-xl mb-3 text-white">
                      {criterion.name}
                    </h3>
                    <p className="text-lg text-slate-300 mb-4">{criterion.description}</p>
                    {criterion.tip && (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
                        <p className="text-emerald-400">
                          <strong>💡 Dica:</strong> {criterion.tip}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {section.profiles && (
              <div className="grid md:grid-cols-3 gap-6">
                {section.profiles.map((profile: any, i: number) => (
                  <div 
                    key={i} 
                    className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10 p-6 hover:border-emerald-500/30 hover:transform hover:scale-[1.02] transition-all duration-300"
                  >
                    <h3 className="text-xl font-bold mb-4 text-white">{profile.type}</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-3 text-emerald-400">Características:</p>
                        <ul className="space-y-2">
                          {profile.characteristics.map((char: string, j: number) => (
                            <li key={j} className="text-slate-300 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                              {char}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-slate-400">
                          <strong className="text-white">Ideal para:</strong> {profile.ideal_for}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.warnings && (
              <div className="rounded-2xl bg-gradient-to-br from-red-500/20 to-red-900/10 border border-red-500/30 p-6">
                <h3 className="font-bold text-xl mb-4 text-red-400 flex items-center gap-2">
                  <span className="text-2xl">⚠️</span>
                  Sinais de Alerta
                </h3>
                <ul className="space-y-3">
                  {section.warnings.map((warning: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-slate-200">
                      <span className="text-red-400">⚠️</span>
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {section.rules && (
              <div className="space-y-6">
                {section.rules.map((rule: any, i: number) => (
                  <div 
                    key={i} 
                    className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 p-6"
                  >
                    <h3 className="font-bold text-xl mb-3 text-emerald-400">
                      {rule.rule}
                    </h3>
                    <p className="text-lg text-slate-300 mb-4">{rule.description}</p>
                    {rule.example && (
                      <p className="text-slate-400 mb-3 p-3 bg-white/5 rounded-lg">
                        <strong className="text-white">Exemplo:</strong> {rule.example}
                      </p>
                    )}
                    {rule.benefit && (
                      <p className="text-emerald-400 p-3 bg-emerald-500/10 rounded-lg">
                        <strong>✨ Benefício:</strong> {rule.benefit}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {section.benefits && (
              <div className="space-y-6">
                {section.benefits.map((benefit: any, i: number) => (
                  <div 
                    key={i} 
                    className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 p-6"
                  >
                    <h3 className="font-bold text-xl mb-3 text-white flex items-center gap-2">
                      {benefit.name}
                    </h3>
                    <p className="text-lg text-slate-300 mb-4">{benefit.description}</p>
                    <div className="p-4 bg-emerald-500/10 rounded-xl">
                      <p className="text-emerald-400">
                        <strong>📊 Impacto:</strong> {benefit.impact}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.risks && (
              <div className="space-y-6">
                {section.risks.map((risk: any, i: number) => (
                  <div 
                    key={i} 
                    className="rounded-2xl bg-gradient-to-br from-amber-500/10 to-red-500/5 border border-amber-500/20 p-6"
                  >
                    <h3 className="font-bold text-xl mb-3 text-white">
                      {risk.name}
                    </h3>
                    <p className="text-lg text-slate-300 mb-4">{risk.description}</p>
                    <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                      <p className="text-emerald-400">
                        {risk.mitigation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.message && (
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 p-8 my-8">
                <p className="text-lg text-slate-200 whitespace-pre-line leading-relaxed">
                  {section.message}
                </p>
              </div>
            )}

            {section.summary && (
              <div className="space-y-3">
                {section.summary.map((item: string, i: number) => (
                  <div 
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span 
                      className="text-slate-200"
                      dangerouslySetInnerHTML={{ 
                        __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') 
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {section.steps_detailed && (
              <div className="space-y-6">
                {section.steps_detailed.map((step: any, i: number) => (
                  <div 
                    key={i}
                    className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 p-6 hover:border-emerald-500/30 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center flex-shrink-0 font-bold text-white text-lg shadow-lg shadow-emerald-500/20">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-white mb-2">{step.step}</h4>
                        <p className="text-slate-300 mb-3">{step.action}</p>
                        <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
                          <Clock className="w-3 h-3 mr-1" />
                          {step.time}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.mindset && (
              <div className="space-y-6">
                {section.mindset.map((item: any, i: number) => (
                  <div 
                    key={i}
                    className="rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/5 border border-purple-500/20 p-6"
                  >
                    <h4 className="text-xl font-bold text-white mb-3">{item.principle}</h4>
                    <p className="text-slate-300 mb-4">{item.description}</p>
                    <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                      <p className="text-emerald-400">{item.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.resources && (
              <div className="grid md:grid-cols-2 gap-4">
                {section.resources.map((resource: string, i: number) => (
                  <div 
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all"
                  >
                    <span 
                      className="text-slate-200"
                      dangerouslySetInnerHTML={{ 
                        __html: resource.replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-400">$1</strong>') 
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // COVER SCREEN
  if (showCover) {
    return (
      <div className={`fixed inset-0 bg-[#0a0a0f] flex items-center justify-center overflow-hidden transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[150px]"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a2e10_1px,transparent_1px),linear-gradient(to_bottom,#1a1a2e10_1px,transparent_1px)] bg-[size:60px_60px]"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-5 py-2 mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-emerald-400 text-sm font-medium">Acesso VIP Exclusivo</span>
          </div>

          {/* Cover Image */}
          <div className="relative mb-10 animate-float">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent z-10"></div>
            <img 
              src={ebookCover}
              alt="Ebook Cover"
              className="w-full max-w-md mx-auto rounded-2xl shadow-2xl shadow-emerald-500/20"
            />
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in" style={{ animationDelay: '200ms' }}>
            {ebookData.title}
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '400ms' }}>
            {ebookData.subtitle}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mb-12 animate-fade-in" style={{ animationDelay: '600ms' }}>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">{ebookData.chapters.length}</div>
              <div className="text-slate-500 text-sm">Capítulos</div>
            </div>
            <div className="w-px h-12 bg-slate-800"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">~45</div>
              <div className="text-slate-500 text-sm">Minutos</div>
            </div>
            <div className="w-px h-12 bg-slate-800"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">100%</div>
              <div className="text-slate-500 text-sm">Prático</div>
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            onClick={startReading}
            className="h-16 px-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xl rounded-2xl shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:scale-105 animate-fade-in group"
            style={{ animationDelay: '800ms' }}
          >
            <BookOpen className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
            Começar Leitura
          </Button>

          {/* Back Button */}
          <div className="mt-8 animate-fade-in" style={{ animationDelay: '1000ms' }}>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/area-vip')}
              className="text-slate-500 hover:text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Voltar para Área VIP
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-slate-600" />
        </div>
      </div>
    );
  }

  // READER SCREEN
  return (
    <div className={`fixed inset-0 bg-[#0a0a0f] flex flex-col transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between h-16 px-4 md:px-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-slate-400 hover:text-white hover:bg-white/10"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Book className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-white line-clamp-1">
                  {currentChapter?.title || ebookData.title}
                </h1>
                <p className="text-xs text-slate-500">
                  Capítulo {currentChapter?.number ?? 0} de {ebookData.chapters.length - 1}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 mr-4">
              <BarChart3 className="w-4 h-4" />
              <span>{Math.round(readingProgress)}% concluído</span>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="text-slate-400 hover:text-white hover:bg-white/10"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => { setShowCover(true); setActiveChapter(-1); }}
              className="text-slate-400 hover:text-white hover:bg-white/10"
            >
              <Home className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Capa</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`fixed md:relative inset-y-0 left-0 z-50 w-80 bg-[#0d0d14] border-r border-white/5 transform transition-transform duration-300 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:-translate-x-full'
          }`}
        >
          <div className="h-full overflow-y-auto pt-20 md:pt-4 pb-8 px-4">
            <div className="flex items-center justify-between mb-6 md:hidden">
              <h2 className="text-lg font-semibold text-white">Índice</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <nav className="space-y-1">
              {ebookData.chapters.map((chapter, index) => (
                <button
                  key={chapter.id}
                  onClick={() => goToChapter(index)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${
                    activeChapter === index
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-white'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      activeChapter === index
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                    }`}>
                      {chapter.number}
                    </div>
                    <span className="text-sm font-medium line-clamp-2">{chapter.title}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main 
          ref={contentRef}
          className="flex-1 overflow-y-auto"
        >
          <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 md:py-20">
            {currentChapter && (
              <>
                {/* Chapter Header */}
                <div className="mb-12 animate-fade-in">
                  <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30">
                    Capítulo {currentChapter.number}
                  </Badge>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                    {currentChapter.title}
                  </h1>
                  <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                </div>

                {/* Chapter Image */}
                {currentChapter.image && (
                  <div className="mb-12 rounded-2xl overflow-hidden animate-fade-in" style={{ animationDelay: '200ms' }}>
                    <img
                      src={currentChapter.image} 
                      alt={currentChapter.title}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}

                {/* Chapter Content */}
                <div className="prose prose-invert prose-lg max-w-none">
                  {renderContent(currentChapter.content)}
                </div>

                {/* Checklist */}
                {checklists[currentChapter.id] && checklists[currentChapter.id].length > 0 && (
                  <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 animate-fade-in">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      </div>
                      Checklist do Capítulo
                    </h3>
                    <div className="space-y-3">
                      {checklists[currentChapter.id].map((item) => (
                        <div 
                          key={item.id} 
                          className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-200 ${
                            item.checked 
                              ? 'bg-emerald-500/10 border border-emerald-500/20' 
                              : 'bg-white/5 border border-white/10 hover:border-emerald-500/30'
                          }`}
                        >
                          <Checkbox
                            id={`${currentChapter.id}-${item.id}`}
                            checked={item.checked}
                            onCheckedChange={() => toggleChecklistItem(currentChapter.id, item.id)}
                            className="mt-1 border-slate-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                          />
                          <label
                            htmlFor={`${currentChapter.id}-${item.id}`}
                            className={`text-lg cursor-pointer flex-1 transition-all ${
                              item.checked ? 'line-through text-slate-500' : 'text-slate-200'
                            }`}
                          >
                            {item.text}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="mt-16 flex items-center justify-between gap-4 pt-8 border-t border-white/10">
                  <Button
                    variant="outline"
                    onClick={goToPrevChapter}
                    disabled={activeChapter < 0}
                    className="flex-1 h-14 border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    <span className="hidden sm:inline">
                      {activeChapter === 0 ? 'Voltar para Capa' : 'Capítulo Anterior'}
                    </span>
                    <span className="sm:hidden">Anterior</span>
                  </Button>
                  
                  <Button
                    onClick={goToNextChapter}
                    disabled={activeChapter >= ebookData.chapters.length - 1}
                    className="flex-1 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold"
                  >
                    <span className="hidden sm:inline">Próximo Capítulo</span>
                    <span className="sm:hidden">Próximo</span>
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default EbookReaderCinematic;




