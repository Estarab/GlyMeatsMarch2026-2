import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// ========================================
// AUTHENTICATION - verifies JWT token
// ========================================
export const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // check if header exists and starts with Bearer
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No authentication token, access denied",
      });
    }

    // extract token
    const token = authHeader.split(" ")[1];

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find user
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "Token is not valid",
      });
    }

    // attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(401).json({
      message: "Token is not valid",
    });
  }
};

// ========================================
// ADMIN OR SUPERADMIN AUTHORIZATION
// ========================================
export const adminOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    // ✅ allow BOTH admin and superadmin
    if (!["admin", "superadmin"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
      });
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error.message);
    res.status(500).json({
      message: "Authorization error",
    });
  }
};

// ========================================
// SUPERADMIN ONLY (FULL CONTROL)
// ========================================
export const superAdminOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    if (req.user.role !== "superadmin") {
      return res.status(403).json({
        message: "Access denied. Superadmin only.",
      });
    }

    next();
  } catch (error) {
    console.error("Superadmin middleware error:", error.message);
    res.status(500).json({
      message: "Authorization error",
    });
  }
};



// import jwt from "jsonwebtoken";
// import { User } from "../models/User.js";

// // ========================================
// // AUTHENTICATION - verifies JWT token
// // ========================================
// export const protectRoute = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     // check if header exists and starts with Bearer
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         message: "No authentication token, access denied",
//       });
//     }

//     // extract token
//     const token = authHeader.split(" ")[1];

//     // verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // find user
//     const user = await User.findById(decoded.userId).select("-password");

//     if (!user) {
//       return res.status(401).json({
//         message: "Token is not valid",
//       });
//     }

//     // attach user to request
//     req.user = user;
//     next();
//   } catch (error) {
//     console.error("Authentication error:", error.message);
//     return res.status(401).json({
//       message: "Token is not valid",
//     });
//   }
// };

// // ========================================
// // ADMIN AUTHORIZATION
// // ========================================
// export const adminOnly = (req, res, next) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({
//         message: "Not authenticated",
//       });
//     }

//     if (req.user.role !== "admin") {
//       return res.status(403).json({
//         message: "Access denied. Admin privileges required.",
//       });
//     }

//     next();
//   } catch (error) {
//     console.error("Admin middleware error:", error.message);
//     res.status(500).json({
//       message: "Authorization error",
//     });
//   }
// };



// import jwt from "jsonwebtoken";
// import User from "../models/User.js";


// const protectRoute = async (req, res, next) => {
//   try {
//     // get token
//     const token = req.header("Authorization").replace("Bearer ", "");
//     if (!token) return res.status(401).json({ message: "No authentication token, access denied" });

//     // verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // find user
//     const user = await User.findById(decoded.userId).select("-password");
//     if (!user) return res.status(401).json({ message: "Token is not valid" });

//     req.user = user;
//     next();
//   } catch (error) {
//     console.error("Authentication error:", error.message);
//     res.status(401).json({ message: "Token is not valid" });
//   }
// };

// export default protectRoute;
