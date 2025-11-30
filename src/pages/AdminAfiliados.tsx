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
  CheckCircle2,
  XCircle,
  Ban,
  Search,
  Eye,
  Edit,
  Save,
  X,
  Users,
  Clock,
  TrendingUp,
  DollarSign,
  Mail,
  Phone,
  Key,
  FileText
} from "lucide-react";
import Header from "@/components/navigation/Header";
import { useAuth } from "@/contexts/AuthContext";
import { 
  getAllAffiliates,
  updateAffiliateStatus,
  updateAffiliate,
  getAffiliateReferrals,
  getAffiliateStats,
  type Affiliate,
  type AffiliateReferral
} from "@/services/affiliateService";

const AdminAfiliados = () => {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [filteredAffiliates, setFilteredAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);
  const [referrals, setReferrals] = useState<AffiliateReferral[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
  const { userEmail } = useAuth();

  // Carregar afiliados
  useEffect(() => {
    loadAffiliates();
  }, []);

  // Filtrar afiliados
  useEffect(() => {
    let filtered = [...affiliates];

    // Filtro por status
    if (statusFilter !== "all") {
      filtered = filtered.filter(a => a.status === statusFilter);
    }

    // Filtro por busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(query) ||
        a.email.toLowerCase().includes(query) ||
        a.affiliate_code.toLowerCase().includes(query) ||
        (a.phone && a.phone.includes(query))
      );
    }

    setFilteredAffiliates(filtered);
  }, [affiliates, statusFilter, searchQuery]);

  const loadAffiliates = async () => {
    try {
      setLoading(true);
      const data = await getAllAffiliates();
      setAffiliates(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os afiliados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = async (affiliate: Affiliate) => {
    setSelectedAffiliate(affiliate);
    setNotes(affiliate.notes || "");
    setIsDialogOpen(true);
    setIsLoadingDetails(true);

    try {
      // Carregar referências e estatísticas
      const [refs, affiliateStats] = await Promise.all([
        getAffiliateReferrals(affiliate.id),
        getAffiliateStats(affiliate.id)
      ]);
      setReferrals(refs);
      setStats(affiliateStats);
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleUpdateStatus = async (newStatus: 'pending' | 'approved' | 'rejected' | 'blocked') => {
    if (!selectedAffiliate) return;

    if (!userEmail) {
      toast({
        title: "Erro",
        description: "Você precisa estar autenticado para realizar esta ação.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await updateAffiliateStatus(selectedAffiliate.id, newStatus, notes, userEmail);
      
      if (result.success) {
        toast({
          title: "Sucesso",
          description: `Status atualizado para ${getStatusLabel(newStatus)}`,
        });
        setIsDialogOpen(false);
        await loadAffiliates();
      } else {
        toast({
          title: "Erro",
          description: result.error || "Não foi possível atualizar o status.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status.",
        variant: "destructive",
      });
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedAffiliate) return;

    if (!userEmail) {
      toast({
        title: "Erro",
        description: "Você precisa estar autenticado para realizar esta ação.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await updateAffiliate(selectedAffiliate.id, { notes }, userEmail);
      
      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Notas salvas com sucesso!",
        });
        await loadAffiliates();
      } else {
        toast({
          title: "Erro",
          description: result.error || "Não foi possível salvar as notas.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar notas.",
        variant: "destructive",
      });
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Pendente",
      approved: "Aprovado",
      rejected: "Rejeitado",
      blocked: "Bloqueado"
    };
    return labels[status] || status;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
      blocked: "destructive"
    };
    
    return (
      <Badge variant={variants[status] || "secondary"}>
        {getStatusLabel(status)}
      </Badge>
    );
  };

  const getStatusCounts = () => {
    return {
      all: affiliates.length,
      pending: affiliates.filter(a => a.status === 'pending').length,
      approved: affiliates.filter(a => a.status === 'approved').length,
      rejected: affiliates.filter(a => a.status === 'rejected').length,
      blocked: affiliates.filter(a => a.status === 'blocked').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Header />
      <div className="container mx-auto px-3 sm:px-4 pt-20 sm:pt-24 pb-8 sm:pb-12 md:pb-16">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
            Gerenciar Afiliados
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Aprove, rejeite ou gerencie os cadastros de afiliados
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-6">
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="text-2xl font-bold">{statusCounts.all}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
              <div className="text-xs text-muted-foreground">Pendentes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="text-2xl font-bold text-green-600">{statusCounts.approved}</div>
              <div className="text-xs text-muted-foreground">Aprovados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
              <div className="text-xs text-muted-foreground">Rejeitados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="text-2xl font-bold text-red-700">{statusCounts.blocked}</div>
              <div className="text-xs text-muted-foreground">Bloqueados</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar por nome, email, código ou telefone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="approved">Aprovados</SelectItem>
                  <SelectItem value="rejected">Rejeitados</SelectItem>
                  <SelectItem value="blocked">Bloqueados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Afiliados */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        ) : filteredAffiliates.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== "all" 
                  ? "Nenhum afiliado encontrado com os filtros aplicados" 
                  : "Nenhum afiliado cadastrado"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAffiliates.map((affiliate) => (
              <Card key={affiliate.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{affiliate.name}</h3>
                            {getStatusBadge(affiliate.status)}
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              {affiliate.email}
                            </div>
                            {affiliate.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                {affiliate.phone}
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Key className="w-4 h-4" />
                              Código: <span className="font-mono font-semibold">{affiliate.affiliate_code}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 mt-3 text-sm">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Vendas:</span>
                          <span className="font-semibold">{affiliate.total_sales}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Ganhos:</span>
                          <span className="font-semibold">R$ {Number(affiliate.total_earnings).toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">Comissão:</span>
                          <span className="font-semibold">{affiliate.commission_rate}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {new Date(affiliate.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(affiliate)}
                        className="gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog de Detalhes */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedAffiliate?.name} - {getStatusLabel(selectedAffiliate?.status || '')}
              </DialogTitle>
              <DialogDescription>
                Gerencie o status e visualize os detalhes do afiliado
              </DialogDescription>
            </DialogHeader>

            {isLoadingDetails ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Carregando detalhes...</p>
              </div>
            ) : selectedAffiliate && (
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">Informações</TabsTrigger>
                  <TabsTrigger value="stats">Estatísticas</TabsTrigger>
                  <TabsTrigger value="referrals">Vendas</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Nome</Label>
                      <Input value={selectedAffiliate.name} disabled />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input value={selectedAffiliate.email} disabled />
                    </div>
                    <div>
                      <Label>Telefone</Label>
                      <Input value={selectedAffiliate.phone || ''} disabled />
                    </div>
                    <div>
                      <Label>Chave PIX</Label>
                      <Input value={selectedAffiliate.pix_key || ''} disabled />
                    </div>
                    <div>
                      <Label>Código de Afiliado</Label>
                      <Input value={selectedAffiliate.affiliate_code} disabled className="font-mono" />
                    </div>
                    <div>
                      <Label>Taxa de Comissão</Label>
                      <Input value={`${selectedAffiliate.commission_rate}%`} disabled />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <div className="mt-2">{getStatusBadge(selectedAffiliate.status)}</div>
                    </div>
                    <div>
                      <Label>Data de Cadastro</Label>
                      <Input 
                        value={new Date(selectedAffiliate.created_at).toLocaleString('pt-BR')} 
                        disabled 
                      />
                    </div>
                    {selectedAffiliate.approved_at && (
                      <div>
                        <Label>Data de Aprovação</Label>
                        <Input 
                          value={new Date(selectedAffiliate.approved_at).toLocaleString('pt-BR')} 
                          disabled 
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Notas</Label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Adicione notas sobre este afiliado..."
                      rows={4}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSaveNotes}
                      className="mt-2"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Notas
                    </Button>
                  </div>

                  <div className="border-t pt-4">
                    <Label className="text-base font-semibold mb-3 block">Ações</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <Button
                        variant={selectedAffiliate.status === 'approved' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleUpdateStatus('approved')}
                        className="gap-2"
                        disabled={selectedAffiliate.status === 'approved'}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Aprovar
                      </Button>
                      <Button
                        variant={selectedAffiliate.status === 'rejected' ? 'destructive' : 'outline'}
                        size="sm"
                        onClick={() => handleUpdateStatus('rejected')}
                        className="gap-2"
                        disabled={selectedAffiliate.status === 'rejected'}
                      >
                        <XCircle className="w-4 h-4" />
                        Rejeitar
                      </Button>
                      <Button
                        variant={selectedAffiliate.status === 'blocked' ? 'destructive' : 'outline'}
                        size="sm"
                        onClick={() => handleUpdateStatus('blocked')}
                        className="gap-2"
                        disabled={selectedAffiliate.status === 'blocked'}
                      >
                        <Ban className="w-4 h-4" />
                        Bloquear
                      </Button>
                      <Button
                        variant={selectedAffiliate.status === 'pending' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleUpdateStatus('pending')}
                        className="gap-2"
                        disabled={selectedAffiliate.status === 'pending'}
                      >
                        <Clock className="w-4 h-4" />
                        Pendente
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="stats" className="space-y-4 mt-4">
                  {stats ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Total de Cliques</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{stats.totalClicks}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Total de Vendas</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{stats.totalSales}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Taxa de Conversão</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {stats.conversionRate.toFixed(2)}%
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Comissões Pendentes</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-yellow-600">
                            R$ {Number(stats.pendingCommissions).toFixed(2)}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Comissões Pagas</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">
                            R$ {Number(stats.paidCommissions).toFixed(2)}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Nenhuma estatística disponível
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="referrals" className="space-y-4 mt-4">
                  {referrals.length > 0 ? (
                    <div className="space-y-2">
                      {referrals.map((referral) => (
                        <Card key={referral.id}>
                          <CardContent className="pt-4 pb-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-semibold mb-1">{referral.customer_name || referral.customer_email}</div>
                                <div className="text-sm text-muted-foreground">
                                  {referral.product_name}
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  {new Date(referral.created_at).toLocaleString('pt-BR')}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">
                                  R$ {Number(referral.sale_amount).toFixed(2)}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Comissão: R$ {Number(referral.commission_amount).toFixed(2)}
                                </div>
                                <Badge variant="secondary" className="mt-1">
                                  {referral.status}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Nenhuma venda registrada
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            )}

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Fechar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminAfiliados;

