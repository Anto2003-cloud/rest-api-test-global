const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');
const app = require('../main');

let server;
let baseUrl;

before(async () => {
    await new Promise(resolve => {
        server = app.listen(0, '127.0.0.1', resolve);
    });
    const { port } = server.address();
    baseUrl = `http://127.0.0.1:${port}`;
});

after(async () => {
    await new Promise((resolve, reject) => {
        server.close(error => error ? reject(error) : resolve());
    });
});

test('GET /products returns the product collection', async () => {
    const response = await fetch(`${baseUrl}/products`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.total, 1);
    assert.equal(body.products[0].id, 1);
});

test('POST /products validates input and creates a product', async () => {
    const invalidResponse = await fetch(`${baseUrl}/products`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({})
    });
    assert.equal(invalidResponse.status, 400);

    const response = await fetch(`${baseUrl}/products`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title: 'Nuevo producto', price: 12.5 })
    });
    const body = await response.json();

    assert.equal(response.status, 201);
    assert.equal(body.product.id, 2);
    assert.equal(body.product.title, 'Nuevo producto');
});

test('PUT and DELETE /products/:id return RESTful responses', async () => {
    const updateResponse = await fetch(`${baseUrl}/products/2`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ price: 15 })
    });
    const updated = await updateResponse.json();

    assert.equal(updateResponse.status, 200);
    assert.equal(updated.product.price, 15);

    const deleteResponse = await fetch(`${baseUrl}/products/2`, {
        method: 'DELETE'
    });
    assert.equal(deleteResponse.status, 204);

    const missingResponse = await fetch(`${baseUrl}/products/2`);
    assert.equal(missingResponse.status, 404);
});
