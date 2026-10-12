
import MobileMoneyTransaction from "../models/MobileMoneyTransaction.js";

const roundMoney = (value) =>
  Math.round((Number(value) + Number.EPSILON) * 100) / 100;

const isNonNegativeMoney = (value) =>
  value !== undefined &&
  value !== null &&
  value !== "" &&
  Number.isFinite(Number(value)) &&
  Number(value) >= 0;

export const createMobileMoneyTransaction = async (req, res) => {
  try {
    const {
      transactionId,
      transactionReference = "",
      provider,
      payerName = "",
      payerPhone = "",
      productAmount,
      parcelAmount,
      totalAmount,
      saleTransactionId = "",
      parcelNumber = "",
      notes = "",
      recordedBy = "",
      receivedAt,
    } = req.body || {};

    if (!transactionId || typeof transactionId !== "string") {
      return res.status(400).json({
        success: false,
        message: "transactionId is required.",
      });
    }

    const normalizedTransactionId = transactionId.trim();

    if (!normalizedTransactionId) {
      return res.status(400).json({
        success: false,
        message: "transactionId is required.",
      });
    }

    const allowedProviders = [
      "AIRTEL_MONEY",
      "MTN_MOMO",
      "ZAMTEL_KWACHA",
      "OTHER",
    ];

    if (!allowedProviders.includes(provider)) {
      return res.status(400).json({
        success: false,
        message: "Select a valid mobile money provider.",
      });
    }

    if (
      !isNonNegativeMoney(productAmount) ||
      !isNonNegativeMoney(parcelAmount)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Product and parcel amounts must be valid non-negative numbers.",
      });
    }

    const product = roundMoney(productAmount);
    const parcel = roundMoney(parcelAmount);
    const calculatedTotal = roundMoney(product + parcel);

    // The server calculates the total to prevent inconsistent client values.
    if (
      totalAmount !== undefined &&
      totalAmount !== null &&
      (!isNonNegativeMoney(totalAmount) ||
        roundMoney(totalAmount) !== calculatedTotal)
    ) {
      return res.status(400).json({
        success: false,
        message: "totalAmount must equal productAmount + parcelAmount.",
      });
    }

    if (product === 0 && parcel === 0) {
      return res.status(400).json({
        success: false,
        message: "The transaction total must be greater than zero.",
      });
    }

    const existing = await MobileMoneyTransaction.findOne({
      transactionId: normalizedTransactionId,
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        duplicate: true,
        message: "This transaction was already recorded.",
        data: existing,
      });
    }

    const normalizedReference = String(
      transactionReference || ""
    ).trim();

    // Prevent duplicate provider references when supplied.
    if (normalizedReference) {
      const duplicateReference =
        await MobileMoneyTransaction.findOne({
          provider,
          transactionReference: normalizedReference,
          status: "RECEIVED",
        });

      if (duplicateReference) {
        return res.status(409).json({
          success: false,
          message:
            "That provider transaction reference has already been recorded.",
          data: duplicateReference,
        });
      }
    }

    // Validate the optional date before saving.
    let parsedReceivedAt = new Date();

    if (receivedAt !== undefined && receivedAt !== null && receivedAt !== "") {
      parsedReceivedAt = new Date(receivedAt);

      if (Number.isNaN(parsedReceivedAt.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid receivedAt date.",
        });
      }
    }

    const record = await MobileMoneyTransaction.create({
      transactionId: normalizedTransactionId,
      transactionReference: normalizedReference,
      provider,
      payerName,
      payerPhone,
      productAmount: product,
      parcelAmount: parcel,
      totalAmount: calculatedTotal,
      saleTransactionId,
      parcelNumber,
      notes,
      recordedBy,
      receivedAt: parsedReceivedAt,
    });

    return res.status(201).json({
      success: true,
      message: "Mobile money transaction recorded.",
      data: record,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(200).json({
        success: true,
        duplicate: true,
        message: "This transaction was already recorded.",
      });
    }

    console.error("createMobileMoneyTransaction:", error);

    return res.status(500).json({
      success: false,
      message: "Could not record mobile money transaction.",
    });
  }
};

export const getMobileMoneyTransactions = async (req, res) => {
  try {
    const { from, to, provider, status, search } = req.query;
    const query = {};

    if (provider && provider !== "ALL") {
      query.provider = provider;
    }

    if (status && status !== "ALL") {
      query.status = status;
    }

    if (from || to) {
      query.receivedAt = {};

      if (from) {
        const fromDate = new Date(from);

        if (Number.isNaN(fromDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid from date.",
          });
        }

        fromDate.setHours(0, 0, 0, 0);
        query.receivedAt.$gte = fromDate;
      }

      if (to) {
        const toDate = new Date(to);

        if (Number.isNaN(toDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid to date.",
          });
        }

        toDate.setHours(23, 59, 59, 999);
        query.receivedAt.$lte = toDate;
      }
    }

    if (search && search.trim()) {
      // Escape regex metacharacters so searches are treated as literal text.
      const safeSearch = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      query.$or = [
        {
          transactionReference: {
            $regex: safeSearch,
            $options: "i",
          },
        },
        {
          payerName: {
            $regex: safeSearch,
            $options: "i",
          },
        },
        {
          payerPhone: {
            $regex: safeSearch,
            $options: "i",
          },
        },
        {
          parcelNumber: {
            $regex: safeSearch,
            $options: "i",
          },
        },
        {
          saleTransactionId: {
            $regex: safeSearch,
            $options: "i",
          },
        },
      ];
    }

    const records = await MobileMoneyTransaction.find(query)
      .sort({ receivedAt: -1 })
      .limit(1000)
      .lean();

    const summary = records.reduce(
      (acc, record) => {
        if (record.status === "RECEIVED") {
          acc.productAmount = roundMoney(
            acc.productAmount + record.productAmount
          );

          acc.parcelAmount = roundMoney(
            acc.parcelAmount + record.parcelAmount
          );

          acc.totalAmount = roundMoney(
            acc.totalAmount + record.totalAmount
          );

          acc.transactionCount += 1;
        }

        return acc;
      },
      {
        productAmount: 0,
        parcelAmount: 0,
        totalAmount: 0,
        transactionCount: 0,
      }
    );

    return res.json({
      success: true,
      count: records.length,
      summary,
      data: records,
    });
  } catch (error) {
    console.error("getMobileMoneyTransactions:", error);

    return res.status(500).json({
      success: false,
      message: "Could not load mobile money transactions.",
    });
  }
};

export const getMobileMoneyTransactionById = async (req, res) => {
  try {
    const record = await MobileMoneyTransaction.findById(
      req.params.id
    ).lean();

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found.",
      });
    }

    return res.json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error("getMobileMoneyTransactionById:", error);

    return res.status(500).json({
      success: false,
      message: "Could not load transaction.",
    });
  }
};

// Keep an audit trail: reverse a record instead of deleting it.
export const reverseMobileMoneyTransaction = async (req, res) => {
  try {
    const record = await MobileMoneyTransaction.findByIdAndUpdate(
      req.params.id,
      { status: "REVERSED" },
      { new: true, runValidators: true }
    );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found.",
      });
    }

    return res.json({
      success: true,
      message: "Transaction marked as reversed.",
      data: record,
    });
  } catch (error) {
    console.error("reverseMobileMoneyTransaction:", error);

    return res.status(500).json({
      success: false,
      message: "Could not reverse transaction.",
    });
  }
};

