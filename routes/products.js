const express = require('express');
const router = express.Router();

let products = [
    {
        id: 1,
        title: 'Essence Mascara Lash Princess',
        description: 'The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects.',
        category: 'beauty',
        price: 9.99,
        discountPercentage: 7.17,
        rating: 4.94,
        stock: 5,
        tags: ['beauty', 'mascara'],
        brand: 'Essence',
        sku: 'RCH45Q1A',
        weight: 2,
        dimensions: { width: 23.17, height: 14.43, depth: 28.01 },
        warrantyInformation: '1 month warranty',
        shippingInformation: 'Ships in 1 month',
        availabilityStatus: 'Low Stock',
        reviews: [
            { rating: 2, comment: 'Very unhappy with my purchase!' },
            { rating: 5, comment: 'Very satisfied!' }
        ]
    }
];

function parseProductId(value) {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
}

router.get('/', (req, res) => {
    res.json({
        products,
        total: products.length,
        skip: 0,
        limit: 30
    });
});

router.get('/:id', (req, res) => {
    const productId = parseProductId(req.params.id);
    const product = products.find(item => item.id === productId);

    if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    return res.json({ product });
});

router.post('/', (req, res) => {
    if (!req.body || typeof req.body.title !== 'string' || !req.body.title.trim()) {
        return res.status(400).json({ message: 'El título es obligatorio' });
    }

    const nextId = products.reduce((maximum, item) => Math.max(maximum, item.id), 0) + 1;
    const newProduct = { ...req.body, id: nextId };
    products.push(newProduct);

    return res.status(201).json({ product: newProduct });
});

router.put('/:id', (req, res) => {
    const productId = parseProductId(req.params.id);
    const productIndex = products.findIndex(item => item.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    products[productIndex] = { ...products[productIndex], ...req.body, id: productId };
    return res.json({ product: products[productIndex] });
});

router.delete('/:id', (req, res) => {
    const productId = parseProductId(req.params.id);
    const productIndex = products.findIndex(item => item.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    products.splice(productIndex, 1);
    return res.status(204).send();
});

module.exports = router;
