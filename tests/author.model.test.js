const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const Author = require("../models/Author");

function buildValidAuthor(overrides = {}) {
  return new Author({
    name: "Gabriel García Márquez",
    country: "Colombia",
    status: "activo",
    birthDate: new Date("1927-03-06"),
    isAwarded: true,
    ...overrides
  });
}

test("Author: crea un autor válido correctamente", async () => {
  const author = buildValidAuthor();
  await assert.doesNotReject(() => author.validate());
});

test("Author: aplica valores por defecto", async () => {
  const author = buildValidAuthor({ country: undefined, status: undefined, isAwarded: undefined });
  await author.validate();

  assert.equal(author.country, "Desconocido");
  assert.equal(author.status, "activo");
  assert.equal(author.isAwarded, false);
});

test("Author: acepta longitud máxima válida en name", async () => {
  const author = buildValidAuthor({ name: "A".repeat(100) });
  await assert.doesNotReject(() => author.validate());
});

test("Author: falla si name tiene menos de 2 caracteres", async () => {
  const author = buildValidAuthor({ name: "A" });
  await assert.rejects(() => author.validate(), (error) => {
    assert.equal(error.name, "ValidationError");
    assert.ok(error.errors.name.message.includes("al menos 2 caracteres"));
    return true;
  });
});

test("Author: falla si status no está dentro del enum", async () => {
  const author = buildValidAuthor({ status: "inactivo" });
  await assert.rejects(() => author.validate(), (error) => {
    assert.equal(error.name, "ValidationError");
    assert.ok(error.errors.status.message.includes("activo") || error.errors.status.message.includes("retirado"));
    return true;
  });
});

test("Author: falla si falta birthDate", async () => {
  const author = buildValidAuthor({ birthDate: undefined });
  await assert.rejects(() => author.validate(), (error) => {
    assert.equal(error.name, "ValidationError");
    assert.ok(error.errors.birthDate.message.includes("obligatoria"));
    return true;
  });
});

test.after(() => {
  delete mongoose.connection.models.Author;
});
