import { Parser } from "json2csv";
import reportService from "./report.service.js";

const getLowStockReport = async (req, res, next) => {
  try {
    const products = await reportService.getLowStockProducts();

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

const getLowStockReportCSV = async (req, res, next) => {
  try {
    const products = await reportService.getLowStockProducts();

    // Pick only the fields we want in the CSV, in a flat shape
    const rows = products.map((product) => ({
      key: product.key,
      name: product.name,
      category: product.category?.name || "Uncategorized",
      totalQty: product.totalQty,
      lowStockThreshold: product.lowStockThreshold,
    }));

    const fields = ["key", "name", "category", "totalQty", "lowStockThreshold"];
    const parser = new Parser({ fields });
    const csv = parser.parse(rows);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=low-stock-report.csv");
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

const getStockMovementReport = async (req, res, next) => {
  try {
    const { startDate, endDate, productId } = req.query;

    const movements = await reportService.getStockMovements({
      startDate,
      endDate,
      productId,
    });

    res.status(200).json({
      success: true,
      count: movements.length,
      movements,
    });
  } catch (error) {
    next(error);
  }
};

export { getLowStockReport, getLowStockReportCSV, getStockMovementReport };