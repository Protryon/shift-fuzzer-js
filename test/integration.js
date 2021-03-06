import expect from "expect.js";
import {parseScript, parseModule} from "shift-parser";
import codegen from "shift-codegen";
import {default as isValid, Validator} from "shift-validator";

import {testRepeatedly} from "./helpers";
import {fuzzScript, fuzzModule, fuzzWhileStatement} from "../";


suite("integration", () => {
  testRepeatedly("script round-trips through our codegen and parser", () => {
    let program = fuzzScript();
    let roundTripped;
    try {
      roundTripped = parseScript(codegen(program));
      expect(roundTripped).to.be.eql(parseScript(codegen(roundTripped)));
      expect(isValid(program)).to.be.ok();
    } catch(e) {
      if (e.description && (e.description.match('Duplicate binding'))) return;
      // todo remove catch entirely
      console.log(codegen(program));
      console.log(Validator.validate(program));
      console.log(e);
      throw e;
    }
  });

  testRepeatedly("module round-trips through our codegen and parser", () => {
    let program = fuzzModule();
    let roundTripped;
    try {
      roundTripped = parseModule(codegen(program));
      expect(roundTripped).to.be.eql(parseModule(codegen(roundTripped)));
      expect(isValid(program)).to.be.ok();
    } catch(e) {
      if (e.description && (e.description.match('Duplicate binding') || e.description.match('Duplicate export') || e.description.match('is not declared'))) return;
      // todo remove catch entirely
      console.log(codegen(program));
      console.log(Validator.validate(program));
      console.log(e);
      throw e;
    }
  });
});
