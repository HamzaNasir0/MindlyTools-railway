import { useState } from "react";
import styles from "../styles/calculator.module.css";

export default function Calculator() {
  const [input, setInput] = useState("");

  const handleClick = (value) => {
    setInput((prev) => prev + value);
  };

  const clearInput = () => setInput("");

  const deleteLast = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const calculate = () => {
    try {
      const result = eval(input);
      setInput(result.toString());
    } catch {
      setInput("Error");
    }
  };

  const handleAdvanced = (type) => {
    try {
      let num = parseFloat(input);

      switch (type) {
        case "sqrt":
          setInput(Math.sqrt(num).toString());
          break;
        case "square":
          setInput((num * num).toString());
          break;
        case "inverse":
          setInput((1 / num).toString());
          break;
        case "percent":
          setInput((num / 100).toString());
          break;
        case "negate":
          setInput((num * -1).toString());
          break;
        default:
          break;
      }
    } catch {
      setInput("Error");
    }
  };

  return (
    <div className={styles["calc-container"]}>
      <div className={styles["calc-display"]}>{input || "0"}</div>

      <div className={styles["calc-buttons"]}>
        <button
          className={styles.button}
          onClick={() => handleAdvanced("percent")}
        >
          %
        </button>

        <button
          className={styles.button}
          onClick={() => handleAdvanced("sqrt")}
        >
          √
        </button>

        <button
          className={styles.button}
          onClick={() => handleAdvanced("square")}
        >
          x²
        </button>

        <button
          className={styles.button}
          onClick={() => handleAdvanced("inverse")}
        >
          1/x
        </button>

        <button
          className={`${styles.button} ${styles["C-button"]}`}
          onClick={clearInput}
        >
          C
        </button>

        <button className={styles.button} onClick={deleteLast}>
          ⌫
        </button>

        <button
          className={styles.button}
          onClick={() => handleAdvanced("negate")}
        >
          ±
        </button>

        <button className={styles.button} onClick={() => handleClick("/")}>
          ÷
        </button>

        {[7, 8, 9].map((n) => (
          <button
            key={n}
            className={styles.button}
            onClick={() => handleClick(n)}
          >
            {n}
          </button>
        ))}

        <button className={styles.button} onClick={() => handleClick("*")}>
          ×
        </button>

        {[4, 5, 6].map((n) => (
          <button
            key={n}
            className={styles.button}
            onClick={() => handleClick(n)}
          >
            {n}
          </button>
        ))}

        <button className={styles.button} onClick={() => handleClick("-")}>
          −
        </button>

        {[1, 2, 3].map((n) => (
          <button
            key={n}
            className={styles.button}
            onClick={() => handleClick(n)}
          >
            {n}
          </button>
        ))}

        <button className={styles.button} onClick={() => handleClick("+")}>
          +
        </button>

        <button
          className={`${styles.button} ${styles.zero}`}
          onClick={() => handleClick("0")}
        >
          0
        </button>

        <button className={styles.button} onClick={() => handleClick(".")}>
          .
        </button>

        <button
          className={`${styles.button} ${styles.equal}`}
          onClick={calculate}
        >
          =
        </button>
      </div>
    </div>
  );
}
