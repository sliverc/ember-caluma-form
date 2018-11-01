import Parser from "jexl/lib/parser/Parser";
import jexl from "jexl";

export const getAST = expression => {
  let grammar = jexl._getGrammar();
  let parser = new Parser(grammar);

  parser.addTokens(jexl._getLexer().tokenize(expression));

  return parser.complete();
};

/**
 * Generator to walk down a JEXL AST tree and yield all transforms
 *
 * @generator
 * @function getTransforms
 * @param {Object} tree The JEXL AST tree or branch
 * @yields {Object} The found transform
 */
export const getTransforms = function*(tree) {
  for (let node of Object.values(tree)) {
    if (typeof node === "object") {
      yield* getTransforms(node);
    }
  }
  if (tree.type && tree.type === "Transform") {
    yield { name: tree.name, subject: tree.subject, args: tree.args };
  }
};

export default { getTransforms, getAST };
