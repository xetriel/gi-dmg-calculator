import { ARTIFACTS } from "../src/data/registry/artifacts";

function escapeSql(str: string): string {
  return str.replace(/'/g, "''");
}

console.log("INSERT INTO `Artifact` (`id`, `name`, `rarity`, `twoPieceDesc`, `fourPieceDesc`, `isSupport`, `buffType`, `buffConfig`) VALUES");
const lines = ARTIFACTS.map((a, i) => {
  const isLast = i === ARTIFACTS.length - 1;
  const buffJson = JSON.stringify(a.buffs.map((b) => ({ id: b.id, stat: b.stat, value: b.value ?? 0, isTeamBuff: b.isTeamBuff })));
  return `  ('${a.id}', '${escapeSql(a.name)}', ${a.rarity}, '${escapeSql(a.twoPieceDesc)}', '${escapeSql(a.fourPieceDesc)}', ${a.isSupport ? "TRUE" : "FALSE"}, '${a.buffType}', '${escapeSql(buffJson)}')${isLast ? ";" : ","}`;
});
console.log(lines.join("\n"));
