'use client';

import { useState, useEffect } from 'react';
import { clientStorage } from '@/lib/storage-client';

interface DashboardStats {
  total_profissionais: number;
  total_plantoes: number;
  escalas_ativas: number;
  substituicoes_pendentes: number;
  proximos_plantoes: any[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const dashboardStats = await clientStorage.getDashboardStats();
      setStats(dashboardStats);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar dashboard');
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadDashboardStats}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Escala360 - Dashboard</h1>
          <p className="text-gray-600 mt-2">Visão geral do sistema de escalas</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Profissionais Ativos"
            value={stats?.total_profissionais || 0}
            color="blue"
            icon="👥"
          />
          <StatCard
            title="Total de Plantões"
            value={stats?.total_plantoes || 0}
            color="green"
            icon="📅"
          />
          <StatCard
            title="Escalas Ativas"
            value={stats?.escalas_ativas || 0}
            color="yellow"
            icon="✅"
          />
          <StatCard
            title="Substituições Pendentes"
            value={stats?.substituicoes_pendentes || 0}
            color="red"
            icon="⏳"
          />
        </div>

        {/* Próximos Plantões */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Próximos Plantões (7 dias)</h2>
          </div>
          <div className="p-6">
            {stats?.proximos_plantoes && stats.proximos_plantoes.length > 0 ? (
              <div className="space-y-4">
                {stats.proximos_plantoes.map((plantao, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {new Date(plantao.data).getDate()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(plantao.data).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {plantao.hora_inicio} - {plantao.hora_fim}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{plantao.funcao?.nome}</p>
                      <p className="text-sm text-gray-600">{plantao.local?.nome}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum plantão próximo
                </h3>
                <p className="text-gray-600">
                  Não há plantões agendados para os próximos 7 dias.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickAction
            title="Ver Profissionais"
            description="Lista completa"
            href="/profissionais"
            icon="👥"
            color="blue"
          />
          <QuickAction
            title="Visualizar Escalas"
            description="Escalas consolidadas"
            href="/escalas"
            icon="📊"
            color="green"
          />
          <QuickAction
            title="Substituições Pendentes"
            description="Aprovar/rejeitar"
            href="/substituicoes"
            icon="🔄"
            color="yellow"
          />
          <QuickAction
            title="Nova Escala"
            description="Cadastrar plantão"
            href="/escalas/nova"
            icon="➕"
            color="purple"
          />
        </div>
      </div>
    </div>
  );
}

// Componente auxiliar para cartões de estatística
function StatCard({ 
  title, 
  value, 
  color, 
  icon 
}: { 
  title: string;
  value: number;
  color: 'blue' | 'green' | 'yellow' | 'red';
  icon: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    red: 'bg-red-50 border-red-200 text-red-700',
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border-2 ${colorClasses[color]} p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-3xl opacity-75">{icon}</div>
      </div>
    </div>
  );
}

// Componente auxiliar para ações rápidas
function QuickAction({
  title,
  description,
  href,
  icon,
  color,
}: {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: 'blue' | 'green' | 'yellow' | 'purple';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700',
    green: 'bg-green-50 hover:bg-green-100 border-green-200 text-green-700',
    yellow: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200 text-yellow-700',
    purple: 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700',
  };

  return (
    <a
      href={href}
      className={`block p-4 rounded-lg border-2 ${colorClasses[color]} transition-colors cursor-pointer`}
    >
      <div className="flex items-center space-x-3">
        <div className="text-2xl">{icon}</div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm opacity-75">{description}</p>
        </div>
      </div>
    </a>
  );
}