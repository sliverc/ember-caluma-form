import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";

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
});
