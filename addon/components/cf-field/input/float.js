import Component from "@ember/component";

/**
 * Input component for the float question type
 *
 * @class CfFieldInputFloatComponent
 */
export default Component.extend({
  tagName: "input",
  classNames: ["uk-input"],
  attributeBindings: [
    "type",
    "step",
    "field.id:name",
    "field.answer.floatValue:value",
    "field.question.floatMinValue:min",
    "field.question.floatMaxValue:max"
  ],
  type: "number",
  step: 0.001
});
