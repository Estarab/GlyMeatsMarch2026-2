import SalesReport from "../models/SalesReport.js";
import { Product } from "../models/Product.js";

export const getBusinessInsights = async (req, res) => {
  try {
    const { filter, from, to } = req.query;

    const now = new Date();
    let startDate = null;

    switch (filter) {
      case "TODAY":
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        break;

      case "YESTERDAY":
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);

        const yesterdayEnd = new Date(startDate);
        yesterdayEnd.setHours(23, 59, 59, 999);
        break;

      case "WEEK":
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;

      case "MONTH":
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        break;

      case "YEAR":
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;

      case "RANGE":
        startDate = from ? new Date(from) : null;
        break;

      default:
        startDate = null;
    }

    let query = {};

    if (filter === "RANGE" && from && to) {
      query.createdAt = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    } else if (startDate) {
      query.createdAt = {
        $gte: startDate,
        $lte: now,
      };
    }

    const sales = await SalesReport.find(query);
    const products = await Product.find();

    let revenue = 0;
    let profit = 0;
    let discounts = 0;
    let totalItemsSold = 0;

    const productMap = {};
    const categoryMap = {};
    const paymentMethods = {};

    sales.forEach((sale) => {
      revenue += sale.total || 0;
      discounts += sale.discount || 0;

      paymentMethods[sale.paymentMethod] =
        (paymentMethods[sale.paymentMethod] || 0) + sale.total;

      sale.items.forEach((item) => {
        const qty = item.qty || item.quantity || 0;

        totalItemsSold += qty;

        const dbProduct = products.find((p) => p.name === item.name);

        const buyingPrice = dbProduct?.buyingPrice || 0;
        const sellPrice = item.price || dbProduct?.price || 0;

        const itemProfit = (sellPrice - buyingPrice) * qty;

        profit += itemProfit;

        if (!productMap[item.name]) {
          productMap[item.name] = {
            name: item.name,
            qtySold: 0,
            revenue: 0,
            profit: 0,
            category: dbProduct?.category || "Unknown",
          };
        }

        productMap[item.name].qtySold += qty;
        productMap[item.name].revenue += sellPrice * qty;
        productMap[item.name].profit += itemProfit;

        const category = dbProduct?.category || "Unknown";

        if (!categoryMap[category]) {
          categoryMap[category] = {
            category,
            revenue: 0,
            profit: 0,
            qtySold: 0,
          };
        }

        categoryMap[category].revenue += sellPrice * qty;
        categoryMap[category].profit += itemProfit;
        categoryMap[category].qtySold += qty;
      });
    });

    const topSellingProducts = Object.values(productMap)
      .sort((a, b) => b.qtySold - a.qtySold)
      .slice(0, 10);

    const topProfitableProducts = Object.values(productMap)
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 10);

    const lowStockProducts = products
      .filter((p) => p.stock <= 5)
      .sort((a, b) => a.stock - b.stock);

    const deadStock = products.filter((p) => {
      const sold = productMap[p.name]?.qtySold || 0;
      return sold === 0;
    });

    const inventoryValue = products.reduce((sum, p) => {
      return sum + p.buyingPrice * p.stock;
    }, 0);

    res.json({
      overview: {
        revenue,
        profit,
        discounts,
        totalSales: sales.length,
        totalItemsSold,
        averageSale:
          sales.length > 0 ? revenue / sales.length : 0,
        profitMargin:
          revenue > 0 ? (profit / revenue) * 100 : 0,
        inventoryValue,
      },

      topSellingProducts,
      topProfitableProducts,

      categories: Object.values(categoryMap).sort(
        (a, b) => b.revenue - a.revenue
      ),

      paymentMethods,

      lowStockProducts,

      deadStock,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Failed to load insights",
      error: err.message,
    });
  }
};