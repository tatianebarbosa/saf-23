import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Building, 
  Users, 
  Filter,
  Eye,
  Edit,
  MoreVertical
} from "lucide-react";
import { knowledgeBase, Escola } from "@/data/knowledgeBase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const SchoolUnitsManager = () => {
  const [schools, setSchools] = useState<Escola[]>(knowledgeBase.escolas);
  const [filteredSchools, setFilteredSchools] = useState<Escola[]>(knowledgeBase.escolas);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedSchool, setSelectedSchool] = useState<Escola | null>(null);

  useEffect(() => {
    let filtered = schools;

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(school => 
        school.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.consultor_saf.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (filterState !== "all") {
      filtered = filtered.filter(school => school.estado === filterState);
    }

    // Filtro por status
    if (filterStatus !== "all") {
      filtered = filtered.filter(school => school.status_escola === filterStatus);
    }

    setFilteredSchools(filtered);
  }, [searchTerm, filterState, filterStatus, schools]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Ativa': return 'default';
      case 'Implantando': return 'secondary';
      case 'Inativa': return 'destructive';
      default: return 'outline';
    }
  };

  const getClusterColor = (cluster?: string) => {
    switch (cluster) {
      case 'Potente': return 'bg-green-100 text-green-800';
      case 'Desenvolvimento': return 'bg-blue-100 text-blue-800';
      case 'Alerta': return 'bg-orange-100 text-orange-800';
      case 'Implantação': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const uniqueStates = [...new Set(schools.map(school => school.estado))].sort();
  const uniqueStatuses = [...new Set(schools.map(school => school.status_escola))].filter(Boolean).sort();

  const handleViewDetails = (school: Escola) => {
    setSelectedSchool(school);
    toast.info(`Visualizando detalhes de ${school.nome}`);
  };

  const handleEditSchool = (school: Escola) => {
    toast.info(`Editando ${school.nome} - Funcionalidade em desenvolvimento`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Building className="h-8 w-8 text-primary" />
          Gerenciar Unidades Escolares
        </h1>
        <p className="text-muted-foreground">
          Visualize e gerencie todas as informações das unidades Maple Bear
        </p>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros e Busca
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, cidade, estado ou consultor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterState} onValueChange={setFilterState}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Estados</SelectItem>
                {uniqueStates.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                {uniqueStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredSchools.length} de {schools.length} unidades
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setFilterState("all");
                setFilterStatus("all");
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Escolas */}
      <div className="grid gap-4">
        {filteredSchools.map((school) => (
          <Card key={school.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{school.nome}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={getStatusColor(school.status_escola)}>
                          {school.status_escola || 'N/A'}
                        </Badge>
                        {school.cluster && (
                          <Badge className={getClusterColor(school.cluster)}>
                            {school.cluster}
                          </Badge>
                        )}
                        <span className="text-sm text-muted-foreground">ID: {school.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{school.cidade}, {school.estado}</span>
                    </div>
                    
                    {school.telefone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{school.telefone}</span>
                      </div>
                    )}
                    
                    {school.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{school.email}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{school.consultor_saf}</span>
                    </div>
                  </div>

                  {(school.logradouro || school.bairro || school.cep) && (
                    <div className="text-sm text-muted-foreground">
                      <strong>Endereço:</strong> {school.logradouro}
                      {school.bairro && `, ${school.bairro}`}
                      {school.cep && ` - CEP: ${school.cep}`}
                    </div>
                  )}

                  {school.cnpj && (
                    <div className="text-sm text-muted-foreground">
                      <strong>CNPJ:</strong> {school.cnpj}
                    </div>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(school)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditSchool(school)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar Informações
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSchools.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma escola encontrada</h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros ou termo de busca para encontrar as unidades desejadas.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modal de Detalhes (se necessário) */}
      {selectedSchool && (
        <Card className="fixed inset-4 z-50 bg-background shadow-2xl overflow-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Detalhes da Unidade</CardTitle>
              <Button variant="ghost" onClick={() => setSelectedSchool(null)}>
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h2 className="text-xl font-bold">{selectedSchool.nome}</h2>
              {/* Adicionar mais detalhes conforme necessário */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Informações Básicas</h3>
                  <p><strong>ID:</strong> {selectedSchool.id}</p>
                  <p><strong>Status:</strong> {selectedSchool.status_escola}</p>
                  <p><strong>Cluster:</strong> {selectedSchool.cluster}</p>
                  <p><strong>Consultor SAF:</strong> {selectedSchool.consultor_saf}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Contato</h3>
                  <p><strong>Cidade:</strong> {selectedSchool.cidade}</p>
                  <p><strong>Estado:</strong> {selectedSchool.estado}</p>
                  {selectedSchool.telefone && <p><strong>Telefone:</strong> {selectedSchool.telefone}</p>}
                  {selectedSchool.email && <p><strong>E-mail:</strong> {selectedSchool.email}</p>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SchoolUnitsManager;
