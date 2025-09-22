import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Edit,
  Trash2,
  ArrowRightLeft,
  FileText,
  Download,
  Upload,
  Eye,
  AlertCircle,
  UserCheck,
  UserX
} from 'lucide-react';

// Importar dados das planilhas
import usuariosData from '@/data/usuarios_public.json';
import vouchersData from '@/data/vouchers_campanha.json';

interface Usuario {
  Nome: string;
  'E-mail': string;
  Função: string;
  Escola: string;
  'Escola ID': number;
  'Status Licença': string;
  'Atualizado em': string;
}

interface Escola {
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

const CanvaLicenseManager = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [clusterFilter, setClusterFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [emailFilter, setEmailFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [justification, setJustification] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Carregar dados das planilhas
    setUsuarios(usuariosData as Usuario[]);
    setEscolas(vouchersData as Escola[]);
    setFilteredUsuarios(usuariosData as Usuario[]);
  }, []);

  useEffect(() => {
    // Aplicar filtros
    let filtered = usuarios.filter(usuario => {
      const matchesSearch = 
        usuario.Nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario['E-mail']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.Escola?.toLowerCase().includes(searchTerm.toLowerCase());

      const escola = escolas.find(e => e['Escola ID'] === usuario['Escola ID']);
      const matchesCluster = clusterFilter === 'all' || escola?.Cluster === clusterFilter;
      
      const matchesStatus = statusFilter === 'all' || usuario['Status Licença'] === statusFilter;
      
      const isNonCompliantEmail = !isEmailCompliant(usuario['E-mail']);
      const matchesEmail = 
        emailFilter === 'all' || 
        (emailFilter === 'compliant' && !isNonCompliantEmail) ||
        (emailFilter === 'non-compliant' && isNonCompliantEmail);

      return matchesSearch && matchesCluster && matchesStatus && matchesEmail;
    });

    setFilteredUsuarios(filtered);
  }, [searchTerm, clusterFilter, statusFilter, emailFilter, usuarios, escolas]);

  const isEmailCompliant = (email: string): boolean => {
    if (!email) return false;
    const compliantDomains = ['@maplebear.com.br', '@seb.com.br', '@sebsa.com.br', '@mbcentral.com.br'];
    return compliantDomains.some(domain => email.toLowerCase().includes(domain));
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'ativa':
        return <Badge className="bg-green-100 text-green-800">Ativa</Badge>;
      case 'expirada':
        return <Badge className="bg-red-100 text-red-800">Expirada</Badge>;
      case 'livre':
        return <Badge className="bg-blue-100 text-blue-800">Livre</Badge>;
      case 'concluída':
        return <Badge className="bg-gray-100 text-gray-800">Concluída</Badge>;
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

  const handleEditUser = (user: Usuario) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleTransferLicense = (user: Usuario) => {
    setSelectedUser(user);
    setIsTransferDialogOpen(true);
  };

  const handleRemoveUser = (user: Usuario) => {
    if (!justification.trim()) {
      toast({
        title: "Justificativa obrigatória",
        description: "Por favor, forneça uma justificativa para a remoção.",
        variant: "destructive"
      });
      return;
    }

    // Aqui você enviaria a solicitação para a coordenadora
    toast({
      title: "Solicitação enviada",
      description: `Solicitação de remoção de ${user.Nome} enviada para aprovação da coordenadora.`,
    });

    setJustification('');
  };

  const handleSaveChanges = () => {
    if (!justification.trim()) {
      toast({
        title: "Justificativa obrigatória",
        description: "Por favor, forneça uma justificativa para as alterações.",
        variant: "destructive"
      });
      return;
    }

    // Aqui você salvaria as alterações e enviaria para aprovação
    toast({
      title: "Alterações salvas",
      description: "Alterações enviadas para aprovação da coordenadora.",
    });

    setIsEditDialogOpen(false);
    setIsTransferDialogOpen(false);
    setJustification('');
    setSelectedUser(null);
  };

  const stats = {
    total: filteredUsuarios.length,
    ativas: filteredUsuarios.filter(u => u['Status Licença']?.toLowerCase() === 'ativa').length,
    expiradas: filteredUsuarios.filter(u => u['Status Licença']?.toLowerCase() === 'expirada').length,
    livres: filteredUsuarios.filter(u => u['Status Licença']?.toLowerCase() === 'livre').length,
    nonCompliant: filteredUsuarios.filter(u => !isEmailCompliant(u['E-mail'])).length
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gerenciamento de Licenças Canva</h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Gerencie licenças por unidade, controle acessos e monitore conformidade
          </p>
        </div>
        
        <Button className="gap-2 bg-red-600 hover:bg-red-700">
          <UserPlus className="h-4 w-4" />
          Adicionar Usuário
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.ativas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiradas</CardTitle>
            <Clock className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.expiradas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Livres</CardTitle>
            <Building className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.livres}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Não Conformes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.nonCompliant}</div>
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
                placeholder="Buscar por nome, email ou escola..."
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
                <SelectItem value="ativa">Ativa</SelectItem>
                <SelectItem value="expirada">Expirada</SelectItem>
                <SelectItem value="livre">Livre</SelectItem>
                <SelectItem value="concluída">Concluída</SelectItem>
              </SelectContent>
            </Select>

            <Select value={emailFilter} onValueChange={setEmailFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Conformidade Email" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="compliant">Conformes</SelectItem>
                <SelectItem value="non-compliant">Não Conformes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="grid gap-4">
        {filteredUsuarios.map((usuario, index) => {
          const escola = escolas.find(e => e['Escola ID'] === usuario['Escola ID']);
          const isNonCompliant = !isEmailCompliant(usuario['E-mail']);
          
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-red-100 text-red-600 font-bold">
                        {usuario.Nome?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{usuario.Nome || 'Nome não informado'}</h3>
                        {isNonCompliant && (
                          <div 
                            className="w-3 h-3 bg-red-500 rounded-full cursor-help"
                            title="Email fora da conformidade da licença"
                          />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span>{usuario['E-mail'] || 'Email não informado'}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="w-4 h-4" />
                        <span>{usuario.Escola || 'Escola não informada'}</span>
                        {escola && (
                          <>
                            <span>•</span>
                            {getClusterBadge(escola.Cluster)}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusBadge(usuario['Status Licença'])}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {usuario.Função || 'Função não informada'}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(usuario)}
                        className="gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTransferLicense(usuario)}
                        className="gap-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        Transferir
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveUser(usuario)}
                        className="gap-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remover
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Faça as alterações necessárias. Uma justificativa será solicitada.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">Nome</label>
                <Input
                  id="name"
                  defaultValue={selectedUser.Nome}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="email" className="text-right">Email</label>
                <Input
                  id="email"
                  defaultValue={selectedUser['E-mail']}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="justification" className="text-right">Justificativa</label>
                <Textarea
                  id="justification"
                  placeholder="Descreva o motivo das alterações..."
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveChanges}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer Dialog */}
      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Transferir Licença</DialogTitle>
            <DialogDescription>
              Transfira a licença para outro usuário. Uma justificativa será solicitada.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="newUser" className="text-right">Novo Usuário</label>
              <Input
                id="newUser"
                placeholder="Email do novo usuário"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="transferJustification" className="text-right">Justificativa</label>
              <Textarea
                id="transferJustification"
                placeholder="Descreva o motivo da transferência..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveChanges}>
              Transferir Licença
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CanvaLicenseManager;
