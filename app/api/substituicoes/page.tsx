import SubstituicoesPendentes from '@/components/SubstituicoesPendentes';

export default function SubstituicoesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Substituições</h1>
          <p className="text-gray-600 mt-2">Gerencie as solicitações de substituição</p>
        </div>
        <SubstituicoesPendentes />
      </div>
    </div>
  );
}