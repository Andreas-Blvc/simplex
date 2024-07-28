import React, { useState, useEffect } from "react";
import TextTransition, { presets } from "react-text-transition";
import "./SimplexTableau.css";
import getFractionComponents from "../helper/Fraction";

const DELIM = "####";
const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

function SimplexTableau({ initialTableau, animationSpeed, displayFormat }) {
  const DURATION = 4000 / animationSpeed ** 2;
  const [tableau, setTableau] = useState(initialTableau || [[], [], []]);
  const [basicVariables, setBasicVariables] = useState([]);
  const [objectiveValue, setObjectiveValue] = useState(0);
  const [animations, setAnimations] = useState({});

  useEffect(() => {
    if (initialTableau.length === 3) {
      const [c, A, b] = initialTableau;
      const numConstraints = b.length;
      const numVariables = c.length;

      const initialBasicVariables = Array.from(
        { length: numConstraints },
        (_, i) => i + numVariables
      );
      setBasicVariables(initialBasicVariables);

      const extendedA = A.map((row, index) => {
        const slackVariable = Array(numConstraints).fill(0);
        slackVariable[index] = 1;
        return row.concat(slackVariable);
      });
      const extendedC = c.map((e) => -e).concat(Array(numConstraints).fill(0));

      setTableau([extendedC, extendedA, b]);
      setObjectiveValue(0);
    }
  }, [initialTableau]);

  const handleClick = (rowIndex, colIndex) => {
    performPivot(rowIndex, colIndex);
  };

  const performPivot = (pivotRow, pivotCol) => {
    let [c, A, b] = deepCopy(tableau);
    const pivotElement = A[pivotRow][pivotCol];

    if (pivotElement === 0) return; // Can't pivot on a zero element

    setAnimations({ pivotRow, pivotCol });

    // Step 1: Normalize the pivot row
    setTimeout(() => {
      const A_ = deepCopy(A);
      const b_ = deepCopy(b);
      setTimeout(() => {
        A[pivotRow] = A_[pivotRow].map((value) => value / pivotElement);
        b[pivotRow] = b_[pivotRow] / pivotElement;
        setTableau([c, A, b]);
      }, DURATION);
      A[pivotRow] = A[pivotRow].map(
        (value) => value + DELIM + "/" + DELIM + pivotElement
      );
      b[pivotRow] = b[pivotRow] + DELIM + "/" + DELIM + pivotElement;
      setAnimations((prev) => ({ ...prev, updateRow: pivotRow }));
      setTableau([c, A, b]);
    }, DURATION);

    let counter = 0;
    // Step 2: Update the remaining rows one by one
    A.forEach((row, rowIndex) => {
      if (rowIndex !== pivotRow) {
        setTimeout(() => {
          const b_ = deepCopy(b);
          const factor = row[pivotCol];
          setTimeout(() => {
            b[rowIndex] = b_[rowIndex] - factor * b_[pivotRow];
            A[rowIndex] = row.map(
              (value, colIndex) => value - factor * A[pivotRow][colIndex]
            );
            setTableau([c, A, b]);
          }, DURATION);
          b[rowIndex] =
            b_[rowIndex] + DELIM + "-" + DELIM + factor * b_[pivotRow];
          A[rowIndex] = row.map(
            (value, colIndex) =>
              value + DELIM + "-" + DELIM + factor * A[pivotRow][colIndex]
          );
          setAnimations((prev) => ({ ...prev, updateRow: rowIndex }));
          setTableau([c, A, b]);
        }, 3 * DURATION + 2 * DURATION * counter);
        counter += 1;
      }
    });

    // Step 3: Update the objective function row
    setTimeout(() => {
      const factor = c[pivotCol];
      const obj_ = objectiveValue - factor * b[pivotRow];
      const c_ = deepCopy(c);
      setTimeout(() => {
        c = c_.map((value, colIndex) => value - factor * A[pivotRow][colIndex]);
        setObjectiveValue(obj_);
        setTableau([c, A, b]);
      }, DURATION);
      c = c.map(
        (value, colIndex) =>
          value + DELIM + "-" + DELIM + factor * A[pivotRow][colIndex]
      );
      setObjectiveValue(
        (prevValue) => prevValue + DELIM + "-" + DELIM + factor * b[pivotRow]
      );
      setAnimations((prev) => ({
        ...prev,
        updateRow: null,
        updateObjective: true,
      }));
      setTableau([c, A, b]);
    }, 3 * DURATION + 2 * DURATION * (A.length - 1));

    // Step 4: Swap the basic variable
    setTimeout(() => {
      const newBasicVariables = [...basicVariables];
      newBasicVariables[pivotRow] = pivotCol;
      setBasicVariables(newBasicVariables);
      setAnimations({});
    }, 3 * DURATION + 2 * DURATION * A.length);
  };

  if (!tableau || tableau.length !== 3) {
    return <div>Loading...</div>;
  }

  const [c, A, b] = tableau;
  const numVariables = c.length;
  // const numConstraints = b.length;

  const formatFraction = (value) => {
    if (Number.isInteger(value)) {
      return value;
    } else if (typeof value === "string") {
      const [operand1, operator, operand2] = value.split(DELIM);
      return (
        <span>
          {formatFraction(parseFloat(operand1))} {operator}{" "}
          {formatFraction(parseFloat(operand2))}
        </span>
      );
    } else {
      if (displayFormat === "fraction") {
        const { numerator, denominator } = getFractionComponents(value, false);
        return `${numerator}/${denominator}`;
      } else {
        return value.toFixed(2);
      }
    }
  };

  return (
    <table className="simplex-tableau">
      <thead>
        <tr>
          <th>Basic variable</th>
          {Array.from({ length: numVariables }, (_, i) => (
            <th key={`header-${i}`}>
              x<sub>{i}</sub>
            </th>
          ))}
          <th>Solution</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td key="baseZ">z</td>
          {c.map((coef, index) => (
            <td
              key={`coef-${index}`}
              className={animations.updateObjective ? "row-update" : ""}
            >
              <TextTransition
                springConfig={presets.default}
                className="text-transition"
              >
                {coef !== 0 ? formatFraction(coef) : ""}
              </TextTransition>
            </td>
          ))}
          <td
            key="objectiveValue"
            className={animations.updateObjective ? "row-update" : ""}
          >
            <TextTransition
              springConfig={presets.default}
              className="text-transition"
            >
              {formatFraction(objectiveValue)}
            </TextTransition>
          </td>
        </tr>
        {A.map((row, rowIndex) => (
          <tr key={`row-${rowIndex}`}>
            <td key={`base-${rowIndex}`}>
              x<sub>{basicVariables[rowIndex]}</sub>
            </td>
            {row.map((value, colIndex) => (
              <td
                key={`cell-${rowIndex}-${colIndex}`}
                className={
                  animations.pivotRow === rowIndex &&
                  animations.pivotCol === colIndex
                    ? "pivot-element"
                    : animations.updateRow === rowIndex
                    ? "row-update"
                    : "clickable-cell"
                }
                onClick={
                  value !== 0
                    ? () => handleClick(rowIndex, colIndex)
                    : undefined
                }
              >
                <TextTransition
                  springConfig={presets.default}
                  className="text-transition"
                >
                  {value !== 0 ? formatFraction(value) : ""}
                </TextTransition>
              </td>
            ))}
            <td
              key={`solution-${rowIndex}`}
              className={animations.updateRow === rowIndex ? "row-update" : ""}
            >
              <TextTransition
                springConfig={presets.default}
                className="text-transition"
              >
                {formatFraction(b[rowIndex])}
              </TextTransition>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SimplexTableau;
