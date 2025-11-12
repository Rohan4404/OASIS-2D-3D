// src/hooks/useFloorConfig.js
import { useEffect, useState } from "react";
import { convertAIConfig } from "../utils/convertAIConfig";

export default function useFloorConfig(pollInterval = 3000) {
  const [config, setConfig] = useState(null);

  const load = async () => {
    try {
      const [baseRes, analysisRes] = await Promise.all([
        fetch("/data/config_AIR-2025-042.json?_=" + Date.now()),
        fetch("/data/Integrated_analysis_AIR.json?_=" + Date.now()),
      ]);
      if (!baseRes.ok || !analysisRes.ok)
        throw new Error("Failed to load AI data");

      const baseJson = await baseRes.json();
      const analysisJson = await analysisRes.json();

      const converted = convertAIConfig(baseJson, analysisJson);
      setConfig(converted);
    } catch (err) {
      console.error("useFloorConfig load error:", err);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, pollInterval);
    return () => clearInterval(id);
  }, []);

  return config;
}
