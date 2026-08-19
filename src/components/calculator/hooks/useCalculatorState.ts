import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { CharacterConfig, ReactionType } from "@/data/registry/types";
import type { SavedRotation, RotationStep, SavedBuild, CalcInstance } from "../types";
import type { TalentScalingData } from "@/lib/talent-scaling";
import { saveBuild, deleteBuild } from "@/app/builds/actions";
import { encodeBuild } from "@/lib/engine/share";
import { toNum } from "@/lib/engine/validation";

export const initialStats: Record<string, string> = {
  "hp.base": "1000",
  "hp.percent": "50",
  "hp.flat": "15000",
  "atk.base": "700",
  "atk.percent": "40",
  "atk.flat": "1200",
  "def.base": "800",
  "def.percent": "10",
  "def.flat": "30",
  "critRate": "70",
  "critDmg": "140",
  "dmgBonus": "0",
  "normalDmgBonus": "0",
  "chargedDmgBonus": "0",
  "plungeDmgBonus": "0",
  "skillDmgBonus": "0",
  "burstDmgBonus": "0",
  "pyroDmgBonus": "0",
  "hydroDmgBonus": "0",
  "dendroDmgBonus": "0",
  "electroDmgBonus": "0",
  "anemoDmgBonus": "0",
  "cryoDmgBonus": "0",
  "geoDmgBonus": "0",
  "physicalDmgBonus": "0",
  "em": "0",
  "energyRecharge": "100",
  "healingBonus": "0",
  "dmgReduction": "0",
  "enemyRes": "10",
  "levelChar": "90",
  "levelEnemy": "100",
  "defReduction": "0",
  "defIgnore": "0",
  "lunarChargedDmgBonus": "0",
  "lunarBloomDmgBonus": "0",
  "lunarCrystallizeDmgBonus": "0",
  "lunarChargedElevation": "0",
  "lunarBloomElevation": "0",
  "lunarCrystallizeElevation": "0",
  "lunarChargedFlatDmg": "0",
  "lunarBloomFlatDmg": "0",
  "lunarCrystallizeFlatDmg": "0",
};

export const getInitialStats = (config: CharacterConfig): Record<string, string> => {
  const stats = { ...initialStats };

  // Check if character has Lunar or Stellar damage output
  const isLunarOrStellar = config.talents.some(t =>
    t.hits.some(h => h.direct === "lunar" || h.direct === "stellar")
  );

  if (!isLunarOrStellar) {
    const elemKey = `${config.element.toLowerCase()}DmgBonus`;
    if (elemKey in stats) {
      stats[elemKey] = "46.6";
    }
  }

  return stats;
};

export function hydrateFromBuild(
  data: unknown,
  createInitialInstance: (id: string) => CalcInstance
): { instances: CalcInstance[]; rotations: SavedRotation[]; activeRotationId: string } {
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const d = data as {
      rotations?: unknown;
      rotationSteps?: unknown;
      instances?: CalcInstance[];
      activeRotationId?: string;
      description?: string;
    };
    if (Array.isArray(d.rotations)) {
      return {
        instances: (d.instances ?? [createInitialInstance("1")]) as CalcInstance[],
        rotations: d.rotations as SavedRotation[],
        activeRotationId: (d.activeRotationId ?? ((d.rotations as SavedRotation[])[0]?.id || "")) as string,
      };
    }
    if (Array.isArray(d.rotationSteps)) {
      const legacyRot: SavedRotation = {
        id: "legacy-rotation",
        name: "Combo 1",
        description: (d.description ?? "") as string,
        steps: d.rotationSteps as RotationStep[],
      };
      return {
        instances: (d.instances ?? [createInitialInstance("1")]) as CalcInstance[],
        rotations: [legacyRot],
        activeRotationId: "legacy-rotation",
      };
    }
  }
  if (Array.isArray(data) && data.length > 0) {
    return {
      instances: data as CalcInstance[],
      rotations: [{ id: "combo-1", name: "Combo 1", description: "Default rotation sequence", steps: [] }],
      activeRotationId: "combo-1",
    };
  }
  return {
    instances: [createInitialInstance("1")],
    rotations: [{ id: "combo-1", name: "Combo 1", description: "Default rotation sequence", steps: [] }],
    activeRotationId: "combo-1",
  };
}

