import { useState } from "react";
import type { SavedRotation } from "../types";

export interface RotationState {
  rotations: SavedRotation[];
  setRotations: React.Dispatch<React.SetStateAction<SavedRotation[]>>;
  activeRotationId: string;
  setActiveRotationId: React.Dispatch<React.SetStateAction<string>>;
  draggedIndex: number | null;
  setDraggedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  rotationNextId: number;
  setRotationNextId: React.Dispatch<React.SetStateAction<number>>;
  addRotation: () => void;
  deleteRotation: (idToDelete: string) => void;
  updateActiveRotation: (updater: (rot: SavedRotation) => Partial<SavedRotation>) => void;
  moveStep: (index: number, direction: "up" | "down") => void;
}

export function useRotation(hydrated: { rotations: SavedRotation[]; activeRotationId: string } | null): RotationState {
  const [rotations, setRotations] = useState<SavedRotation[]>(
    () => hydrated?.rotations ?? [{ id: "combo-1", name: "Combo 1", description: "Default rotation sequence", steps: [] }]
  );
  const [activeRotationId, setActiveRotationId] = useState<string>(
    () => hydrated?.activeRotationId ?? (hydrated?.rotations?.[0]?.id ?? "combo-1")
  );
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [rotationNextId, setRotationNextId] = useState(() => {
    const allSteps = (hydrated?.rotations ?? []).flatMap(r => r.steps);
    if (allSteps.length > 0) {
      const ids = allSteps.map(s => Number(s.id) || 0);
      return Math.max(...ids, 0) + 1;
    }
    return 1;
  });

  const addRotation = () => {
    const newId = `rot-${Date.now()}`;
    const newRot: SavedRotation = {
      id: newId,
      name: `Combo ${rotations.length + 1}`,
      description: "Custom rotation sequence",
      steps: [],
    };
    setRotations(prev => [...prev, newRot]);
    setActiveRotationId(newId);
  };

  const deleteRotation = (idToDelete: string) => {
    if (rotations.length <= 1) return;
    const index = rotations.findIndex(r => r.id === idToDelete);
    const newRotations = rotations.filter(r => r.id !== idToDelete);
    setRotations(newRotations);
    if (activeRotationId === idToDelete) {
      const nextActiveIndex = index === 0 ? 0 : index - 1;
      setActiveRotationId(newRotations[nextActiveIndex].id);
    }
  };

  const updateActiveRotation = (updater: (rot: SavedRotation) => Partial<SavedRotation>) => {
    setRotations(prev => prev.map(r => r.id === activeRotationId ? { ...r, ...updater(r) } : r));
  };

  const moveStep = (index: number, direction: "up" | "down") => {
    const activeRot = rotations.find(r => r.id === activeRotationId) || rotations[0];
    if (!activeRot) return;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= activeRot.steps.length) return;

    const newSteps = [...activeRot.steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[newIndex];
    newSteps[newIndex] = temp;

    updateActiveRotation(() => ({ steps: newSteps }));
  };

  return {
    rotations,
    setRotations,
    activeRotationId,
    setActiveRotationId,
    draggedIndex,
    setDraggedIndex,
    rotationNextId,
    setRotationNextId,
    addRotation,
    deleteRotation,
    updateActiveRotation,
    moveStep,
  };
}
