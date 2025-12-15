import { useEffect, useMemo, useState } from 'react';
import type { FrameMaterial } from '../api/types';
import { useFrameMaterials } from './useFrameMaterials';

export type MaterialOption = {
  id: string;
  label: string;
  pricePerCm: number;
};

const buildMaterialOptions = (materials: FrameMaterial[]): MaterialOption[] =>
  materials.map((item) => ({
    id: item.id,
    label: item.title,
    pricePerCm: item.pricePerCm,
  }));

export const useMaterialOptions = () => {
  const { materials, isLoading } = useFrameMaterials();
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialOption | null>(null);

  const materialOptions = useMemo(
    () => buildMaterialOptions(materials),
    [materials],
  );

  useEffect(() => {
    if (selectedMaterial && !materialOptions.some((option) => option.id === selectedMaterial.id)) {
      setSelectedMaterial(null);
    }
  }, [materialOptions, selectedMaterial]);

  return {
    materialOptions,
    selectedMaterial,
    setSelectedMaterial,
    isLoading,
  };
};
