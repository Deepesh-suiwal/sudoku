import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [solvedBoard, setSolvedBoard] = useState([]);
  const [userValue, setUserValue] = useState([]);
  const [solution, setSolution] = useState([]);
  const [difficulty, setDifficulty] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchSudokuSolution() {
    if (!difficulty) {
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.api-ninjas.com/v1/sudokugenerate?difficulty=${difficulty}`,
        {
          method: "GET",
          headers: {
            "X-Api-Key": "eNNGhjeghOiwSXT27DT4oQ==zQA18cLfYn2Ptick",
          },
        }
      );

      const result = await response.json();
      console.log(result);

      if (result?.puzzle && result?.solution) {
        setTimeout(() => {
          setSolvedBoard(result.puzzle);
          setSolution(result.solution);
          setLoading(false);
        }, 2000);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (difficulty) {
      fetchSudokuSolution();
    }
  }, []);

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
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (solvedBoard[i][j] == null) {
          if (userValue[i][j] !== solution[i][j].toString()) {
            alert("Next Try");
            setSolvedBoard([]);
            setDifficulty("");
            return;
          }
        }
      }
    }
    alert("Well Done!");
    setSolvedBoard([]);
    setDifficulty("");
  }
return (
  <>
    {solvedBoard.length === 0 && (
      <div className="flex-grid items-center justify-center mt-10">
        <div>
          <label className="mr-2 font-semibold">Difficulty:</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">Select Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <button
          onClick={() => {
            if (!difficulty) {
              alert("Please select an option");
            } else {
              fetchSudokuSolution();
            }
          }}
          className="px-4 py-2 bg-green-600 text-white rounded mt-2 hover:bg-green-700 ml-4"
        >
          Generate Puzzle
        </button>
      </div>
    )}

    {loading ? (
      <p className="text-center text-lg font-semibold mt-6">Loading...</p>
    ) : solvedBoard.length > 0 ? (
      <div className="flex items-center justify-center mt-6">
        
        <div>
          <div className="p-5">
            <table className="table-fixed border border-collapse">
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
          </div>
          <button
            onClick={Submitsudoku}
            className="px-[15px] py-[10px] rounded-2xl text-2xl ml-5 bg-blue-400 text-white"
          >
            Submit
          </button>
        </div>
      </div>
    ) : null}
  </>
);

}


export default App;
