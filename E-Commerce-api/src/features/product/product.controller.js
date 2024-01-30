import { ApplicationError } from "../../error-handler/applicationError.js";
import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";

export default class ProductController {
    constructor() {
        this.productRepository = new ProductRepository
    }
    getAllProducts = async (req, res, next) => {

        try {
            const response = await this.productRepository.getAllProduct();
            res.status(200).json(response);
        } catch (err) {
            // console.log("error in product repository", err);
            res.status(500).json({ success: false, msg: "Something went wrong" });
        }
    }
    addProduct = async (req, res, next) => {

        try {
            const { name, desc, price, category, sizes, stocks } = req.body;
            // console.log(req.body);
            const userID = req.userID;
            // console.log(userID);
            // console.log(req.body);
            const newProduct = new ProductModel(
                name,
                desc,
                parseFloat(price),
                req?.file?.filename,
                category,
                sizes,
                parseFloat(stocks))
            // console.log(newProduct);
            const response = await this.productRepository.addProduct(newProduct, userID);
            // console.log(response);
            // console.log(response.res);
            if (response.success) {
                return res.status(201).send(response);
            } else {
                return res.status(403).send(response);
            }
        } catch (err) {
            console.log("error in product repository", err);
            next(err)
            // throw new ApplicationError("Something went wrong with product collection", 500);
        }
    }

    getOneProduct = async (req, res, next) => {

        try {
            const product = await this.productRepository.getOneProduct(req.params.id);
            // console.log(product);
            if (!product) {
                res.status(404).send('Prduct not fount');
            } else {
                res.status(200).send(product);
            }
        } catch (err) {
            console.log("error in product repository", err);
            next(err);
        }

    }

    rateProduct = async (req, res, next) => {
        try {
            const userID = req.userID;
            const productID = req.query.productID;
            const rating = req.query.rating;
            const userName = req.userName;

            const product = await this.productRepository.reteProduct(userID, productID, rating, userName);
            return res.status(200).send(product);
        } catch (err) {
            next(err);
            // return res.status(200).send(err.message);
        }
    }

    filterProduct = async (req, res, next) => {

        try {

            const { category, maxPrice, minPrice } = req.body;
            console.log(req.body);
            const result = await this.productRepository.filter(minPrice, maxPrice, category);
            res.status(200).send(result);
        } catch (err) {
            console.log("error in product repository", err);
            next(err)
        }



    }
    avaragePrice = async (req, res, next) => {
        try {
            const average = await this.productRepository.avaragePricePerCategory();
            res.status(200).send(average);
        } catch (err) {
            console.log("error in product repository", err);
            next(err)
        }
    }
    avarageRating = async (req, res, next) => {
        try {
            const average = await this.productRepository.averageRating();
            res.status(200).send(average);
        } catch (err) {
            console.log("error in product repository", err);
            next(err)
        }
    }



}