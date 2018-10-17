import { module, test } from "qunit";
import { setupTest } from "ember-qunit";
import Field from "ember-caluma-form/lib/field";

module("Unit | Library | field", function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.question = {
      slug: "question-1",
      label: "Question 1",
      __typename: "TextQuestion"
    };

    this.document = {
      id: 1,
      answers: {
        edges: [
          {
            node: {
              stringValue: "Test",
              question: {
                slug: this.question.slug
              },
              __typename: "StringAnswer"
            }
          }
        ]
      }
    };

    this.answer = this.document.answers.edges[0].node;
  });

  test("can compute the question", async function(assert) {
    assert.expect(2);

    const field = Field.create(this.owner.ownerInjection(), {
      _question: this.question,
      _document: this.document,
      _answer: this.answer
    });

    assert.equal(field.question.slug, "question-1");
    assert.equal(field.question.label, "Question 1");
  });

  test("can compute the answer", async function(assert) {
    assert.expect(3);

    const field = Field.create(this.owner.ownerInjection(), {
      _question: this.question,
      _document: this.document,
      _answer: this.answer
    });

    assert.equal(field.answer.stringValue, "Test");

    const fieldWithoutAnswer = Field.create(this.owner.ownerInjection(), {
      _question: this.question,
      _document: this.document,
      _answer: null
    });

    assert.equal(fieldWithoutAnswer.answer.stringValue, null);
    assert.equal(fieldWithoutAnswer.answer.__typename, "StringAnswer");
  });

  test("it throws and error if arguments are missing", function(assert) {
    assert.expect(3);

    assert.throws(() => Field.create(), /Owner must be injected/);
    assert.throws(
      () => Field.create(this.owner.ownerInjection()),
      /_question must be passed/
    );
    assert.throws(
      () =>
        Field.create(this.owner.ownerInjection(), {
          _question: this.question
        }),
      /_document must be passed/
    );
  });
});
