import { byId, CHARACTERS } from "@/data/registry/characters";
import { CharacterCalculator } from "@/components/CharacterCalculator";

export function generateStaticParams() {
  return CHARACTERS.map(c => ({ id: c.id }));
}

// Next.js 16: route `params` is async and must be awaited.
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const config = byId(id);
  if (!config) return <p>Unknown character.</p>;
  return <CharacterCalculator config={config} />;
}
