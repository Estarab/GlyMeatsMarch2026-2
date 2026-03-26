exports.calculateRequiredMaterials = (recipe, quantity) => {
  return recipe.materials.map((item) => ({
    material: item.material,
    required: item.quantityPerUnit * quantity,
  }));
};

exports.checkStockAvailability = (materials, inventory) => {
  const shortages = [];

  materials.forEach((req) => {
    const stock = inventory.find(
      (i) => i._id.toString() === req.material.toString()
    );

    if (!stock || stock.quantity < req.required) {
      shortages.push({
        material: stock?.name || "Unknown",
        required: req.required,
        available: stock?.quantity || 0,
      });
    }
  });

  return shortages;
};