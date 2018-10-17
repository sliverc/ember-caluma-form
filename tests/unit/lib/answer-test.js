import { module, test } from "qunit";
import { setupTest } from "ember-qunit";
import Answer from "ember-caluma-form/lib/answer";

module("Unit | Library | answer", function(hooks) {
  setupTest(hooks);

  test("it works", async function(assert) {
    assert.expect(1);

    const answer = Answer.create({});

    assert.ok(answer);
  });
});
