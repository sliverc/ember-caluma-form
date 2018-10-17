import { module, test } from "qunit";
import { setupTest } from "ember-qunit";
import Document from "ember-caluma-form/lib/document";

module("Unit | Library | document", function(hooks) {
  setupTest(hooks);

  test("it works", async function(assert) {
    assert.expect(1);

    const document = Document.create({});

    assert.ok(document);
  });
});
