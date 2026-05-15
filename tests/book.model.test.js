const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const Book = require("../models/Book");

function buildValidBook(overrides = {}) {
  return new Book({
    title: "Cien años de soledad",
    genre: "novela",
    pages: 471,
    publishedAt: new Date("1967-05-30"),
    available: true,
    author: new mongoose.Types.ObjectId(),
    ...overrides
  });
}

test("Book: crea un libro válido correctamente", async () => {
  const book = buildValidBook();
  await assert.doesNotReject(() => book.validate());
});

test("Book: aplica valores por defecto en publishedAt y available", async () => {
  const book = buildValidBook({ publishedAt: undefined, available: undefined });
  await book.validate();

  assert.equal(book.available, true);
  assert.ok(book.publishedAt instanceof Date);
});

test("Book: falla si title tiene menos de 2 caracteres", async () => {
  const book = buildValidBook({ title: "A" });
  await assert.rejects(() => book.validate(), (error) => {
    assert.equal(error.name, "ValidationError");
    assert.ok(error.errors.title.message.includes("al menos 2 caracteres"));
    return true;
  });
});

test("Book: falla si genre no está dentro del enum", async () => {
  const book = buildValidBook({ genre: "drama" });
  await assert.rejects(() => book.validate(), (error) => {
    assert.equal(error.name, "ValidationError");
    assert.ok(error.errors.genre.message.includes("novela"));
    return true;
  });
});

test("Book: falla si pages es menor de 10", async () => {
  const book = buildValidBook({ pages: 5 });
  await assert.rejects(() => book.validate(), (error) => {
    assert.equal(error.name, "ValidationError");
    assert.ok(error.errors.pages.message.includes("al menos 10 páginas"));
    return true;
  });
});

test("Book: falla si falta author", async () => {
  const book = buildValidBook({ author: undefined });
  await assert.rejects(() => book.validate(), (error) => {
    assert.equal(error.name, "ValidationError");
    assert.ok(error.errors.author.message.includes("obligatorio"));
    return true;
  });
});

test.after(() => {
  delete mongoose.connection.models.Book;
});
