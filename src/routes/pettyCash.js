// =============================
// PETTY CASH ROUTES FIXED
// =============================

router.post("/float", async (req, res) => {
  try {
    // Parse amount as float
    const amount = parseFloat(req.body.amount);
    console.log("Parsed amount:", amount);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    let float = await PettyCashFloat.findOne();

    if (!float) {
      float = new PettyCashFloat({
        issuedAmount: amount,
        remainingBalance: amount,
      });
    } else {
      float.issuedAmount += amount;
      float.remainingBalance += amount;
    }

    await float.save();
    res.status(200).json(float);
  } catch (error) {
    console.log("Error issuing float:", error);
    res.status(500).json({ message: "Failed to issue float" });
  }
});

router.post("/expense", async (req, res) => {
  try {
    // Parse amount as float
    const amount = parseFloat(req.body.amount);
    const { reason } = req.body;

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid expense amount" });
    }

    const expense = new PettyCashExpense({
      amount,
      reason,
      approved: false,
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    console.log("Error creating expense:", error);
    res.status(500).json({ message: "Failed to create expense" });
  }
});