import { byId } from "@/data/registry/characters";
import { SupportBuildEditorView } from "@/components/calculator/SupportBuildEditorView";
import { prisma } from "@/lib/prisma";
import { decodeBuild } from "@/lib/engine/share";

export const dynamic = "force-dynamic";

export default async function SupportPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const sParams = await searchParams;
  const config = byId(id);
  if (!config) return <p>Unknown character.</p>;

  let initialBuildData: unknown = null;
  if (typeof sParams.share === "string") {
    initialBuildData = decodeBuild(sParams.share);
  }

  let savedBuilds: { id: string; name: string; characterId: string; data: unknown; updatedAt: Date }[] = [];
  let initialBuildId: string | null = null;
  let initialBuildName: string | null = null;

  try {
    const list = await prisma.build.findMany({
      where: { characterId: id },
      orderBy: { updatedAt: "desc" },
    });
    savedBuilds = list.map((b) => ({
      id: b.id,
      name: b.name,
      characterId: b.characterId,
      data: b.data,
      updatedAt: b.updatedAt,
    }));
  } catch {
    savedBuilds = [];
  }

  if (!initialBuildData && savedBuilds.length > 0) {
    initialBuildData = savedBuilds[0].data;
    initialBuildId = savedBuilds[0].id;
    initialBuildName = savedBuilds[0].name;
  }

  const initialBuildProp = initialBuildData
    ? { id: initialBuildId, name: initialBuildName, data: initialBuildData }
    : null;

  const fromCharacterId = typeof sParams.from === "string" ? sParams.from : null;

  return (
    <SupportBuildEditorView
      config={config}
      fromCharacterId={fromCharacterId}
      initialBuild={initialBuildProp}
    />
  );
}
