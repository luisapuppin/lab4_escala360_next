'use client';

import { useState, useEffect } from 'react';
import { clientStorage } from '@/lib/storage-client';
import { Substituicao } from '@/types';

export default function SubstituicoesPendentes() {
  const [substituicoes, setSubstituicoes] = useState<Substituicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    loadSubstituicoes();
  }, []);

  const loadSubstituicoes = async () => {
    try {
      setLoading(true);
      const substituicoesPendentes = await clientStorage.getSubstituicoesPendentes();
      setSubstituicoes(substituicoesPendentes);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar substituições');
      console.error('Error loading substituicoes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAprovar = async (id: number) => {
    try {
      setActionLoading(id);
      await clientStorage.aprovarSubstituicao(id);
      await loadSubstituicoes(); // Recarregar a lista
    } catch (err) {
      setError('Erro ao aprovar substituição');
      console.error('Error approving substituicao:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejeitar = async (id: number) => {
    try {
      setActionLoading(id);
      await clientStorage.rejeitarSubstituicao(id);
      await loadSubstituicoes(); // Recarregar a lista
    } catch (err) {
      setError('Erro ao rejeitar substituição');
      console.error('Error rejecting substituicao:', err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando substituições...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Substituições Pendentes de Aprovação
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Como supervisor, você pode aprovar ou rejeitar as solicitações de substituição.
            </p>
          </div>
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            {substituicoes.length} pendente{substituicoes.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <div className="text-red-500 mr-2">⚠️</div>
            <p className="text-red-700">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-600 text-sm mt-2 hover:text-red-800"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Substituições List */}
      <div className="p-6">
        {substituicoes.length > 0 ? (
          <div className="space-y-4">
            {substituicoes.map((substituicao) => (
              <div
                key={substituicao.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                  {/* Plantão Info */}
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(substituicao.id_escala_original.id_plantao.data).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {substituicao.id_escala_original.id_plantao.hora_inicio} -{' '}
                      {substituicao.id_escala_original.id_plantao.hora_fim}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Local: {substituicao.id_escala_original.id_plantao.local.nome}
                    </p>
                  </div>

                  {/* Substituição Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="font-medium text-gray-900">
                          {substituicao.id_profissional_solicitante.nome}
                        </p>
                        <p className="text-xs text-gray-500">
                          {substituicao.id_profissional_solicitante.cargo}
                        </p>
                      </div>
                      <div className="text-yellow-500 font-bold">→</div>
                      <div className="text-center">
                        <p className="font-medium text-gray-900">
                          {substituicao.id_profissional_substituto.nome}
                        </p>
                        <p className="text-xs text-gray-500">
                          {substituicao.id_profissional_substituto.cargo}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Solicitado em: {new Date(substituicao.data_solicitacao).toLocaleString('pt-BR')}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 justify-end">
                    <button
                      onClick={() => handleAprovar(substituicao.id)}
                      disabled={actionLoading === substituicao.id}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {actionLoading === substituicao.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
                      ) : (
                        '✅ Aprovar'
                      )}
                    </button>
                    <button
                      onClick={() => handleRejeitar(substituicao.id)}
                      disabled={actionLoading === substituicao.id}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {actionLoading === substituicao.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
                      ) : (
                        '❌ Rejeitar'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma substituição pendente
            </h3>
            <p className="text-gray-600">
              Todas as substituições foram processadas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}