import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Book, Download } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ebookContent from '@/assets/ebook-copytrading.md?raw';

interface Chapter {
  title: string;
  content: string;
  number: number;
}

const EbookReader = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const parseChapters = () => {
      // Split content by chapter markers
      const chapterSplits = ebookContent.split(/^#\s+\*\*Capítulo\s+\d+/gm);
      const chapterTitles = ebookContent.match(/^#\s+\*\*Capítulo\s+\d+[^*]*\*\*/gm) || [];
      
      const parsedChapters: Chapter[] = [];
      
      chapterTitles.forEach((title, index) => {
        if (chapterSplits[index + 1]) {
          const cleanTitle = title.replace(/^#\s+\*\*/, '').replace(/\*\*$/, '').trim();
          const content = title + chapterSplits[index + 1];
          
          parsedChapters.push({
            title: cleanTitle,
            content: content,
            number: index + 1
          });
        }
      });
      
      setChapters(parsedChapters);
      setIsLoading(false);
    };

    parseChapters();
  }, []);

  const formatMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^\* (.*?)$/gm, '<li>$1</li>')
      .replace(/^(\d+\.\s.*?)$/gm, '<li>$1</li>')
      .replace(/^---$/gm, '<hr class="my-4 border-border/50" />')
      .replace(/^## (.*?)$/gm, '<h2 class="text-xl font-semibold mt-6 mb-3 text-primary">$1</h2>')
      .replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4 text-primary">$1</h1>')
      .replace(/💡 \*\*Dica[^:]*:\*\* (.*?)$/gm, '<div class="bg-primary/10 border-l-4 border-primary p-4 my-4 rounded-r-lg"><strong class="text-primary">💡 Dica:</strong> $1</div>')
      .replace(/📌 \*\*Resumo[^:]*:\*\* (.*?)$/gm, '<div class="bg-secondary/20 border border-secondary/30 p-4 my-4 rounded-lg"><strong class="text-secondary-foreground">📌 Resumo:</strong> $1</div>')
      .replace(/✅ (.*?)$/gm, '<div class="flex items-start gap-2 my-2"><span class="text-green-500 mt-1">✅</span><span>$1</span></div>')
      .replace(/👉 (.*?)$/gm, '<div class="bg-accent/20 border-l-4 border-accent p-3 my-3 rounded-r-lg"><span class="font-medium">👉 $1</span></div>');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (chapters.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Não foi possível carregar o ebook.
      </div>
    );
  }

  const currentChapterData = chapters[currentChapter];

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Book className="w-6 h-6 text-primary" />
              <CardTitle className="text-xl">
                Guia Completo de Copy Trading
              </CardTitle>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <h2 className="text-lg font-medium text-muted-foreground">
              {currentChapterData.title}
            </h2>
            <span className="text-sm text-muted-foreground">
              Capítulo {currentChapter + 1} de {chapters.length}
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[600px] w-full">
            <div className="p-6">
              <div 
                className="prose prose-sm max-w-none text-foreground"
                dangerouslySetInnerHTML={{ 
                  __html: formatMarkdown(currentChapterData.content) 
                }}
              />
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

            <div className="flex gap-2">
              {chapters.map((_, index) => (
                <Button
                  key={index}
                  variant={index === currentChapter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentChapter(index)}
                  className="w-8 h-8 p-0"
                >
                  {index + 1}
                </Button>
              ))}
            </div>

            <Button 
              variant="outline" 
              onClick={() => setCurrentChapter(Math.min(chapters.length - 1, currentChapter + 1))}
              disabled={currentChapter === chapters.length - 1}
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

export default EbookReader;