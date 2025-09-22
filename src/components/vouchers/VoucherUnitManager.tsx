import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Building,
  Users,
  Mail,
  MapPin,
  CreditCard,
  Gift,
  FileText,
  User
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Importar dados das planilhas
import vouchersData from '@/data/vouchers_campanha.json';
import vouchersExcecoesData from '@/data/vouchers_excecoes.json';

interface VoucherCampanha {
  'Escola ID': number;
  'Nome Escola': string;
  Cluster: string;
  'Status da Escola': string;
  'Adimplência Contratual': string;
  'Adimplência Financeira': string;
  'Utilização Integral LEX': string;
  'Vendas SLM 2025': number;
  'Direito a voucher': string;
  Motivo: string;
  'Habilitação Voucher': string;
  'Qtd. Vouchers': number;
  'Código do voucher': string;
  'Voucher enviado': string;
  Observação: string;
}

interface VoucherExcecao {
  'Nome Escola': string;
  'Responsável Financeiro': string;
  Curso: string;
  '% Voucher': number;
  Código: string;
  CPF: string;
  'Quem confeccionou o voucher?': string;
  'Título do e-mail': string;
  'Quem solicitou o voucher': string;
  'Qtd de utilizações': number;
}

interface NovoVoucherExcecao {
  escola: string;
  responsavelFinanceiro: string;
  curso: string;
  percentualVoucher: number;
  codigo: string;
  cpf: string;
  agenteSAF: string;
  tituloEmail: string;
  qtdUtilizacoes: number;
  justificativa: string;
}

