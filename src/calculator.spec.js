// DO NOT MODIFY THIS FILE
import { Calculator } from "./calculator";
import { runSequences } from "../helpers/runSequences";

const publicSequences = [
  // numbers
  "                 # it constructs",
  "[0]              # it displays 0 in the beginning",
  "1                # enters a number",
  "1[1]             # it displays the number",
  "12[12]           # it accumulates numbers (i*10 + n)",
  "0[0]",
  "012[12]",
  "120[120]",

  // next
  ",                # it accepts next",
  ",[0]",
  ",12[12]",
  "12,34[34]        # next inputs a new number",
  "12,[12]          # next still shows the previous before new number",

  // operations
  "1,2+[3]          # it adds",
  "4,3-[1]          # it substracts",
  "6,3*[18]         # it multiplies",
  "6,3/[2]          # it divides",
  "12,34+[46]",
  "12,34-[-22]",

  // division specifics
  "3,0/[0]          # anything by zero is zero",
  "0,0/[0]",
  "7,3/[2]          # it floors the result",
  "6,3/[2]",
  "5,3/[1]",

  // missing operators
  "2+[2]            # assumes a zero",
  "2-[-2]",
  "2*[0]",
  "2/[0]",
  "+[0]             # assumes a zero for any missing one",
  "-[0]",
  "*[0]",
  "/[0]",

  // multiple operands
  "7,1,2+[3]-[4]    # it consumes from right to left ! refactor !",
  "7,1,2*[2]/[3]",
  "1,2+[3],1-[2]    # the result is like a previous input",
  "2,3*[6],2/[3]",
  "1,2,3,4,5+++++++[15] # and as many operands as necessary",

  // repeating operators
  "2,+[4]           # it assumes the result as operand",
  "2,-[0]",
  "2,*[4]",
  "2,/[1]",

  // after operand
  "1,2+71[71]       # entering numbers clears the result",
  "1,2-71[71]",
  "1,2*71[71]",
  "1,2/71[71]",
  "1,2+3,4+[7]      # even when we want to do new computations after it",
  "1,2+3,4+++++[7]",

  // clear
  "C                # there is a clear button",
  "12C[0]           # that clears the current input allowing corrections",
  "12C34[34]",
  "12,34C56+[68]",
  "1,2,3,4CC5-[-5]  # but twice removes all the previous input",
  "1C2,3C4+[6]",
];

test("public sequences", () => {
  runSequences(publicSequences, Calculator);
});
