import { Product } from "../models/Product.js";
import { StockLog } from "../models/StockLog.js";
import {
  uploadMultipleImages,
  deleteMultipleImages,
} from "../services/cloudinary.service.js";

// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// POST /api/products
// export const createProduct = async (req, res) => {
//   try {
//     const { name, category, price, buyingPrice, stock, code } = req.body;

//     const product = new Product({
//       name,
//       category,
//       price,
//       buyingPrice,
//       stock,
//       code,
//     });

//     await product.save();

//     // ✅ LOG STOCK (INITIAL STOCK = IN)
//     await StockLog.create({
//       product: product._id,
//       name: product.name,
//       quantity: stock,
//       type: "IN",
//       createdBy: req.user?._id,
//     });

//     res.status(201).json(product);
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ message: "Failed to create product" });
//   }
// };

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      buyingPrice,
      stock,
      code,
      description,
    } = req.body;

    // Upload images to Cloudinary
    const images = req.files?.length
      ? await uploadMultipleImages(req.files)
      : [];

    const product = new Product({
      name,
      category,
      price: parseFloat(price),
      buyingPrice: parseFloat(buyingPrice),
      stock: parseFloat(stock),
      code,
      description,
      images,
      createdBy: req.user?._id,
    });

    await product.save();

    await StockLog.create({
      product: product._id,
      name: product.name,
      quantity: product.stock,
      type: "IN",
      createdBy: req.user?._id,
    });

    res.status(201).json(product);

  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};


// PUT /api/products/:id
// export const updateProduct = async (req, res) => {
//   try {
//     const oldProduct = await Product.findById(req.params.id);

//     if (!oldProduct) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     const updatedProduct = await Product.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );

//     // ✅ CHECK IF STOCK CHANGED
//     if (req.body.stock !== undefined) {
//       const difference = req.body.stock - oldProduct.stock;

//       if (difference !== 0) {
//         await StockLog.create({
//           product: updatedProduct._id,
//           name: updatedProduct.name,
//           quantity: Math.abs(difference),
//           type: difference > 0 ? "IN" : "OUT",
//           createdBy: req.user?._id,
//         });
//       }
//     }

//     res.json(updatedProduct);
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ message: "Failed to update product" });
//   }
// };

export const updateProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const {
      name,
      category,
      price,
      buyingPrice,
      stock,
      code,
      description,
    } = req.body;

    const oldStock = product.stock;

    product.name = name ?? product.name;
    product.category = category ?? product.category;
    product.price = price ?? product.price;
    product.buyingPrice = buyingPrice ?? product.buyingPrice;
    product.stock = stock ?? product.stock;
    product.code = code ?? product.code;
    product.description = description ?? product.description;

    // Replace images if new ones were uploaded
    if (req.files?.length) {

      await deleteMultipleImages(product.images);

      product.images = await uploadMultipleImages(req.files);

    }

    await product.save();

    if (stock !== undefined) {

      const difference = stock - oldStock;

      if (difference !== 0) {

        await StockLog.create({

          product: product._id,
          name: product.name,
          quantity: Math.abs(difference),
          type: difference > 0 ? "IN" : "OUT",
          createdBy: req.user?._id,

        });

      }

    }

    res.json(product);

  } catch (error) {

    console.error(error);

    res.status(400).json({
      message: error.message,
    });

  }
};

// DELETE /api/products/:id
// DELETE /api/products/:id
// export const deleteProduct = async (req, res) => {
//   try {
//     const deletedProduct = await Product.findByIdAndDelete(
//       req.params.id
//     );

//     if (!deletedProduct) {
//       return res.status(404).json({
//         message: "Product not found",
//       });
//     }

//     res.json({
//       success: true,
//       message: "Product deleted successfully",
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(400).json({
//       message: "Failed to delete product",
//       error: error.message,
//     });
//   }
// };

export const deleteProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {

      return res.status(404).json({
        message: "Product not found",
      });

    }

    await deleteMultipleImages(product.images);

    await product.deleteOne();

    res.json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(400).json({
      message: error.message,
    });

  }
};




// import { Product } from "../models/Product.js";

// // GET /api/products
// export const getProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to fetch products" });
//   }
// };

// // POST /api/products
// export const createProduct = async (req, res) => {
//   try {
//     const { name, category, price, buyingPrice,  stock, code } = req.body;
//     const product = new Product({ name, category, price, buyingPrice,  stock, code });
//     await product.save();
//     res.status(201).json(product);
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ message: "Failed to create product" });
//   }
// };



// // PUT /api/products/:id
// export const updateProduct = async (req, res) => {
//   try {
//     const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(product);
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ message: "Failed to update product" });
//   }
// };

// // DELETE /api/products/:id
// export const deleteProduct = async (req, res) => {
//   try {
//     await Product.findByIdAndDelete(req.params.id);
//     res.json({ message: "Product deleted" });
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ message: "Failed to delete product" });
//   }
// };