import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Book, CheckCircle2, Circle, Menu, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import ebookData from '@/data/ebook-content';

import type { ChecklistItem as BaseChecklistItem } from '@/data/ebook-content';

interface ChecklistItem extends BaseChecklistItem {
  checked: boolean;
}

const EbookReaderEnhanced = () => {
  const [activeChapter, setActiveChapter] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const chapterRefs = useRef<(HTMLElement | null)[]>([]);
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

  // Detect which chapter is in view
  useEffect(() => {
    const observers = chapterRefs.current.map((ref, index) => {
      if (!ref) return null;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveChapter(index);
            }
          });
        },
        { threshold: 0.3, rootMargin: '-20% 0px -70% 0px' }
      );
      
      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  const scrollToChapter = (index: number) => {
    chapterRefs.current[index]?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
    setIsSidebarOpen(false);
  };

  const toggleChecklistItem = (chapterId: string, itemId: string) => {
    setChecklists(prev => ({
      ...prev,
      [chapterId]: prev[chapterId].map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    }));
  };

  const renderContent = (content: any) => {
    if (!content) return null;

    return (
      <div className="space-y-8">
        {/* Intro */}
        {content.intro && (
          <div className="text-lg leading-relaxed text-muted-foreground">
            {content.intro}
          </div>
        )}

        {/* Sections */}
        {content.sections && content.sections.map((section: any, idx: number) => (
          <div key={idx} className="space-y-4">
            {section.title && (
              <h2 className="text-2xl font-bold text-primary mt-8 mb-4">
                {section.title}
              </h2>
            )}

            {section.description && (
              <p className="text-base leading-relaxed">
                {section.description}
              </p>
            )}

            {section.items && (
              <ul className="space-y-2 ml-6">
                {section.items.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-base" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary">$1</strong>') }} />
                  </li>
                ))}
              </ul>
            )}

            {section.example && (
              <div className="bg-accent/20 border-l-4 border-accent p-4 rounded-r-lg my-4">
                <h3 className="font-semibold text-lg mb-2">
                  💡 {section.example.title}
                </h3>
                <p className="text-base mb-2">{section.example.scenario}</p>
                {section.example.key_point && (
                  <p className="text-sm font-medium text-primary mt-2">
                    ✨ {section.example.key_point}
                  </p>
                )}
                {section.example.warning && (
                  <p className="text-sm font-medium text-destructive mt-2">
                    ⚠️ {section.example.warning}
                  </p>
                )}
              </div>
            )}

            {section.features && (
              <div className="grid gap-3">
                {section.features.map((feature: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-card/50 rounded-lg border border-border/50">
                    <Circle className="w-2 h-2 text-primary mt-2 flex-shrink-0 fill-current" />
                    <span className="text-base" dangerouslySetInnerHTML={{ __html: feature.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary">$1</strong>') }} />
                  </div>
                ))}
              </div>
            )}

            {section.steps && (
              <ol className="space-y-3">
                {section.steps.map((step: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-0.5 flex-shrink-0">
                      {i + 1}
                    </Badge>
                    <span className="text-base">{step}</span>
                  </li>
                ))}
              </ol>
            )}

            {section.criteria && (
              <div className="space-y-4">
                {section.criteria.map((criterion: any, i: number) => (
                  <div key={i} className="border border-border/50 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2 text-primary">
                      {criterion.name}
                    </h3>
                    <p className="text-base mb-2">{criterion.description}</p>
                    {criterion.tip && (
                      <div className="bg-primary/10 p-3 rounded-lg mt-2">
                        <p className="text-sm">
                          <strong className="text-primary">💡 Dica:</strong> {criterion.tip}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {section.profiles && (
              <div className="grid md:grid-cols-3 gap-4">
                {section.profiles.map((profile: any, i: number) => (
                  <div key={i} className="bg-card/30 border border-border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3">{profile.type}</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-2">Características:</p>
                        <ul className="text-sm space-y-1">
                          {profile.characteristics.map((char: string, j: number) => (
                            <li key={j} className="text-muted-foreground">• {char}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-2 border-t border-border/50">
                        <p className="text-sm">
                          <strong>Ideal para:</strong> {profile.ideal_for}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.warnings && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 text-destructive">
                  ⚠️ Sinais de Alerta
                </h3>
                <ul className="space-y-2">
                  {section.warnings.map((warning: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-destructive mt-0.5">⚠️</span>
                      <span className="text-base">{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Book className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-base sm:text-lg font-bold text-foreground">
                  {ebookData.title}
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {ebookData.subtitle}
                </p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden"
            >
              {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>

            <div className="hidden lg:block">
              <Badge variant="outline">
                Capítulo {ebookData.chapters[activeChapter]?.number || 1}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full flex">
        <div className="flex w-full">
          {/* Sidebar Navigation - Desktop */}
          <aside className="hidden lg:block sticky top-24 h-fit w-72 flex-shrink-0 border-r border-border">
            <nav className="space-y-1 px-6 py-8">
              <h2 className="text-sm font-semibold text-muted-foreground mb-4 px-3">
                ÍNDICE
              </h2>
              {ebookData.chapters.map((chapter, index) => (
                <button
                  key={chapter.id}
                  onClick={() => scrollToChapter(index)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeChapter === index
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <span className="text-xs opacity-70 block mb-0.5">
                    Capítulo {chapter.number}
                  </span>
                  {chapter.title}
                </button>
              ))}
            </nav>
          </aside>

          {/* Mobile Sidebar */}
          {isSidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
              <div className="fixed inset-y-0 left-0 w-72 bg-background border-r border-border shadow-lg overflow-y-auto">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm font-semibold text-muted-foreground">
                      ÍNDICE
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <nav className="space-y-1">
                    {ebookData.chapters.map((chapter, index) => (
                      <button
                        key={chapter.id}
                        onClick={() => scrollToChapter(index)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeChapter === index
                            ? 'bg-primary text-primary-foreground font-medium'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        <span className="text-xs opacity-70 block mb-0.5">
                          Capítulo {chapter.number}
                        </span>
                        {chapter.title}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0 px-6 sm:px-12 lg:px-16 xl:px-24 py-8 lg:py-12">
            <div className="space-y-16 max-w-4xl mx-auto">
              {ebookData.chapters.map((chapter, index) => (
                <section
                  key={chapter.id}
                  ref={(el) => (chapterRefs.current[index] = el)}
                  className="scroll-mt-24"
                >
                  {/* Chapter Header */}
                  <div className="mb-8">
                    <Badge variant="outline" className="mb-3">
                      Capítulo {chapter.number}
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                      {chapter.title}
                    </h2>
                    <div className="h-1 w-20 bg-primary rounded-full"></div>
                  </div>

                  {/* Chapter Image */}
                  {chapter.image && (
                    <div className="mb-10 rounded-xl overflow-hidden border border-border">
                      <img 
                        src={chapter.image} 
                        alt={chapter.title}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}

                  {/* Chapter Content */}
                  <div className="prose prose-slate max-w-none mb-10">
                    {renderContent(chapter.content)}
                  </div>

                  {/* Checklist */}
                  {checklists[chapter.id] && checklists[chapter.id].length > 0 && (
                    <div className="mt-12 p-6 bg-muted/30 border border-border rounded-xl">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                        Checklist do Capítulo
                      </h3>
                      <div className="space-y-3">
                        {checklists[chapter.id].map((item) => (
                          <div key={item.id} className="flex items-start gap-3 p-3 bg-background rounded-lg border border-border/50">
                            <Checkbox
                              id={`${chapter.id}-${item.id}`}
                              checked={item.checked}
                              onCheckedChange={() => toggleChecklistItem(chapter.id, item.id)}
                              className="mt-0.5"
                            />
                            <label
                              htmlFor={`${chapter.id}-${item.id}`}
                              className={`text-base cursor-pointer flex-1 ${
                                item.checked ? 'line-through text-muted-foreground' : 'text-foreground'
                              }`}
                            >
                              {item.text}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Chapter Divider */}
                  {index < ebookData.chapters.length - 1 && (
                    <div className="mt-16 pt-16 border-t border-border/50" />
                  )}
                </section>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default EbookReaderEnhanced;

