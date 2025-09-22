import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, Award, Search, Filter, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SchoolRanking {
  id: string;
  schoolName: string;
  totalDesigns: number;
  activeUsers: number;
  engagementScore: number;
  lastReportDate: string; // ISO Date string
}

const mockRankingData: SchoolRanking[] = [
  {
    id: '1',
    schoolName: 'Maple Bear São Paulo - Morumbi',
    totalDesigns: 1200,
    activeUsers: 150,
    engagementScore: 9.2,
    lastReportDate: '2025-09-15',
  },
  {
    id: '2',
    schoolName: 'Maple Bear Rio de Janeiro - Barra',
    totalDesigns: 950,
    activeUsers: 120,
    engagementScore: 8.8,
    lastReportDate: '2025-09-10',
  },
  {
    id: '3',
    schoolName: 'Maple Bear Curitiba - Batel',
    totalDesigns: 800,
    activeUsers: 100,
    engagementScore: 8.5,
    lastReportDate: '2025-09-12',
  },
  {
    id: '4',
    schoolName: 'Maple Bear Belo Horizonte - Savassi',
    totalDesigns: 700,
    activeUsers: 90,
    engagementScore: 8.0,
    lastReportDate: '2025-09-08',
  },
  {
    id: '5',
    schoolName: 'Maple Bear Porto Alegre - Moinhos de Vento',
    totalDesigns: 600,
    activeUsers: 80,
    engagementScore: 7.5,
    lastReportDate: '2025-09-05',
  },
];

const CanvaRanking = () => {
  const [rankingData, setRankingData] = useState<SchoolRanking[]>(mockRankingData);
  const [filteredRanking, setFilteredRanking] = useState<SchoolRanking[]>(mockRankingData);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof SchoolRanking>('engagementScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  useEffect(() => {
    let filtered = rankingData.filter(school => 
      school.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      return 0;
    });

    setFilteredRanking(filtered);
  }, [rankingData, searchTerm, sortBy, sortOrder]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          // Assuming CSV format for simplicity, parse and update rankingData
          // In a real app, you'd parse CSV/Excel and validate data
          const newRecords: SchoolRanking[] = content.split('\n').slice(1).map(line => {
            const [id, schoolName, totalDesigns, activeUsers, engagementScore, lastReportDate] = line.split(',');
            return {
              id: id || Date.now().toString(),
              schoolName: schoolName || 'N/A',
              totalDesigns: parseInt(totalDesigns) || 0,
              activeUsers: parseInt(activeUsers) || 0,
              engagementScore: parseFloat(engagementScore) || 0,
              lastReportDate: lastReportDate || new Date().toISOString().split('T')[0],
            };
          });
          setRankingData(prev => {
            const updated = [...prev];
            newRecords.forEach(newRec => {
              const existingIndex = updated.findIndex(rec => rec.schoolName === newRec.schoolName);
              if (existingIndex > -1) {
                updated[existingIndex] = newRec; // Update existing
              } else {
                updated.push(newRec); // Add new
              }
            });
            return updated;
          });
          toast({
            title: 'Sucesso',
            description: 'Relatório de ranking atualizado com sucesso!',
          });
        } catch (error) {
          toast({
            title: 'Erro',
            description: 'Falha ao processar o arquivo. Verifique o formato.',
            variant: 'destructive',
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSort = (column: keyof SchoolRanking) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Award className="w-8 h-8 text-primary" />
            Ranking de Escolas Canva
          </h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Monitore o desempenho e engajamento das escolas com o Canva.
          </p>
        </div>
        
        <label htmlFor="upload-ranking" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 cursor-pointer gap-2">
          <Upload className="w-4 h-4" />
          Atualizar Ranking (CSV)
          <Input id="upload-ranking" type="file" accept=".csv" onChange={handleFileUpload} className="sr-only" />
        </label>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar escola..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Classificação Atual</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort('schoolName')}>Escola {sortBy === 'schoolName' && (sortOrder === 'asc' ? <ArrowUp className="inline-block h-4 w-4" /> : <ArrowDown className="inline-block h-4 w-4" />)}</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('totalDesigns')}>Total de Designs {sortBy === 'totalDesigns' && (sortOrder === 'asc' ? <ArrowUp className="inline-block h-4 w-4" /> : <ArrowDown className="inline-block h-4 w-4" />)}</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('activeUsers')}>Usuários Ativos {sortBy === 'activeUsers' && (sortOrder === 'asc' ? <ArrowUp className="inline-block h-4 w-4" /> : <ArrowDown className="inline-block h-4 w-4" />)}</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('engagementScore')}>Engajamento {sortBy === 'engagementScore' && (sortOrder === 'asc' ? <ArrowUp className="inline-block h-4 w-4" /> : <ArrowDown className="inline-block h-4 w-4" />)}</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('lastReportDate')}>Último Relatório {sortBy === 'lastReportDate' && (sortOrder === 'asc' ? <ArrowUp className="inline-block h-4 w-4" /> : <ArrowDown className="inline-block h-4 w-4" />)}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRanking.map((school) => (
                <TableRow key={school.id}>
                  <TableCell className="font-medium">{school.schoolName}</TableCell>
                  <TableCell>{school.totalDesigns}</TableCell>
                  <TableCell>{school.activeUsers}</TableCell>
                  <TableCell>{school.engagementScore.toFixed(1)}</TableCell>
                  <TableCell>{school.lastReportDate}</TableCell>
                </TableRow>
              ))}
              {filteredRanking.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Nenhuma escola encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CanvaRanking;
