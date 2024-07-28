import React, { useState } from "react";
import SimplexTableau from "./components/SimplexTableau";
import "./App.css";

function App() {
  const [tableau, setTableau] = useState(null);
  const [exerciseText, setExerciseText] = useState("");
  const [numVars, setNumVars] = useState(5);
  const [numConstraints, setNumConstraints] = useState(4);
  const [animationSpeed, setAnimationSpeed] = useState(2);
  const [displayFormat, setDisplayFormat] = useState("decimal");

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
  };

  const generateRandomArray = (length, max) => {
    return Array.from({ length }, () => getRandomInt(max));
  };

  const generateExercise = () => {
    const c = generateRandomArray(numVars, 10);
    const A = Array.from({ length: numConstraints }, () =>
      generateRandomArray(numVars, 10)
    );
    const b = generateRandomArray(numConstraints, 10);

    const formatObjectiveFunction = (c) => {
      return `Maximize: ${c
        .map((coef, index) => `${coef}&middot;x<sub>${index}</sub>`)
        .join(" + ")}`;
    };

    const formatConstraints = (A, b) => {
      return A.map(
        (row, i) =>
          `${row
            .map((coef, index) => `${coef}&middot;x<sub>${index}</sub>`)
            .join(" + ")} &le; ${b[i]}`
      ).join("<br />");
    };

    const exerciseText = `
      <div class="exercise">
        <p>${formatObjectiveFunction(c)}</p>
        <p>Subject to:</p>
        <p>${formatConstraints(A, b)}</p>
        <p>and x &ge; 0</p>
      </div>
    `;

    const exercise = [c, A, b];
    setTableau(exercise);
    setExerciseText(exerciseText);
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Simplex Tableau Study Tool</h1>
      </div>
      <div className="main-content">
        <div className="content-wrapper">
          <div className="controls">
            <div className="control-item">
              <label>Number of Variables: </label>
              <select
                value={numVars}
                onChange={(e) => setNumVars(parseInt(e.target.value, 10))}
              >
                {[...Array(10).keys()].map((i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <div className="control-item">
              <label>Number of Constraints: </label>
              <select
                value={numConstraints}
                onChange={(e) =>
                  setNumConstraints(parseInt(e.target.value, 10))
                }
              >
                {[...Array(10).keys()].map((i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <div className="control-item">
              <label>Animation Speed: </label>
              <select
                value={animationSpeed}
                onChange={(e) =>
                  setAnimationSpeed(parseInt(e.target.value, 10))
                }
              >
                <option value={1}>Slow</option>
                <option value={2}>Medium</option>
                <option value={3}>Fast</option>
              </select>
            </div>
            <div className="control-item">
              <label>Display Format: </label>
              <select
                value={displayFormat}
                onChange={(e) => setDisplayFormat(e.target.value)}
              >
                <option value="decimal">Decimal</option>
                <option value="fraction">Fraction</option>
              </select>
            </div>
            <button onClick={generateExercise}>Generate Exercise</button>
          </div>
          <div className="exercise-container">
            {exerciseText && (
              <div
                className="exercise-text"
                dangerouslySetInnerHTML={{ __html: exerciseText }}
              />
            )}
          </div>
        </div>
      </div>
      {tableau && (
        <div className="tableau-container">
          <SimplexTableau
            initialTableau={tableau}
            animationSpeed={animationSpeed}
            displayFormat={displayFormat}
          />
        </div>
      )}
    </div>
  );
}

export default App;
