import  { useState } from "react";

const QuestionInfo = () => {
  // State to manage visibility
  const [showHints, setShowHints] = useState({
    hint1: false,
    hint2: false,
    hint3: false,
  });

  const toggleHint = (hintKey: keyof typeof showHints) => {
    setShowHints((prevState) => ({
      ...prevState,
      [hintKey]: !prevState[hintKey],
    }));
  };

  const hints = [
    {
      key: "hint1" as "hint1",
      title: "💡 Hint 1",
      content:
        "A really brute force way would be to search for all possible pairs of numbers but that would be too slow. Again, it's best to try out brute force solutions for completeness. It is from these brute force solutions that you can come up with optimizations.",
    },
    {
      key: "hint2" as "hint2",
      title: "💡 Hint 2",
      content:
        "So, if we fix one of the numbers, say x, we have to scan the entire array to find the next number y which is value - x, where value is the input parameter. Can we change our array somehow so that this search becomes faster?",
    },
    {
      key: "hint3" as "hint3",
      title: "💡 Hint 3",
      content:
        "Further optimization ideas can be built upon hash-based structures for constant time lookups.",
    },
  ];

  return (
    <div className="container bg-dark text-light p-4 rounded">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <span className="text-muted">Accepted</span>
          <span className="ms-2 fw-bold">15.7M</span>
        </div>
        <div>
          <span className="text-muted">Submissions</span>
          <span className="ms-2 fw-bold">28.8M</span>
        </div>
        <div>
          <span className="text-muted">Acceptance Rate</span>
          <span className="ms-2 fw-bold">54.6%</span>
        </div>
      </div>

      {/* Topics Section */}
      <div className="mb-4">
        <h6>Topics</h6>
        <div className="d-flex">
          <span className="badge bg-secondary me-2">Array</span>
          <span className="badge bg-secondary">Hash Table</span>
        </div>
      </div>

      {/* Companies Section */}
      <div className="mb-4">
        <h6>Companies</h6>
        <div className="text-muted">Locked</div>
      </div>

      {/* Hints Section */}
      <div className="mb-4">
        <h6>Hints</h6>
        <div>
          {hints.map((hint) => (
            <div className="mb-3" key={hint.key}>
              <div
                className="cursor-pointer d-flex justify-content-between align-items-center"
                onClick={() => toggleHint(hint.key)}
              >
                <span>{hint.title}</span>
                <span>{showHints[hint.key] ? "▲" : "▼"}</span>
              </div>
              {showHints[hint.key] && <p className="mt-2">{hint.content}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Similar Questions Section */}
      <div className="mb-4">
        <h6>Similar Questions</h6>
        <div className="text-muted">Expandable Content</div>
      </div>

      {/* Discussion Section */}
      <div className="mb-4">
        <h6>Discussion</h6>
        <div>1.2K</div>
      </div>

      {/* Footer Section */}
      <div className="d-flex justify-content-between border-top pt-3">
        <div>
          <span className="me-3">© 2025 LeetCode All rights reserved</span>
        </div>
        <div className="text-muted">
          <span className="me-2">59.7K</span>
          <span className="me-2">1.2K</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionInfo;
