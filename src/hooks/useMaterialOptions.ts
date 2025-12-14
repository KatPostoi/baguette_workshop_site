import { useEffect, useState } from "react";
import type { MaterialItem } from "../DB/types";
import { useFrameMaterials } from "./useFrameMaterials";

export type MaterialOption = {
  id: string;
  label: string;
  pricePerCm: number;
};

const buildMaterialOptions = (materials: Array<MaterialItem>): Array<MaterialOption> =>
  materials.map((item) => ({
    id: item.id,
    label: item.material,
    pricePerCm: item.pricePerCm,
  }));

export const useMaterialOptions = () => {
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialOption | null>(null);
  const [materials] = useFrameMaterials();
  const [materialOptions, setMaterialOptions] = useState<Array<MaterialOption>>([]);

  useEffect(() => {
    setMaterialOptions(buildMaterialOptions(materials));
  }, [materials]);

  return {
    materialOptions,
    selectedMaterial,
    setSelectedMaterial,
  };
};
