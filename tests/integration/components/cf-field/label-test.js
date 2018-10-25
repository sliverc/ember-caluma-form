import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, settled } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";
import Question from "ember-caluma-form/lib/question";

module("Integration | Component | cf-field/label", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
    assert.expect(2);

    await render(hbs`
      {{cf-field/label
        field=(hash
          question=(hash
            label="Test"
          )
        )
      }}
    `);

    assert.dom("label").hasClass("uk-form-label");
    assert.dom("label").hasText("Test");
  });

  test("it marks optional fields as such", async function(assert) {
    assert.expect(2);

    this.set(
      "question",
      Question.create({ isRequired: "true", label: "Test" })
    );

    await render(hbs`
      {{cf-field/label
        field=(hash question=question)
      }}
    `);

    assert.dom("label").hasText("Test");

    this.set("question.isRequired", "false");

    await settled();

    assert.dom("label").hasText("Test (Optional)");
  });
});
