import { useEffect, useState } from "react";
import { MATERIALS_STORE } from "../DB";
import type { MaterialItem } from "../DB/types";

export const useFrameMaterials = () => {
  const [materials, setMaterials] = useState<Array<MaterialItem>>([]);

  const loadData = async () => {
    const data = await MATERIALS_STORE.loadMaterialsData();
    setMaterials(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return [materials] as const;
};
