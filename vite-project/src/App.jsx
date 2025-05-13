import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [solvedBoard, setSolvedBoard] = useState([]);
  const [userValue, setUserValue] = useState([]);
  const [solution, setSolution] = useState([]);

  async function fetchSudokuSolution() {
    try {
      const response = await fetch(
        "https://api.api-ninjas.com/v1/sudokugenerate?difficulty=easy",
        {
          method: "GET",
          headers: {
            "X-Api-Key": "eNNGhjeghOiwSXT27DT4oQ==zQA18cLfYn2Ptick",
          },
        }
      );

      const result = await response.json();
      console.log(result);
      if (result && result.solution) {
        setSolvedBoard(result.puzzle);
        setSolution(result.solution);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  useEffect(() => {
    if (solvedBoard.length > 0) {
      setUserValue(
        solvedBoard.map((row) => row.map((cell) => (cell === null ? "" : cell)))
      );
    }
  }, [solvedBoard]);

  function handleInputChange(rowIndex, Index, updatevalue) {
    if (updatevalue === "" || (updatevalue >= "1" && updatevalue <= "9")) {
      setUserValue((previtems) => {
        const userUpdateValue = previtems.map((row) => [...row]);
        userUpdateValue[rowIndex][Index] = updatevalue;
        return userUpdateValue;
      });
    } else {
      alert("Please enter a number between 1 and 9.");
      return;
    }
  }

  function Submitsudoku() {
    let Condition = true;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (solvedBoard[i][j] == null) {
          if (userValue[i][j] !== solution[i][j].toString()) {
            Condition = false;
            break;
          }
        }
      }
    }
    if (Condition) {
      alert("Well Done");
    } else {
      alert("Next Try");
    }
  }

  useEffect(() => {
    fetchSudokuSolution();
  }, []);

  return (
    <>
      <div className="flex items-center justify-center ">
        <div>
          <div className="p-5 ">
            {solvedBoard.length > 0 ? (
              <table className="table-fixed border border-collapse ">
                <tbody>
                  {solvedBoard.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((item, Index) => (
                        <td
                          key={Index}
                          className={`shadow px-5 py-2 text-center ${
                            item === null
                              ? "bg-white"
                              : "bg-fuchsia-100 text-2xl"
                          }`}
                        >
                          {item !== null ? (
                            item
                          ) : (
                            <input
                              type="text"
                              maxLength="1"
                              className="w-8 h-8 text-center rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                              value={
                                userValue[rowIndex] &&
                                userValue[rowIndex][Index]
                                  ? userValue[rowIndex][Index]
                                  : ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  rowIndex,
                                  Index,
                                  e.target.value
                                )
                              }
                            />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <button
            onClick={Submitsudoku}
            className="px-[15px] py-[10px] rounded-2xl text-2xl ml-5 bg-blue-400 text-white"
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
