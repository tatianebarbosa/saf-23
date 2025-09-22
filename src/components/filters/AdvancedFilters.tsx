import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  X,
  Building,
  Users,
  MapPin,
  Calendar,
  Tag
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface FilterOptions {
  cluster: string;
  schoolName: string;
  schoolId: string;
  responsibleSAF: string;
  status: string;
  dateRange: string;
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  availableClusters?: string[];
  availableResponsibles?: string[];
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  onFiltersChange,
  availableClusters = ['Desenvolvimento', 'Potente', 'Alerta', 'Implantação'],
  availableResponsibles = [
    'RAFHAEL NAZEAZENO PEREIRA',
    'INGRID VANIA MAZZEI DE OLIVEIRA', 
    'Joao Felipe Gutierrez de Freitas',
    'TATIANE BARBOSA DOS SANTOS XAVIER'
  ]
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    cluster: '',
    schoolName: '',
    schoolId: '',
    responsibleSAF: '',
    status: '',
    dateRange: ''
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: FilterOptions = {
      cluster: '',
      schoolName: '',
      schoolId: '',
      responsibleSAF: '',
      status: '',
      dateRange: ''
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== '').length;
  };

  const getActiveFilters = () => {
    const active = [];
    if (filters.cluster) active.push({ key: 'Cluster', value: filters.cluster });
    if (filters.schoolName) active.push({ key: 'Escola', value: filters.schoolName });
    if (filters.schoolId) active.push({ key: 'ID', value: filters.schoolId });
    if (filters.responsibleSAF) active.push({ key: 'Responsável', value: filters.responsibleSAF });
    if (filters.status) active.push({ key: 'Status', value: filters.status });
    if (filters.dateRange) active.push({ key: 'Período', value: filters.dateRange });
    return active;
  };

  return (
    <div className="space-y-4">
      {/* Filter Button and Active Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtros Avançados
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-0" align="start">
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filtros Avançados
                  </span>
                  {getActiveFiltersCount() > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Limpar
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cluster Filter */}
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4" />
                    Cluster
                  </label>
                  <Select 
                    value={filters.cluster} 
                    onValueChange={(value) => handleFilterChange('cluster', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cluster" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os clusters</SelectItem>
                      {availableClusters.map(cluster => (
                        <SelectItem key={cluster} value={cluster}>{cluster}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* School Name Filter */}
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Building className="h-4 w-4" />
                    Nome da Escola
                  </label>
                  <Input
                    placeholder="Digite o nome da escola..."
                    value={filters.schoolName}
                    onChange={(e) => handleFilterChange('schoolName', e.target.value)}
                  />
                </div>

                {/* School ID Filter */}
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Tag className="h-4 w-4" />
                    ID da Escola
                  </label>
                  <Input
                    placeholder="Digite o ID da escola..."
                    value={filters.schoolId}
                    onChange={(e) => handleFilterChange('schoolId', e.target.value)}
                  />
                </div>

                {/* Responsible SAF Filter */}
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4" />
                    Responsável SAF
                  </label>
                  <Select 
                    value={filters.responsibleSAF} 
                    onValueChange={(value) => handleFilterChange('responsibleSAF', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os responsáveis</SelectItem>
                      {availableResponsibles.map(responsible => (
                        <SelectItem key={responsible} value={responsible}>
                          {responsible}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Tag className="h-4 w-4" />
                    Status
                  </label>
                  <Select 
                    value={filters.status} 
                    onValueChange={(value) => handleFilterChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os status</SelectItem>
                      <SelectItem value="Ativa">Ativa</SelectItem>
                      <SelectItem value="Implantando">Implantando</SelectItem>
                      <SelectItem value="Inativa">Inativa</SelectItem>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                      <SelectItem value="Resolvido">Resolvido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4" />
                    Período
                  </label>
                  <Select 
                    value={filters.dateRange} 
                    onValueChange={(value) => handleFilterChange('dateRange', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os períodos</SelectItem>
                      <SelectItem value="today">Hoje</SelectItem>
                      <SelectItem value="week">Esta semana</SelectItem>
                      <SelectItem value="month">Este mês</SelectItem>
                      <SelectItem value="quarter">Este trimestre</SelectItem>
                      <SelectItem value="year">Este ano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={() => setIsOpen(false)} 
                    className="flex-1"
                  >
                    Aplicar Filtros
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={clearFilters}
                    className="flex-1"
                  >
                    Limpar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>

        {/* Active Filters Display */}
        {getActiveFilters().length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Filtros ativos:</span>
            {getActiveFilters().map((filter, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="gap-1"
              >
                <span className="font-medium">{filter.key}:</span>
                <span>{filter.value}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1 hover:bg-transparent"
                  onClick={() => {
                    const key = Object.keys(filters).find(k => 
                      filters[k as keyof FilterOptions] === filter.value
                    ) as keyof FilterOptions;
                    if (key) handleFilterChange(key, '');
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Quick Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Busca rápida por escola, ID, responsável..."
          className="pl-9"
          value={filters.schoolName}
          onChange={(e) => handleFilterChange('schoolName', e.target.value)}
        />
      </div>
    </div>
  );
};

export default AdvancedFilters;

