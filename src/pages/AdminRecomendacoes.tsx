import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Image as ImageIcon, 
  Upload, 
  ExternalLink,
  Save,
  X,
  Eye,
  EyeOff,
  Star,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import Header from "@/components/navigation/Header";
import { RecommendationsService, type Recommendation } from "@/services/recommendationsService";
import { ImageService, type UnsplashImage } from "@/services/imageService";
import { LinkScraperService } from "@/services/linkScraperService";
import { Loader2, Link2, Sparkles as SparklesIcon } from "lucide-react";

const AdminRecomendacoes = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Recommendation | null>(null);
  const [unsplashImages, setUnsplashImages] = useState<UnsplashImage[]>([]);
  const [searchImageQuery, setSearchImageQuery] = useState("");
  const [imageSearchLoading, setImageSearchLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [linkUrl, setLinkUrl] = useState<string>("");
  const [isScraping, setIsScraping] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<Recommendation>>({
    category: 'Livro',
    title: '',
    author: '',
    rating: 5,
    description: '',
    long_description: '',
    link: '',
    price: '',
    badge: '',
    image_url: '',
    duration: '',
    level: 'Iniciante',
    language: 'Português',
    format: '',
    featured: false,
    active: true,
    sort_order: 0
  });

  // Carregar recomendações
  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const data = await RecommendationsService.getAll(true); // Incluir inativas
      setRecommendations(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as recomendações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Buscar imagens no Unsplash
  const handleSearchImages = async () => {
    if (!searchImageQuery.trim()) {
      toast({
        title: "Atenção",
        description: "Digite um termo para buscar imagens.",
        variant: "destructive",
      });
      return;
    }

    try {
      setImageSearchLoading(true);
      const images = await ImageService.searchUnsplash(searchImageQuery, 1, 20);
      setUnsplashImages(images);
      
      if (images.length === 0) {
        toast({
          title: "Nenhuma imagem encontrada",
          description: "Tente outro termo de busca.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível buscar imagens.",
        variant: "destructive",
      });
    } finally {
      setImageSearchLoading(false);
    }
  };

  // Extrair dados do link automaticamente
  const handleExtractFromLink = async () => {
    if (!linkUrl.trim()) {
      toast({
        title: "Atenção",
        description: "Cole um link válido para extrair os dados.",
        variant: "destructive",
      });
      return;
    }

    if (!LinkScraperService.isValidUrl(linkUrl)) {
      toast({
        title: "URL inválida",
        description: "Por favor, verifique se o link está correto.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsScraping(true);
      console.log('Starting metadata extraction for:', linkUrl);
      
      toast({
        title: "Extraindo dados...",
        description: "Aguarde enquanto buscamos as informações do link.",
      });

      const metadata = await LinkScraperService.extractMetadata(linkUrl);
      console.log('Extracted metadata:', metadata);
      
      // Detectar categoria automaticamente
      const detectedCategory = LinkScraperService.detectCategory(linkUrl);
      console.log('Detected category:', detectedCategory);
      
      // Preencher formulário com os dados extraídos
      const updatedFormData = {
        ...formData,
        link: linkUrl,
        title: metadata.title || formData.title || '',
        author: metadata.author || formData.author || '',
        description: metadata.description || formData.description || '',
        long_description: metadata.description || formData.long_description || '',
        image_url: metadata.image || formData.image_url || '',
        price: LinkScraperService.formatPrice(metadata.price || '') || formData.price || '',
        category: detectedCategory,
      };

      setFormData(updatedFormData);

      if (metadata.image) {
        setSelectedImage(metadata.image);
      }

      // Verificar se conseguiu extrair dados úteis
      const hasUsefulData = metadata.title || metadata.description || metadata.image || metadata.author;
      
      if (hasUsefulData) {
        toast({
          title: "Dados extraídos! ✨",
          description: "Os campos foram preenchidos automaticamente. Revise e ajuste se necessário.",
        });
      } else {
        toast({
          title: "Extração limitada",
          description: "Alguns dados foram preenchidos, mas você pode precisar completar manualmente.",
          variant: "default",
        });
      }
    } catch (error: any) {
      console.error('Error extracting metadata:', error);
      toast({
        title: "Erro ao extrair dados",
        description: error.message || "Não foi possível extrair os dados do link. Preencha manualmente.",
        variant: "destructive",
      });
    } finally {
      setIsScraping(false);
    }
  };

  // Abrir dialog para criar/editar
  const handleOpenDialog = (item?: Recommendation) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
      setSelectedImage(item.image_url || '');
      setLinkUrl(item.link || '');
    } else {
      setEditingItem(null);
      setFormData({
        category: 'Livro',
        title: '',
        author: '',
        rating: 5,
        description: '',
        long_description: '',
        link: '',
        price: '',
        badge: '',
        image_url: '',
        duration: '',
        level: 'Iniciante',
        language: 'Português',
        format: '',
        featured: false,
        active: true,
        sort_order: recommendations.length
      });
      setSelectedImage('');
      setLinkUrl('');
    }
    setUnsplashImages([]);
    setSearchImageQuery('');
    setIsDialogOpen(true);
  };

  // Salvar recomendação
  const handleSave = async () => {
    try {
      // Validação melhorada
      if (!formData.title?.trim()) {
        toast({
          title: "Campo obrigatório",
          description: "O título é obrigatório.",
          variant: "destructive",
        });
        return;
      }

      if (!formData.author?.trim()) {
        toast({
          title: "Campo obrigatório",
          description: "O autor é obrigatório.",
          variant: "destructive",
        });
        return;
      }

      if (!formData.description?.trim()) {
        toast({
          title: "Campo obrigatório",
          description: "A descrição é obrigatória.",
          variant: "destructive",
        });
        return;
      }

      if (!formData.category) {
        toast({
          title: "Campo obrigatório",
          description: "A categoria é obrigatória.",
          variant: "destructive",
        });
        return;
      }

      // Preparar dados para salvar
      // Garantir que rating está entre 1 e 5
      const rating = Math.max(1, Math.min(5, formData.rating || 5));
      
      // Garantir que price não seja vazio (campo obrigatório no banco)
      const price = formData.price?.trim() || 'Gratuito';
      
      const dataToSave: Omit<Recommendation, 'id' | 'created_at' | 'updated_at'> = {
        category: formData.category,
        title: formData.title.trim(),
        author: formData.author.trim(),
        rating: rating,
        description: formData.description.trim(),
        long_description: formData.long_description?.trim() || formData.description.trim(),
        link: linkUrl || formData.link || '',
        price: price,
        badge: formData.badge || '',
        image_url: selectedImage || formData.image_url || '',
        duration: formData.duration || '',
        level: formData.level || 'Iniciante',
        language: formData.language || 'Português',
        format: formData.format || '',
        featured: formData.featured || false,
        active: formData.active !== undefined ? formData.active : true,
        sort_order: formData.sort_order ?? recommendations.length
      };

      console.log('Saving recommendation:', dataToSave);

      if (editingItem) {
        await RecommendationsService.update(editingItem.id, dataToSave);
        toast({
          title: "Sucesso",
          description: "Recomendação atualizada com sucesso!",
        });
      } else {
        await RecommendationsService.create(dataToSave);
        toast({
          title: "Sucesso",
          description: "Recomendação criada com sucesso!",
        });
      }

      setIsDialogOpen(false);
      await loadRecommendations();
    } catch (error: any) {
      console.error('Error saving recommendation:', error);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar a recomendação. Verifique o console para mais detalhes.",
        variant: "destructive",
      });
    }
  };

  // Deletar recomendação
  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta recomendação?')) {
      return;
    }

    try {
      await RecommendationsService.delete(id);
      toast({
        title: "Sucesso",
        description: "Recomendação excluída com sucesso!",
      });
      loadRecommendations();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a recomendação.",
        variant: "destructive",
      });
    }
  };

  // Toggle ativo/inativo
  const handleToggleActive = async (item: Recommendation) => {
    try {
      await RecommendationsService.update(item.id, { active: !item.active });
      toast({
        title: "Sucesso",
        description: `Recomendação ${item.active ? 'desativada' : 'ativada'} com sucesso!`,
      });
      loadRecommendations();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a recomendação.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Header />
      <div className="container mx-auto px-3 sm:px-4 pt-20 sm:pt-24 pb-8 sm:pb-12 md:pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              Gerenciar Recomendações
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Adicione, edite ou remova recomendações facilmente
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="w-4 h-4" />
            Nova Recomendação
          </Button>
        </div>

        {/* Lista de Recomendações */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        ) : recommendations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Nenhuma recomendação cadastrada</p>
              <Button onClick={() => handleOpenDialog()}>Criar Primeira Recomendação</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {recommendations.map((item) => (
              <Card key={item.id} className={!item.active ? 'opacity-60' : ''}>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(item)}
                        className="h-6 w-6 p-0"
                      >
                        {item.active ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(item)}
                        className="h-6 w-6 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="h-6 w-6 p-0 text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-base sm:text-lg line-clamp-2">{item.title}</CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground">{item.author}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < item.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                </CardHeader>
                {item.image_url && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="pt-4">
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">{item.price}</span>
                    {item.featured && (
                      <Badge variant="outline" className="text-xs">Destaque</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog de Edição/Criação */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Editar Recomendação' : 'Nova Recomendação'}
              </DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo. Campos marcados com * são obrigatórios.
              </DialogDescription>
            </DialogHeader>

            {/* Link Extractor - Extração Automática */}
            <div className="mb-6 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <SparklesIcon className="w-5 h-5 text-primary" />
                <Label className="text-base font-semibold">Extrair Dados do Link</Label>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Cole o link do produto (Amazon, YouTube, Udemy, etc.) e clique em "Extrair" para preencher automaticamente todos os campos.
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="https://www.amazon.com.br/... ou https://www.youtube.com/..."
                  value={linkUrl}
                  onChange={(e) => {
                    const newUrl = e.target.value;
                    setLinkUrl(newUrl);
                    setFormData(prev => ({ ...prev, link: newUrl }));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isScraping && LinkScraperService.isValidUrl(linkUrl)) {
                      handleExtractFromLink();
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  onClick={handleExtractFromLink}
                  disabled={isScraping || !linkUrl.trim() || !LinkScraperService.isValidUrl(linkUrl)}
                  className="gap-2"
                >
                  {isScraping ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Extraindo...
                    </>
                  ) : (
                    <>
                      <Link2 className="w-4 h-4" />
                      Extrair
                    </>
                  )}
                </Button>
              </div>
              {linkUrl && (
                <div className="mt-2 flex items-center gap-2 text-xs">
                  {LinkScraperService.isValidUrl(linkUrl) ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-success" />
                      <span className="text-success">
                        URL válida • Categoria detectada: <strong>{LinkScraperService.detectCategory(linkUrl)}</strong>
                      </span>
                    </>
                  ) : linkUrl.trim() ? (
                    <>
                      <X className="w-3 h-3 text-destructive" />
                      <span className="text-destructive">URL inválida. Verifique o formato do link.</span>
                    </>
                  ) : null}
                </div>
              )}
            </div>

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Básico</TabsTrigger>
                <TabsTrigger value="details">Detalhes</TabsTrigger>
                <TabsTrigger value="image">Imagem</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Categoria *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value as any })}
                    >
                      <SelectTrigger id="category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Livro">Livro</SelectItem>
                        <SelectItem value="Vídeo">Vídeo</SelectItem>
                        <SelectItem value="Curso">Curso</SelectItem>
                        <SelectItem value="E-book">E-book</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="rating">Avaliação *</Label>
                    <Select
                      value={formData.rating?.toString()}
                      onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}
                    >
                      <SelectTrigger id="rating">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 ⭐⭐⭐⭐⭐</SelectItem>
                        <SelectItem value="4">4 ⭐⭐⭐⭐</SelectItem>
                        <SelectItem value="3">3 ⭐⭐⭐</SelectItem>
                        <SelectItem value="2">2 ⭐⭐</SelectItem>
                        <SelectItem value="1">1 ⭐</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: O Investidor Inteligente"
                  />
                </div>

                <div>
                  <Label htmlFor="author">Autor *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Ex: Benjamin Graham"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição Curta *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrição breve que aparece no card..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="long_description">Descrição Completa</Label>
                  <Textarea
                    id="long_description"
                    value={formData.long_description}
                    onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                    placeholder="Descrição detalhada que aparece no modal..."
                    rows={5}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Preço *</Label>
                    <Input
                      id="price"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="Ex: R$ 45,90 ou Gratuito"
                    />
                  </div>

                  <div>
                    <Label htmlFor="badge">Badge</Label>
                    <Input
                      id="badge"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="Ex: Clássico, Bestseller"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="link">Link</Label>
                  <div className="flex gap-2">
                    <Input
                      id="link"
                      value={formData.link || linkUrl}
                      onChange={(e) => {
                        setFormData({ ...formData, link: e.target.value });
                        setLinkUrl(e.target.value);
                      }}
                      placeholder="https://..."
                      type="url"
                      className="flex-1"
                    />
                    {formData.link && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => window.open(formData.link, '_blank')}
                        title="Abrir link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Duração/Extensão</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="Ex: ~400 páginas, 20+ horas"
                    />
                  </div>

                  <div>
                    <Label htmlFor="level">Nível</Label>
                    <Select
                      value={formData.level}
                      onValueChange={(value) => setFormData({ ...formData, level: value as any })}
                    >
                      <SelectTrigger id="level">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Iniciante">Iniciante</SelectItem>
                        <SelectItem value="Intermediário">Intermediário</SelectItem>
                        <SelectItem value="Avançado">Avançado</SelectItem>
                        <SelectItem value="Todos">Todos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="language">Idioma</Label>
                    <Input
                      id="language"
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      placeholder="Ex: Português"
                    />
                  </div>

                  <div>
                    <Label htmlFor="format">Formato</Label>
                    <Input
                      id="format"
                      value={formData.format}
                      onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                      placeholder="Ex: Físico/Digital, PDF, Online"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sort_order">Ordem de Exibição</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="featured">Em Destaque</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="active"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="active">Ativo</Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="image" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="image_url">URL da Imagem</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image_url"
                      value={selectedImage || formData.image_url}
                      onChange={(e) => {
                        setSelectedImage(e.target.value);
                        setFormData({ ...formData, image_url: e.target.value });
                      }}
                      placeholder="Cole a URL da imagem aqui"
                    />
                    {selectedImage && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedImage('');
                          setFormData({ ...formData, image_url: '' });
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {selectedImage && (
                  <div className="aspect-video rounded-lg overflow-hidden border">
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => {
                        toast({
                          title: "Erro",
                          description: "Não foi possível carregar a imagem.",
                          variant: "destructive",
                        });
                      }}
                    />
                  </div>
                )}

                <div className="border-t pt-4">
                  <Label>Buscar Imagens no Unsplash</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Ex: livro investimento, trading, criptomoedas..."
                      value={searchImageQuery}
                      onChange={(e) => setSearchImageQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearchImages();
                        }
                      }}
                    />
                    <Button
                      onClick={handleSearchImages}
                      disabled={imageSearchLoading}
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Buscar
                    </Button>
                  </div>

                  {imageSearchLoading && (
                    <p className="text-sm text-muted-foreground mt-2">Buscando imagens...</p>
                  )}

                  {unsplashImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-4 max-h-64 overflow-y-auto">
                      {unsplashImages.map((img) => (
                        <button
                          key={img.id}
                          onClick={() => {
                            setSelectedImage(img.urls.regular);
                            setFormData({ ...formData, image_url: img.urls.regular });
                          }}
                          className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage === img.urls.regular
                              ? 'border-primary ring-2 ring-primary'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <img
                            src={img.urls.thumb}
                            alt={img.alt_description || 'Imagem'}
                            className="w-full h-full object-cover"
                          />
                          {selectedImage === img.urls.regular && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                              <CheckCircle2 className="w-6 h-6 text-primary" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminRecomendacoes;

