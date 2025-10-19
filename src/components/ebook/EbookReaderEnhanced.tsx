import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Book, CheckCircle2, Circle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import ebookData from '@/data/ebook-content.json';

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

const EbookReaderEnhanced = () => {
  const [currentChapter, setCurrentChapter] = useState(0);
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

  const currentChapterData = ebookData.chapters[currentChapter];
  const totalChapters = ebookData.chapters.length;
  const progress = ((currentChapter + 1) / totalChapters) * 100;

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
                  <Card key={i} className="bg-card/30">
                    <CardHeader>
                      <CardTitle className="text-lg">{profile.type}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
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
                    </CardContent>
                  </Card>
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
    <div className="max-w-5xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Progresso do Ebook</span>
          <span className="text-sm text-muted-foreground">
            {currentChapter + 1} de {totalChapters} capítulos
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Book className="w-6 h-6 text-primary" />
              <div>
                <CardTitle className="text-xl">
                  {ebookData.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {ebookData.subtitle}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <div>
              <Badge variant="outline" className="mb-2">
                Capítulo {currentChapterData.number}
              </Badge>
              <h2 className="text-2xl font-bold text-primary">
                {currentChapterData.title}
              </h2>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[600px] w-full">
            <div className="p-8">
              {/* Chapter Image */}
              {currentChapterData.image && (
                <div className="mb-8 rounded-lg overflow-hidden">
                  <img 
                    src={currentChapterData.image} 
                    alt={currentChapterData.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              {/* Chapter Content */}
              {renderContent(currentChapterData.content)}

              {/* Checklist */}
              {checklists[currentChapterData.id] && checklists[currentChapterData.id].length > 0 && (
                <div className="mt-12 p-6 bg-primary/5 border border-primary/20 rounded-lg">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                    Checklist do Capítulo
                  </h3>
                  <div className="space-y-3">
                    {checklists[currentChapterData.id].map((item) => (
                      <div key={item.id} className="flex items-start gap-3 p-3 bg-card rounded-lg">
                        <Checkbox
                          id={item.id}
                          checked={item.checked}
                          onCheckedChange={() => toggleChecklistItem(currentChapterData.id, item.id)}
                          className="mt-0.5"
                        />
                        <label
                          htmlFor={item.id}
                          className={`text-base cursor-pointer flex-1 ${
                            item.checked ? 'line-through text-muted-foreground' : ''
                          }`}
                        >
                          {item.text}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        <div className="border-t border-border/50 p-4">
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={() => setCurrentChapter(Math.max(0, currentChapter - 1))}
              disabled={currentChapter === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>

            <div className="flex gap-2 flex-wrap justify-center">
              {ebookData.chapters.map((chapter, index) => (
                <Button
                  key={chapter.id}
                  variant={index === currentChapter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentChapter(index)}
                  className="w-10 h-10 p-0"
                  title={chapter.title}
                >
                  {chapter.number}
                </Button>
              ))}
            </div>

            <Button 
              variant="outline" 
              onClick={() => setCurrentChapter(Math.min(totalChapters - 1, currentChapter + 1))}
              disabled={currentChapter === totalChapters - 1}
              className="flex items-center gap-2"
            >
              Próximo
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EbookReaderEnhanced;

