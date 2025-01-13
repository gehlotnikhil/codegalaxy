import { useSearchParams } from "react-router-dom";

const Testing1 = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  return (
    <div>
      <h1>Problem Set - Page {page}</h1>
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>Page {page}</span>
        <button onClick={() => handlePageChange(page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default Testing1;
