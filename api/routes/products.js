const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, './uploads');
    },
    filename : function(req, file, cb){
        cb(null, new Date().getTime()+file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    //reject file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else {        
        console.err("error upload file type!");
        cb(null, false);
    }
}
const upload = multer({storage:storage, limits:{
    fileSize:1024 * 1025 * 5, //5 MB limit
    fileFilter : fileFilter
}});

const ProductControllers = require('../controllers/products');

router.get('/', ProductControllers.products_get_all);
router.get('/:productId', ProductControllers.products_get_byid);
router.post('/', checkAuth, upload.single('productImage'), ProductControllers.products_create);
router.patch('/:productId', checkAuth, ProductControllers.products_update);
router.delete('/:productId', checkAuth, ProductControllers.products_delete);

module.exports = router;