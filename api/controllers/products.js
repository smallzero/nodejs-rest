const mongoose = require('mongoose');

const Product = require('../models/product');
exports.products_get_all = (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        productImage : doc.productImage,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => console.log("Err: " + err));

};

exports.products_get_byid = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            if (doc) {
                console.log("Doc : " + doc);
                res.status(200).json(doc);
            } else {
                res.status(404).json({ message: "Not found Product ID" });
            }

        })
        .catch(err => {
            console.log("Error : " + err);
            res.status(500).json({ error: err });
        });

};

exports.products_create = (req, res, next) => {
    console.log("cek file : "+JSON.stringify(req.file));
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage : req.file.path
    })

    product.save().then(result => {
        console.log("Save Success :" + result);
        res.status(200).json({
            message: 'Created Product successfuly',
            createdProduct: {
                name : result.name,
                price : result.price,
                _id : result._id,
                request : {
                    type : 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        });
    })
        .catch(err => {
            console.log("Err : " + err)
            res.status(500).json({ error: err });
        });


};

exports.products_update = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    console.log("tet : "+JSON.stringify(req.body));
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message : 'Product is Updated',
               url: 'http://localhost:3000/products/' + id
            });
        })
        .catch(err => {
            console.log("Err : " + err);
            res.status(500).json({ error: err });
        })
};

exports.products_delete =(req, res, next) => {
    const id = req.params.productId;
    console.log("id : " + id);
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message : 'Product deleted',
                request : {
                    type : 'POST',
                    url : 'http://localhost:3000/products',
                    body : {name : 'String', price : 'Number'}
                }
            });
        })
        .catch(err => {
            console.log("Error : " + err);
            res.status(500).json({ error: err });
        })
};