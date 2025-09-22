import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Download, 
  Upload, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  Building
} from 'lucide-react';
import { toast } from 'sonner';

interface CanvaUser {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  school: string;
  addedDate: string;
}

interface School {
  id: string;
  name: string;
  totalLicenses: number;
  usedLicenses: number;
  users: CanvaUser[];
}

const CanvaLicenseControl = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);

  // Dados de exemplo baseados na imagem
  useEffect(() => {
    const mockSchools: School[] = [
      {
        id: '753',
        name: 'Maple Bear Arcoverde',
        totalLicenses: 4,
        usedLicenses: 2,
        users: [
          {
            id: '1',
            name: 'João Silva',
            email: 'joao.silva@maplebear.com.br',
            status: 'active',
            school: 'Maple Bear Arcoverde',
            addedDate: '2024-01-15'
          },
          {
            id: '2',
            name: 'Maria Santos',
            email: 'maria.santos@maplebear.com.br',
            status: 'active',
            school: 'Maple Bear Arcoverde',
            addedDate: '2024-02-01'
          }
        ]
      },
      {
        id: '750',
        name: 'Maple Bear Pindamonhangaba',
        totalLicenses: 2,
        usedLicenses: 1,
        users: [
          {
            id: '3',
            name: 'Pedro Oliveira',
            email: 'pedro.oliveira@maplebear.com.br',
            status: 'active',
            school: 'Maple Bear Pindamonhangaba',
            addedDate: '2024-01-20'
          }
        ]
      },
      {
        id: '803',
        name: 'Maple Bear Balcas',
        totalLicenses: 5,
        usedLicenses: 3,
        users: [
          {
            id: '4',
            name: 'Ana Costa',
            email: 'ana.costa@maplebear.com.br',
            status: 'active',
            school: 'Maple Bear Balcas',
            addedDate: '2024-01-10'
          },
          {
            id: '5',
            name: 'Carlos Ferreira',
            email: 'carlos.ferreira@maplebear.com.br',
            status: 'active',
            school: 'Maple Bear Balcas',
            addedDate: '2024-01-25'
          },
          {
            id: '6',
            name: 'Lucia Mendes',
            email: 'lucia.mendes@maplebear.com.br',
            status: 'inactive',
            school: 'Maple Bear Balcas',
            addedDate: '2024-02-05'
          }
        ]
      },
      {
        id: '476',
        name: 'Maple Bear Paracatu - Centro I',
        totalLicenses: 3,
        usedLicenses: 0,
        users: []
      }
    ];

    setSchools(mockSchools);
  }, []);

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.id.includes(searchTerm)
  );

  const handleAddUser = (schoolId: string) => {
    toast.info(`Adicionando usuário para escola ${schoolId}`);
    // Implementar lógica para adicionar usuário
  };

  const handleRemoveUser = (schoolId: string, userId: string) => {
    setSchools(prev => prev.map(school => {
      if (school.id === schoolId) {
        return {
          ...school,
          users: school.users.filter(user => user.id !== userId),
          usedLicenses: school.usedLicenses - 1
        };
      }
      return school;
    }));
    
    toast.success('Usuário removido com sucesso');
  };

  const getLicenseStatus = (school: School) => {
    if (school.usedLicenses === 0) {
      return { color: 'bg-gray-100 text-gray-800', text: 'Nenhum usuário cadastrado' };
    } else if (school.usedLicenses > school.totalLicenses) {
      return { color: 'bg-red-100 text-red-800', text: `${school.usedLicenses} Licenças (Excesso)` };
    } else {
      return { color: 'bg-green-100 text-green-800', text: `${school.usedLicenses}/${school.totalLicenses} Licenças` };
    }
  };

  const isValidEmail = (email: string) => {
    const validDomains = ['@sebsa', '@seb'];
    const containsMaplebear = email.toLowerCase().includes('maplebear');
    
    // Verifica se contém maplebear em qualquer parte do domínio ou se é um dos domínios específicos
    return validDomains.some(domain => email.toLowerCase().includes(domain)) || containsMaplebear;
  };

  const getTotalStats = () => {
    const totalLicenses = schools.reduce((sum, school) => sum + school.totalLicenses, 0);
    const totalUsed = schools.reduce((sum, school) => sum + school.usedLicenses, 0);
    const totalExcess = schools.reduce((sum, school) => 
      sum + Math.max(0, school.usedLicenses - school.totalLicenses), 0
    );
    const invalidUsers = schools.reduce((sum, school) => 
      sum + school.users.filter(user => !isValidEmail(user.email)).length, 0
    );

    return { totalLicenses, totalUsed, totalExcess, invalidUsers };
  };

  const stats = getTotalStats();

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building className="h-8 w-8 text-primary" />
            Controle de Licenças Canva
          </h1>
          <p className="text-muted-foreground">
            Gerencie as licenças do Canva por unidade escolar
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Importar
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Usuário
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Licenças</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalLicenses}</div>
            <p className="text-xs text-muted-foreground">
              Licenças disponíveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Licenças Ativas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalUsed}</div>
            <p className="text-xs text-muted-foreground">
              Em uso atualmente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Excesso</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.totalExcess}</div>
            <p className="text-xs text-muted-foreground">
              Licenças em excesso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Inválidos</CardTitle>
            <XCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.invalidUsers}</div>
            <p className="text-xs text-muted-foreground">
              Domínio inválido
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome da escola ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Schools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSchools.map((school) => {
          const licenseStatus = getLicenseStatus(school);
          
          return (
            <Card key={school.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{school.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">ID: {school.id}</p>
                  </div>
                  <Badge className={licenseStatus.color}>
                    {licenseStatus.text}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {school.users.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum usuário cadastrado</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {school.users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!isValidEmail(user.email) && (
                            <AlertTriangle className="h-4 w-4 text-orange-500" title="Domínio inválido" />
                          )}
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                            {user.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveUser(school.id, user.id)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <Button
                  onClick={() => handleAddUser(school.id)}
                  className="w-full"
                  variant="outline"
                  disabled={school.usedLicenses >= school.totalLicenses}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Usuário
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredSchools.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <Building className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">Nenhuma escola encontrada</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Nenhuma escola encontrada com os critérios de busca.' : 'Carregue os dados das escolas para começar.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CanvaLicenseControl;

