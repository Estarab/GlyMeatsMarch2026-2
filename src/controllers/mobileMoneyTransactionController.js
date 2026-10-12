import MobileMoneyTransaction from "../models/MobileMoneyTransaction.js";

const roundMoney = (value) =>
  Math.round((Number(value) + Number.EPSILON) * 100) / 100;

const isNonNegativeMoney = (value) =>
  value !== undefined &&
  value !== null &&
  value !== "" &&
  Number.isFinite(Number(value)) &&
  Number(value) >= 0;

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parseDateBound = (value, endOfDay = false) => {
  if (!value) return null;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) return null;
    date.setHours(endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0, endOfDay ? 999 : 0);
    return date;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0, endOfDay ? 999 : 0);
  return date;
};

export const createMobileMoneyTransaction = async (req, res) => {
  try {
    const {
      transactionId,
      transactionIdLast6,
      provider,
      payerName,
      payerPhone,
      productsPurchased,
      productAmount,
      parcelAmount,
      withdrawCharge,
      totalAmount,
      receivedAt,
    } = req.body || {};

    if (typeof transactionId !== "string" || !transactionId.trim()) {
      return res.status(400).json({ success: false, message: "Internal transaction ID is required." });
    }

    const last6 = String(transactionIdLast6 || "").trim();
    if (!/^\d{6}$/.test(last6)) {
      return res.status(400).json({ success: false, message: "Enter exactly the last 6 digits of the mobile money transaction ID." });
    }

    const allowedProviders = ["AIRTEL_MONEY", "MTN_MOMO", "ZAMTEL_KWACHA", "OTHER"];
    if (!allowedProviders.includes(provider)) {
      return res.status(400).json({ success: false, message: "Select a valid mobile money provider." });
    }

    if (
      typeof payerName !== "string" || !payerName.trim() ||
      typeof payerPhone !== "string" || !payerPhone.trim() ||
      typeof productsPurchased !== "string" || !productsPurchased.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Payer full name, phone number, and products purchased are required.",
      });
    }

    if (
      !isNonNegativeMoney(productAmount) ||
      !isNonNegativeMoney(parcelAmount) ||
      !isNonNegativeMoney(totalAmount)
    ) {
      return res.status(400).json({
        success: false,
        message: "Product, parcel, and total amounts must be valid non-negative numbers.",
      });
    }

    const product = roundMoney(productAmount);
    const parcel = roundMoney(parcelAmount);
    const withdraw = roundMoney(withdrawCharge);
    const total = roundMoney(totalAmount);
    if (total <= 0) {
      return res.status(400).json({ success: false, message: "The total amount received must be greater than zero." });
    }
    if (roundMoney(product + parcel) !== total) {
      return res.status(400).json({
        success: false,
        message: "Total amount received must equal product amount + parcel amount.",
      });
    }

    let parsedReceivedAt = new Date();
    if (receivedAt !== undefined && receivedAt !== null && receivedAt !== "") {
      parsedReceivedAt = new Date(receivedAt);
      if (Number.isNaN(parsedReceivedAt.getTime())) {
        return res.status(400).json({ success: false, message: "Invalid receivedAt date." });
      }
    }

    const existing = await MobileMoneyTransaction.findOne({
      transactionId: transactionId.trim(),
    });
    if (existing) {
      return res.status(200).json({
        success: true,
        duplicate: true,
        message: "This transaction was already recorded.",
        data: existing,
      });
    }

    const record = await MobileMoneyTransaction.create({
      transactionId: transactionId.trim(),
      transactionIdLast6: last6,
      provider,
      payerName: payerName.trim(),
      payerPhone: payerPhone.trim(),
      productsPurchased: productsPurchased.trim(),
      productAmount: product,
      parcelAmount: parcel,
      withdrawCharge: withdraw,
      totalAmount: total,
      receivedAt: parsedReceivedAt,
    });

    return res.status(201).json({
      success: true,
      message: "Mobile money transaction recorded.",
      data: record,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(200).json({
        success: true,
        duplicate: true,
        message: "This transaction was already recorded.",
      });
    }
    console.error("createMobileMoneyTransaction:", error);
    return res.status(500).json({ success: false, message: "Could not record mobile money transaction." });
  }
};

export const getMobileMoneyTransactions = async (req, res) => {
  try {
    const { from, to, provider, status, search } = req.query;
    const query = {};

    if (provider && provider !== "ALL") query.provider = provider;
    if (status && status !== "ALL") query.status = status;

    if (from || to) {
      query.receivedAt = {};
      if (from) {
        const fromDate = parseDateBound(from, false);
        if (!fromDate) return res.status(400).json({ success: false, message: "Invalid from date. Use YYYY-MM-DD." });
        query.receivedAt.$gte = fromDate;
      }
      if (to) {
        const toDate = parseDateBound(to, true);
        if (!toDate) return res.status(400).json({ success: false, message: "Invalid to date. Use YYYY-MM-DD." });
        query.receivedAt.$lte = toDate;
      }
      if (query.receivedAt.$gte && query.receivedAt.$lte && query.receivedAt.$gte > query.receivedAt.$lte) {
        return res.status(400).json({ success: false, message: "'from' date must not be after 'to' date." });
      }
    }

    if (search && String(search).trim()) {
      const regex = new RegExp(escapeRegex(String(search).trim()), "i");
      query.$or = [
        { transactionIdLast6: regex },
        { payerName: regex },
        { payerPhone: regex },
        { productsPurchased: regex },
      ];
    }

    const records = await MobileMoneyTransaction.find(query)
      .sort({ receivedAt: -1, _id: -1 })
      .limit(5000)
      .lean();

    const summary = records.reduce((acc, record) => {
      if (record.status === "RECEIVED") {
        acc.productAmount = roundMoney(acc.productAmount + Number(record.productAmount || 0));
        acc.parcelAmount = roundMoney(acc.parcelAmount + Number(record.parcelAmount || 0));
        acc.withdrawCharge = roundMoney(acc.withdrawCharge, + Number(record.withdrawCharge || 0));
        acc.totalAmount = roundMoney(acc.totalAmount + Number(record.totalAmount || 0));
        acc.transactionCount += 1;
      }
      return acc;
    }, { productAmount: 0, parcelAmount: 0, withdrawCharge: 0 , totalAmount: 0, transactionCount: 0 });

    return res.json({ success: true, count: records.length, summary, data: records });
  } catch (error) {
    console.error("getMobileMoneyTransactions:", error);
    return res.status(500).json({ success: false, message: "Could not load mobile money transactions." });
  }
};

export const getMobileMoneyTransactionById = async (req, res) => {
  try {
    const record = await MobileMoneyTransaction.findById(req.params.id).lean();
    if (!record) return res.status(404).json({ success: false, message: "Transaction not found." });
    return res.json({ success: true, data: record });
  } catch (error) {
    console.error("getMobileMoneyTransactionById:", error);
    return res.status(500).json({ success: false, message: "Could not load transaction." });
  }
};

export const reverseMobileMoneyTransaction = async (req, res) => {
  try {
    const record = await MobileMoneyTransaction.findByIdAndUpdate(
      req.params.id,
      { status: "REVERSED" },
      { new: true, runValidators: true }
    );
    if (!record) return res.status(404).json({ success: false, message: "Transaction not found." });
    return res.json({ success: true, message: "Transaction marked as reversed.", data: record });
  } catch (error) {
    console.error("reverseMobileMoneyTransaction:", error);
    return res.status(500).json({ success: false, message: "Could not reverse transaction." });
  }
};