interface UseCalculatorStateProps {
  config: CharacterConfig;
  scaling: TalentScalingData;
  initialBuild?: { id: string | null; name: string | null; data: unknown } | null;
  savedBuilds?: SavedBuild[];
  rotations: SavedRotation[];
  activeRotationId: string;
  setRotations: React.Dispatch<React.SetStateAction<SavedRotation[]>>;
  setActiveRotationId: React.Dispatch<React.SetStateAction<string>>;
  hydrated: { instances: CalcInstance[]; rotations: SavedRotation[]; activeRotationId: string } | null;
}

export function useCalculatorState({
  config,
  scaling,
  initialBuild,
  savedBuilds = [],
  rotations,
  activeRotationId,
  setRotations,
  setActiveRotationId,
  hydrated,
}: UseCalculatorStateProps) {
  const router = useRouter();

  const createInitialInstance = (id: string): CalcInstance => {
    const initLevels: Record<string, string> = {};
    for (const g of config.talents) {
      const s = scaling[g.type];
      if (s && s.levels.length) initLevels[g.type] = String(s.levels[s.levels.length - 1]);
    }
    const initMechanics: Record<string, string> = {};
    for (const m of config.mechanicDefs ?? []) {
      initMechanics[m.id] = String(m.defaultValue ?? 0);
    }
    return {
      id,
      stats: getInitialStats(config),
      hits: {},
      levels: initLevels,
      mechanicInputs: initMechanics,
      reaction: "none",
      reactionBonus: "",
      reactionPanelBonus: "0",
      lunarBaseBonus: "0",
      constellationLevel: 0,
      teamSupports: [],
      teamBuffsEnabled: true,
      externalWeapons: [],
      externalWeaponBuffsEnabled: true,
    };
  };


  const [isMounted, setIsMounted] = useState(false);

  const [instances, setInstances] = useState<CalcInstance[]>(
    () => hydrated?.instances ?? [createInitialInstance("1")]
  );

  const [activeBuildId, setActiveBuildId] = useState<string | null>(
    () => (hydrated ? null : initialBuild?.id ?? null)
  );
  const [activeBuildName, setActiveBuildName] = useState<string>(
    () => (hydrated ? "Shared Build" : initialBuild?.name ?? "Scratchpad")
  );
  const [savedBuildsList, setSavedBuildsList] = useState<SavedBuild[]>(() => [...savedBuilds]);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [newBuildName, setNewBuildName] = useState("");
  const [isLoadDropdownOpen, setIsLoadDropdownOpen] = useState(false);

  const [savedJson, setSavedJson] = useState<string>(() => {
    const payload = {
      instances: hydrated?.instances ?? [createInitialInstance("1")],
      rotations: hydrated?.rotations ?? [{ id: "combo-1", name: "Combo 1", description: "Default rotation sequence", steps: [] }],
      activeRotationId: hydrated?.activeRotationId ?? "combo-1",
    };
    return JSON.stringify(payload);
  });

  // Load working draft and offline builds from localStorage on client mount ONLY
  useEffect(() => {
    setIsMounted(true);
    if (typeof window === "undefined") return;
    try {
      const storedDraft = localStorage.getItem(`gi_calc_working_draft_${config.id}`);
      if (storedDraft) {
        const draft = JSON.parse(storedDraft);
        if (Array.isArray(draft.instances) && draft.instances.length > 0) {
          setInstances(draft.instances);
        }
        if (draft.activeBuildId !== undefined) {
          setActiveBuildId(draft.activeBuildId);
        }
        if (draft.activeBuildName) {
          setActiveBuildName(draft.activeBuildName);
        }
        if (draft.savedJson) {
          setSavedJson(draft.savedJson);
        }
      }
      const storedOffline = localStorage.getItem(`gi_calc_offline_builds_${config.id}`);
      if (storedOffline) {
        const offlineList: SavedBuild[] = JSON.parse(storedOffline).map((b: SavedBuild) => ({ ...b, isOffline: true }));
        setSavedBuildsList(prev => {
          const serverIds = new Set(savedBuilds.map(b => b.id));
          return [...offlineList.filter(b => !serverIds.has(b.id)), ...savedBuilds];
        });
      }
    } catch (e) {
      console.error("Failed to load draft from localStorage after mount:", e);
    }
  }, [config.id]);

  // Auto-save working draft to localStorage on mutations after mount
  useEffect(() => {
    if (typeof window === "undefined" || !isMounted) return;
    try {
      const draft = {
        instances,
        rotations,
        activeRotationId,
        activeBuildId,
        activeBuildName,
        savedJson,
      };
      localStorage.setItem(`gi_calc_working_draft_${config.id}`, JSON.stringify(draft));
    } catch (e) {
      console.error("Failed to auto-save working draft:", e);
    }
  }, [config.id, instances, rotations, activeRotationId, activeBuildId, activeBuildName, savedJson, isMounted]);

  const [benchmarkId, setBenchmarkId] = useState<string | null>(null);
  const [nextId, setNextId] = useState(() => {
    const insts: CalcInstance[] = hydrated?.instances ?? instances;
    if (insts.length > 0) {
      const ids = insts.map(i => Number(i.id) || 0);
      return Math.max(...ids, 0) + 1;
    }
    return 2;
  });
  const [showExtraInfo, setShowExtraInfo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Screenshot OCR Scanner States
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannerTargetId, setScannerTargetId] = useState<string | null>(null);
  const [scanImage, setScanImage] = useState<string | null>(null);
  const [isScanningImage, setIsScanningImage] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<any | null>(null);

  const runScan = async (file: File, setupId: string) => {
    setIsScanningImage(true);
    setScanError(null);
    setScanResult(null);

    try {
      const base64Promise = new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });

      const base64Data = await base64Promise;

      const response = await fetch("/api/scan-stats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Data }),
      });

      if (!response.ok) {
        const errJson = await response.json();
        if (errJson.error === "API_KEY_MISSING") {
          throw new Error("GEMINI_API_KEY is not configured in your .env file.");
        } else {
          throw new Error(errJson.message || `API error: ${response.statusText}`);
        }
      }

      const res = await response.json();
      if (res.success && res.data) {
        setScanResult(res.data);
      } else {
        throw new Error(res.message || "Failed to scan screenshot.");
      }
    } catch (e: any) {
      console.error(e);
      setScanError(e.message || "An error occurred during screenshot scanning.");
    } finally {
      setIsScanningImage(false);
    }
  };

  const applyScanToSetup = (setupId: string, data: any) => {
    updateInstance(setupId, inst => {
      const updatedStats = { ...inst.stats };

      if (data.levelChar !== undefined && data.levelChar !== "") updatedStats["levelChar"] = data.levelChar;
      
      if (data.hpBase !== undefined && data.hpBase !== "") updatedStats["hp.base"] = data.hpBase;
      if (data.hpFlat !== undefined && data.hpFlat !== "") updatedStats["hp.flat"] = data.hpFlat;
      if (data.hpPercent !== undefined && data.hpPercent !== "") updatedStats["hp.percent"] = data.hpPercent;

      if (data.atkBase !== undefined && data.atkBase !== "") updatedStats["atk.base"] = data.atkBase;
      if (data.atkFlat !== undefined && data.atkFlat !== "") updatedStats["atk.flat"] = data.atkFlat;
      if (data.atkPercent !== undefined && data.atkPercent !== "") updatedStats["atk.percent"] = data.atkPercent;

      if (data.defBase !== undefined && data.defBase !== "") updatedStats["def.base"] = data.defBase;
      if (data.defFlat !== undefined && data.defFlat !== "") updatedStats["def.flat"] = data.defFlat;
      if (data.defPercent !== undefined && data.defPercent !== "") updatedStats["def.percent"] = data.defPercent;

      if (data.em !== undefined && data.em !== "") updatedStats["em"] = data.em;
      if (data.critRate !== undefined && data.critRate !== "") updatedStats["critRate"] = data.critRate;
      if (data.critDmg !== undefined && data.critDmg !== "") updatedStats["critDmg"] = data.critDmg;
      if (data.energyRecharge !== undefined && data.energyRecharge !== "") updatedStats["energyRecharge"] = data.energyRecharge;
      if (data.dmgBonus !== undefined && data.dmgBonus !== "") updatedStats["dmgBonus"] = data.dmgBonus;

      return {
        stats: updatedStats,
      };
    });

    setIsScannerOpen(false);
    setScanImage(null);
    setScanResult(null);
    setScanError(null);

    setSaveStatus("Stats updated from screenshot!");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleScanDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleScanDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScanImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      if (scannerTargetId) {
        runScan(file, scannerTargetId);
      }
    }
  };

  const handleScanFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScanImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      if (scannerTargetId) {
        runScan(file, scannerTargetId);
      }
    }
  };

  const currentPayload = () => JSON.stringify({ instances, rotations, activeRotationId });
  const isDirty = currentPayload() !== savedJson;

  const [isConfirmDiscardOpen, setIsConfirmDiscardOpen] = useState(false);
  const [pendingNavigationHref, setPendingNavigationHref] = useState("");

  // Close load dropdown when clicking outside
  useEffect(() => {
    if (!isLoadDropdownOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".load-dropdown-container")) {
        setIsLoadDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isLoadDropdownOpen]);

  // Warn before browser unload (reload/tab close)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Intercept client-side routing links click events on this page
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      if (!isDirty) return;

      let target = e.target as HTMLElement | null;
      while (target && target.tagName !== "A") {
        target = target.parentElement;
      }

      if (target instanceof HTMLAnchorElement) {
        const href = target.getAttribute("href");
        const targetAttr = target.getAttribute("target");
        if (targetAttr === "_blank") return;

        if (href && !href.startsWith("#") && !href.startsWith("javascript:") && !e.defaultPrevented) {
          e.preventDefault();
          e.stopPropagation();
          setPendingNavigationHref(href);
          setIsConfirmDiscardOpen(true);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, true);
    return () => document.removeEventListener("click", handleAnchorClick, true);
  }, [isDirty]);

  // Intercept global paste events to scan screenshots directly
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }
      
      const items = e.clipboardData?.items;
      if (!items) return;
      
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            const targetId = instances[0]?.id;
            if (targetId) {
              setScannerTargetId(targetId);
              setIsScannerOpen(true);
              
              const reader = new FileReader();
              reader.onloadend = () => {
                setScanImage(reader.result as string);
              };
              reader.readAsDataURL(file);
              runScan(file, targetId);
            }
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handleGlobalPaste);
    return () => window.removeEventListener("paste", handleGlobalPaste);
  }, [instances]);

  const saveBuildLocally = (id: string | null, name: string, payload: unknown) => {
    const storedKey = `gi_calc_offline_builds_${config.id}`;
    let offlineList: SavedBuild[] = [];
    try {
      const stored = localStorage.getItem(storedKey);
      if (stored) offlineList = JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }

    let targetId = id;
    let updatedList = [...offlineList];

    if (id && id.startsWith("offline-")) {
      updatedList = offlineList.map(b => b.id === id ? { ...b, name, data: payload, updatedAt: new Date() } : b);
    } else {
      targetId = `offline-${Date.now()}`;
      const newOfflineBuild = {
        id: targetId,
        name,
        characterId: config.id,
        data: payload,
        updatedAt: new Date(),
        isOffline: true,
      };
      updatedList = [newOfflineBuild, ...updatedList];
    }

    localStorage.setItem(storedKey, JSON.stringify(updatedList));

    setSavedBuildsList(prev => {
      const dbBuilds = prev.filter(b => !b.id.startsWith("offline-"));
      return [...updatedList.map(b => ({ ...b, isOffline: true })), ...dbBuilds];
    });

    setActiveBuildId(targetId);
    setActiveBuildName(name);
    setSavedJson(JSON.stringify(payload));
    setSaveStatus("Saved locally!");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const saveChanges = async () => {
    if (!activeBuildId) {
      setNewBuildName(`${config.name} Setup ${savedBuildsList.length + 1}`);
      setIsSaveModalOpen(true);
      return;
    }

    setIsSaving(true);
    setSaveStatus("Saving...");
    const payload = { instances, rotations, activeRotationId };

    try {
      if (activeBuildId.startsWith("offline-")) {
        saveBuildLocally(activeBuildId, activeBuildName, payload);
      } else {
        await saveBuild(activeBuildId, activeBuildName, config.id, payload);
        setSavedJson(JSON.stringify(payload));
        setSavedBuildsList(prev => prev.map(b => b.id === activeBuildId ? { ...b, name: activeBuildName, data: payload } : b));
        setSaveStatus("Saved to Cloud!");
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch (e) {
      console.warn("Database connection failed, saving build locally:", e);
      saveBuildLocally(activeBuildId, activeBuildName, payload);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAsNew = async (name: string) => {
    if (!name.trim()) return;
    setIsSaving(true);
    setSaveStatus("Saving new...");
    const payload = { instances, rotations, activeRotationId };

    try {
      const created = await saveBuild(null, name.trim(), config.id, payload);
      setSavedJson(JSON.stringify(payload));
      setActiveBuildId(created.id);
      setActiveBuildName(created.name);
      setSavedBuildsList(prev => [created, ...prev]);
      setIsSaveModalOpen(false);
      setSaveStatus("Saved to Cloud!");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (e) {
      console.warn("Database connection failed, saving new build locally:", e);
      saveBuildLocally(null, name.trim(), payload);
      setIsSaveModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const loadBuild = (b: SavedBuild) => {
    try {
      const hydratedData = hydrateFromBuild(b.data, createInitialInstance);
      setInstances(hydratedData.instances);
      setRotations(hydratedData.rotations);
      setActiveRotationId(hydratedData.activeRotationId);

      setActiveBuildId(b.id);
      setActiveBuildName(b.name);
      setSavedJson(JSON.stringify(b.data));
      setIsLoadDropdownOpen(false);
      setSaveStatus("Loaded configuration!");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to load build data.");
    }
  };

  const handleDeleteBuild = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this saved build?")) return;

    if (id.startsWith("offline-")) {
      const storedKey = `gi_calc_offline_builds_${config.id}`;
      let offlineList: SavedBuild[] = [];
      try {
        const stored = localStorage.getItem(storedKey);
        if (stored) offlineList = JSON.parse(stored);
      } catch (err) {
        console.error(err);
      }

      const updated = offlineList.filter(b => b.id !== id);
      localStorage.setItem(storedKey, JSON.stringify(updated));
      setSavedBuildsList(prev => prev.filter(b => b.id !== id));

      if (activeBuildId === id) {
        setActiveBuildId(null);
        setActiveBuildName("Scratchpad");
      }
      setSaveStatus("Deleted local build!");
      setTimeout(() => setSaveStatus(null), 3000);
      return;
    }

    try {
      await deleteBuild(id);
      setSavedBuildsList(prev => prev.filter(b => b.id !== id));
      if (activeBuildId === id) {
        setActiveBuildId(null);
        setActiveBuildName("Scratchpad");
      }
      setSaveStatus("Deleted build!");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error("Database connection failed, removing database build from UI list:", err);
      setSavedBuildsList(prev => prev.filter(b => b.id !== id));
      if (activeBuildId === id) {
        setActiveBuildId(null);
        setActiveBuildName("Scratchpad");
      }
      setSaveStatus("Deleted build locally!");
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleSaveAndSwitch = async () => {
    let name = activeBuildName;
    if (!activeBuildId) {
      const promptVal = prompt("Enter a name for this new build configuration:", `${config.name} Setup`);
      if (promptVal === null) return;
      if (!promptVal.trim()) {
        alert("Build name is required to save.");
        return;
      }
      name = promptVal.trim();
    }

    setIsSaving(true);
    setSaveStatus("Saving...");
    const payload = { instances, rotations, activeRotationId };

    try {
      if (activeBuildId && activeBuildId.startsWith("offline-")) {
        saveBuildLocally(activeBuildId, name, payload);
      } else {
        await saveBuild(activeBuildId, name, config.id, payload);
      }
      setSavedJson(JSON.stringify(payload));
    } catch (e) {
      console.warn("Database connection failed, saving build locally before switch:", e);
      saveBuildLocally(activeBuildId, name, payload);
    } finally {
      setIsSaving(false);
      setIsConfirmDiscardOpen(false);
      router.push(pendingNavigationHref);
    }
  };

  const shareBuild = () => {
    const payload = { instances, rotations, activeRotationId };
    const encoded = encodeBuild(payload);
    if (!encoded) return;
    const shareUrl = `${window.location.origin}${window.location.pathname}?share=${encoded}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setSaveStatus("Copied share link!");
      setTimeout(() => setSaveStatus(null), 3000);
    }).catch((err) => {
      console.error(err);
      setSaveStatus("Failed to copy link");
      setTimeout(() => setSaveStatus(null), 3000);
    });
  };

  const [showSharedBanner, setShowSharedBanner] = useState(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);

  useEffect(() => {
    if (!isExportDropdownOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".export-dropdown-container")) {
        setIsExportDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isExportDropdownOpen]);

  const importBuild = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        const hydratedData = hydrateFromBuild(data, createInitialInstance);
        setInstances(hydratedData.instances);
        setRotations(hydratedData.rotations);
        setActiveRotationId(hydratedData.activeRotationId);
        setSaveStatus("Imported build!");
        setTimeout(() => setSaveStatus(null), 3000);
      } catch (err) {
        console.error(err);
        alert("Failed to parse JSON file. Please make sure it's a valid calculator build export.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const addInstance = () => {
    if (instances.length >= 3) return;
    const last = instances[instances.length - 1];
    const newInst: CalcInstance = {
      id: String(nextId),
      stats: { ...last.stats },
      hits: { ...last.hits },
      levels: { ...last.levels },
      mechanicInputs: { ...last.mechanicInputs },
      reaction: last.reaction,
      reactionBonus: last.reactionBonus,
      reactionPanelBonus: last.reactionPanelBonus,
      lunarBaseBonus: last.lunarBaseBonus,
      constellationLevel: last.constellationLevel,
    };
    setInstances(s => [...s, newInst]);
    setNextId(n => n + 1);
  };

  const removeInstance = (id: string) => {
    if (instances.length <= 1) return;
    setInstances(s => s.filter(inst => inst.id !== id));
    if (benchmarkId === id) {
      setBenchmarkId(null);
    }
  };

  const updateInstance = (id: string, updater: (inst: CalcInstance) => Partial<CalcInstance>) => {
    setInstances(prev =>
      prev.map(inst => {
        if (inst.id !== id) return inst;
        return {
          ...inst,
          ...updater(inst),
        };
      })
    );
  };

  const setMechanic = (instId: string, mechId: string, v: string) => {
    updateInstance(instId, inst => {
      let nextInputs = { ...inst.mechanicInputs, [mechId]: v };
      if (config.id === "varka") {
        const isPyro = (nextInputs["party-has-pyro"] ?? "1") === "1";
        const isHydro = (nextInputs["party-has-hydro"] ?? "0") === "1";
        const isElectro = (nextInputs["party-has-electro"] ?? "0") === "1";
        const isCryo = (nextInputs["party-has-cryo"] ?? "0") === "1";
        const numChecked = (isPyro ? 1 : 0) + (isHydro ? 1 : 0) + (isElectro ? 1 : 0) + (isCryo ? 1 : 0);

        if (numChecked >= 2) {
          nextInputs["a1-resonance-tier2"] = "0";
        }
        if (numChecked >= 3) {
          nextInputs["a1-resonance-tier1"] = "0";
        }

        if (mechId === "a1-resonance-tier1" && v === "1") {
          nextInputs["a1-resonance-tier2"] = "0";
        } else if (mechId === "a1-resonance-tier2" && v === "1") {
          nextInputs["a1-resonance-tier1"] = "0";
        }
      }
      return { mechanicInputs: nextInputs };
    });
  };

  const setStat = (instId: string, statId: string, v: string) => {
    updateInstance(instId, inst => ({
      stats: { ...inst.stats, [statId]: v },
    }));
  };

  const setHit = (instId: string, hitId: string, v: string) => {
    updateInstance(instId, inst => ({
      hits: { ...inst.hits, [hitId]: v },
    }));
  };

  const setLevel = (instId: string, type: string, v: string) => {
    updateInstance(instId, inst => ({
      levels: { ...inst.levels, [type]: v },
    }));
  };

  const setReaction = (instId: string, r: ReactionType) => {
    updateInstance(instId, () => ({
      reaction: r,
    }));
  };

  const setReactionBonus = (instId: string, v: string) => {
    updateInstance(instId, () => ({
      reactionBonus: v,
    }));
  };

  return {
    createInitialInstance,
    instances,
    setInstances,
    activeBuildId,
    setActiveBuildId,
    activeBuildName,
    setActiveBuildName,
    savedBuildsList,
    setSavedBuildsList,
    isSaveModalOpen,
    setIsSaveModalOpen,
    newBuildName,
    setNewBuildName,
    isLoadDropdownOpen,
    setIsLoadDropdownOpen,
    savedJson,
    setSavedJson,
    benchmarkId,
    setBenchmarkId,
    nextId,
    setNextId,
    showExtraInfo,
    setShowExtraInfo,
    isSaving,
    saveStatus,
    setSaveStatus,
    isScannerOpen,
    setIsScannerOpen,
    scannerTargetId,
    setScannerTargetId,
    scanImage,
    setScanImage,
    isScanningImage,
    setIsScanningImage,
    scanError,
    setScanError,
    scanResult,
    setScanResult,
    isConfirmDiscardOpen,
    setIsConfirmDiscardOpen,
    pendingNavigationHref,
    setPendingNavigationHref,
    showSharedBanner,
    setShowSharedBanner,
    isExportDropdownOpen,
    setIsExportDropdownOpen,
    isDirty,
    
    // Scan handlers
    runScan,
    applyScanToSetup,
    handleScanDragOver,
    handleScanDrop,
    handleScanFileInputChange,

    // Persistence handlers
    saveBuildLocally,
    saveChanges,
    handleSaveAsNew,
    loadBuild,
    handleDeleteBuild,
    handleSaveAndSwitch,
    shareBuild,
    importBuild,

    // Modifiers
    addInstance,
    removeInstance,
    updateInstance,
    setMechanic,
    setStat,
    setHit,
    setLevel,
    setReaction,
    setReactionBonus,
  };
}
