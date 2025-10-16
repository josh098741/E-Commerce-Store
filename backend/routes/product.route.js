import express from 'express'
import { getAllProducts } from '../controllers/product.controller'

const router = express()

router.get("/", protectRoute, adminRoute, getAllProducts)

export default router