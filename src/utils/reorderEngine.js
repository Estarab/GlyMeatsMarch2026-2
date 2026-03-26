exports.getReorderSuggestions = (materials) => {
  return materials
    .filter((m) => m.quantity <= m.minimumLevel)
    .map((m) => ({
      material: m.name,
      current: m.quantity,
      minimum: m.minimumLevel,
      suggestedOrder: m.minimumLevel * 2,
    }));
};