const VoucherUnitManager = () => {
  const [vouchersCampanha, setVouchersCampanha] = useState<VoucherCampanha[]>([]);
  const [vouchersExcecoes, setVouchersExcecoes] = useState<VoucherExcecao[]>([]);
  const [filteredVouchers, setFilteredVouchers] = useState<VoucherCampanha[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [clusterFilter, setClusterFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [direitoVoucherFilter, setDireitoVoucherFilter] = useState<string>('all');
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherCampanha | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isExceptionDialogOpen, setIsExceptionDialogOpen] = useState(false);
  const [isViewExceptionsDialogOpen, setIsViewExceptionsDialogOpen] = useState(false);
  const [novoVoucherExcecao, setNovoVoucherExcecao] = useState<NovoVoucherExcecao>({
    escola: '',
    responsavelFinanceiro: '',
    curso: '',
    percentualVoucher: 0,
    codigo: '',
    cpf: '',
    agenteSAF: '',
    tituloEmail: '',
    qtdUtilizacoes: 1,
    justificativa: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    // Carregar dados das planilhas
    setVouchersCampanha(vouchersData as VoucherCampanha[]);
    setVouchersExcecoes(vouchersExcecoesData as VoucherExcecao[]);
    setFilteredVouchers(vouchersData as VoucherCampanha[]);
  }, []);

  useEffect(() => {
    // Aplicar filtros
    let filtered = vouchersCampanha.filter(voucher => {
      const matchesSearch = 
        voucher['Nome Escola']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voucher['Código do voucher']?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCluster = clusterFilter === 'all' || voucher.Cluster === clusterFilter;
      const matchesStatus = statusFilter === 'all' || voucher['Status da Escola'] === statusFilter;
      const matchesDireito = direitoVoucherFilter === 'all' || voucher['Direito a voucher'] === direitoVoucherFilter;

      return matchesSearch && matchesCluster && matchesStatus && matchesDireito;
    });

    setFilteredVouchers(filtered);
  }, [searchTerm, clusterFilter, statusFilter, direitoVoucherFilter, vouchersCampanha]);

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'ativa':
        return <Badge className="bg-green-100 text-green-800">Ativa</Badge>;
      case 'inativa':
        return <Badge className="bg-red-100 text-red-800">Inativa</Badge>;
      case 'suspensa':
        return <Badge className="bg-yellow-100 text-yellow-800">Suspensa</Badge>;
      default:
        return <Badge variant="outline">{status || 'N/A'}</Badge>;
    }
  };

  const getClusterBadge = (cluster: string) => {
    switch (cluster?.toLowerCase()) {
      case 'potente':
        return <Badge className="bg-green-100 text-green-800">Potente</Badge>;
      case 'desenvolvimento':
        return <Badge className="bg-yellow-100 text-yellow-800">Desenvolvimento</Badge>;
      case 'alerta':
        return <Badge className="bg-red-100 text-red-800">Alerta</Badge>;
      default:
        return <Badge variant="outline">{cluster || 'N/A'}</Badge>;
    }
  };

  const getDireitoVoucherBadge = (direito: string) => {
    switch (direito?.toLowerCase()) {
      case 'sim':
        return <Badge className="bg-green-100 text-green-800">Sim</Badge>;
      case 'não':
        return <Badge className="bg-red-100 text-red-800">Não</Badge>;
      default:
        return <Badge variant="outline">{direito || 'N/A'}</Badge>;
    }
  };

  const getVoucherEnviadoBadge = (enviado: string) => {
    switch (enviado?.toLowerCase()) {
      case 'sim':
        return <Badge className="bg-green-100 text-green-800">Enviado</Badge>;
      case 'não':
      case 'nan':
      case '':
        return <Badge className="bg-red-100 text-red-800">Não Enviado</Badge>;
      default:
        return <Badge variant="outline">{enviado || 'Não Enviado'}</Badge>;
    }
  };

  const handleEditVoucher = (voucher: VoucherCampanha) => {
    setSelectedVoucher(voucher);
    setIsEditDialogOpen(true);
  };

  const handleAddException = (voucher: VoucherCampanha) => {
    setSelectedVoucher(voucher);
    setNovoVoucherExcecao({
      ...novoVoucherExcecao,
      escola: voucher['Nome Escola']
    });
    setIsExceptionDialogOpen(true);
  };

  const handleSaveException = () => {
    if (!novoVoucherExcecao.justificativa.trim()) {
      toast({
        title: "Justificativa obrigatória",
        description: "Por favor, forneça uma justificativa para o voucher de exceção.",
        variant: "destructive"
      });
      return;
    }

    if (!novoVoucherExcecao.agenteSAF.trim()) {
      toast({
        title: "Agente SAF obrigatório",
        description: "Por favor, informe o nome do agente SAF que solicitou.",
        variant: "destructive"
      });
      return;
    }

    // Aqui você salvaria o voucher de exceção
    toast({
      title: "Voucher de exceção criado",
      description: `Voucher de exceção para ${novoVoucherExcecao.escola} criado com sucesso.`,
    });

    setIsExceptionDialogOpen(false);
    setNovoVoucherExcecao({
      escola: '',
      responsavelFinanceiro: '',
      curso: '',
      percentualVoucher: 0,
      codigo: '',
      cpf: '',
      agenteSAF: '',
      tituloEmail: '',
      qtdUtilizacoes: 1,
      justificativa: ''
    });
  };

  const handleSaveVoucher = () => {
    // Aqui você salvaria as alterações do voucher
    toast({
      title: "Voucher atualizado",
      description: "Voucher atualizado com sucesso.",
    });

    setIsEditDialogOpen(false);
    setSelectedVoucher(null);
  };

  const stats = {
    total: filteredVouchers.length,
    comDireito: filteredVouchers.filter(v => v['Direito a voucher']?.toLowerCase() === 'sim').length,
    enviados: filteredVouchers.filter(v => v['Voucher enviado']?.toLowerCase() === 'sim').length,
    pendentes: filteredVouchers.filter(v => v['Voucher enviado']?.toLowerCase() !== 'sim' && v['Direito a voucher']?.toLowerCase() === 'sim').length,
    excecoes: vouchersExcecoes.filter(v => v['Nome Escola']).length
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Controle de Vouchers por Unidade</h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Gerencie vouchers de campanha e vouchers de exceção por unidade escolar
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setIsViewExceptionsDialogOpen(true)}
          >
            <FileText className="h-4 w-4" />
            Ver Exceções
          </Button>
          <Button className="gap-2 bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4" />
            Novo Voucher
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Direito</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.comDireito}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enviados</CardTitle>
            <Mail className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.enviados}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendentes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exceções</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.excecoes}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por escola ou código do voucher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={clusterFilter} onValueChange={setClusterFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Cluster" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Clusters</SelectItem>
                <SelectItem value="Potente">Potente</SelectItem>
                <SelectItem value="Desenvolvimento">Desenvolvimento</SelectItem>
                <SelectItem value="Alerta">Alerta</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="Ativa">Ativa</SelectItem>
                <SelectItem value="Inativa">Inativa</SelectItem>
                <SelectItem value="Suspensa">Suspensa</SelectItem>
              </SelectContent>
            </Select>

            <Select value={direitoVoucherFilter} onValueChange={setDireitoVoucherFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Direito a Voucher" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Sim">Com Direito</SelectItem>
                <SelectItem value="Não">Sem Direito</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vouchers List */}
      <div className="grid gap-4">
        {filteredVouchers.map((voucher, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-red-100 text-red-600 font-bold">
                      {voucher['Nome Escola']?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'E'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{voucher['Nome Escola'] || 'Escola não informada'}</h3>
                      <span className="text-sm text-muted-foreground">ID: {voucher['Escola ID']}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CreditCard className="w-4 h-4" />
                      <span>Código: {voucher['Código do voucher'] || 'Não definido'}</span>
                      <span>•</span>
                      <span>Qtd: {voucher['Qtd. Vouchers'] || 0}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="w-4 h-4" />
                      <span>Vendas SLM 2025: {voucher['Vendas SLM 2025'] || 0}</span>
                      <span>•</span>
                      {getClusterBadge(voucher.Cluster)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusBadge(voucher['Status da Escola'])}
                      {getDireitoVoucherBadge(voucher['Direito a voucher'])}
                    </div>
                    <div className="flex items-center gap-2">
                      {getVoucherEnviadoBadge(voucher['Voucher enviado'])}
                      <span className="text-sm text-muted-foreground">
                        {voucher['Habilitação Voucher'] || 'N/A'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditVoucher(voucher)}
                      className="gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddException(voucher)}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Exceção
                    </Button>
                  </div>
                </div>
              </div>
              
              {voucher.Observação && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Observação:</strong> {voucher.Observação}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Voucher Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Voucher</DialogTitle>
            <DialogDescription>
              Edite as informações do voucher da unidade.
            </DialogDescription>
          </DialogHeader>
          
          {selectedVoucher && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="qtdVouchers">Quantidade de Vouchers</Label>
                  <Input
                    id="qtdVouchers"
                    type="number"
                    defaultValue={selectedVoucher['Qtd. Vouchers']}
                  />
                </div>
                <div>
                  <Label htmlFor="habilitacao">Habilitação Voucher</Label>
                  <Input
                    id="habilitacao"
                    defaultValue={selectedVoucher['Habilitação Voucher']}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="codigoVoucher">Código do Voucher</Label>
                <Input
                  id="codigoVoucher"
                  defaultValue={selectedVoucher['Código do voucher']}
                />
              </div>
              
              <div>
                <Label htmlFor="observacao">Observação</Label>
                <Textarea
                  id="observacao"
                  defaultValue={selectedVoucher.Observação}
                  placeholder="Adicione observações sobre o voucher..."
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveVoucher}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Exception Dialog */}
      <Dialog open={isExceptionDialogOpen} onOpenChange={setIsExceptionDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Adicionar Voucher de Exceção</DialogTitle>
            <DialogDescription>
              Crie um voucher de exceção para a unidade selecionada.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="escola">Escola</Label>
                <Input
                  id="escola"
                  value={novoVoucherExcecao.escola}
                  onChange={(e) => setNovoVoucherExcecao({...novoVoucherExcecao, escola: e.target.value})}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="responsavelFinanceiro">Responsável Financeiro</Label>
                <Input
                  id="responsavelFinanceiro"
                  value={novoVoucherExcecao.responsavelFinanceiro}
                  onChange={(e) => setNovoVoucherExcecao({...novoVoucherExcecao, responsavelFinanceiro: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="curso">Curso</Label>
                <Input
                  id="curso"
                  value={novoVoucherExcecao.curso}
                  onChange={(e) => setNovoVoucherExcecao({...novoVoucherExcecao, curso: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="percentualVoucher">% Voucher</Label>
                <Input
                  id="percentualVoucher"
                  type="number"
                  value={novoVoucherExcecao.percentualVoucher}
                  onChange={(e) => setNovoVoucherExcecao({...novoVoucherExcecao, percentualVoucher: Number(e.target.value)})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  value={novoVoucherExcecao.codigo}
                  onChange={(e) => setNovoVoucherExcecao({...novoVoucherExcecao, codigo: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={novoVoucherExcecao.cpf}
                  onChange={(e) => setNovoVoucherExcecao({...novoVoucherExcecao, cpf: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="agenteSAF">Agente SAF que Solicitou *</Label>
              <Input
                id="agenteSAF"
                value={novoVoucherExcecao.agenteSAF}
                onChange={(e) => setNovoVoucherExcecao({...novoVoucherExcecao, agenteSAF: e.target.value})}
                placeholder="Nome do agente SAF"
              />
            </div>
            
            <div>
              <Label htmlFor="tituloEmail">Título do E-mail</Label>
              <Input
                id="tituloEmail"
                value={novoVoucherExcecao.tituloEmail}
                onChange={(e) => setNovoVoucherExcecao({...novoVoucherExcecao, tituloEmail: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="qtdUtilizacoes">Quantidade de Utilizações</Label>
              <Input
                id="qtdUtilizacoes"
                type="number"
                value={novoVoucherExcecao.qtdUtilizacoes}
                onChange={(e) => setNovoVoucherExcecao({...novoVoucherExcecao, qtdUtilizacoes: Number(e.target.value)})}
              />
            </div>
            
            <div>
              <Label htmlFor="justificativa">Justificativa *</Label>
              <Textarea
                id="justificativa"
                value={novoVoucherExcecao.justificativa}
                onChange={(e) => setNovoVoucherExcecao({...novoVoucherExcecao, justificativa: e.target.value})}
                placeholder="Descreva o motivo da criação deste voucher de exceção..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExceptionDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveException}>
              Criar Voucher de Exceção
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Exceptions Dialog */}
      <Dialog open={isViewExceptionsDialogOpen} onOpenChange={setIsViewExceptionsDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Vouchers de Exceção</DialogTitle>
            <DialogDescription>
              Lista de todos os vouchers de exceção criados.
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Escola</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>% Voucher</TableHead>
                  <TableHead>Qtd Utilizações</TableHead>
                  <TableHead>Solicitante</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vouchersExcecoes.filter(v => v['Nome Escola']).map((excecao, index) => (
                  <TableRow key={index}>
                    <TableCell>{excecao['Nome Escola']}</TableCell>
                    <TableCell>{excecao.Código}</TableCell>
                    <TableCell>{excecao['% Voucher']}%</TableCell>
                    <TableCell>{excecao['Qtd de utilizações']}</TableCell>
                    <TableCell>{excecao['Quem solicitou o voucher']}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsViewExceptionsDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VoucherUnitManager;
