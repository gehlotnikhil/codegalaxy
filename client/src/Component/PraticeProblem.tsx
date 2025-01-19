import { Link } from "react-router";
import styled from "styled-components";

const TableWrapper = styled.div`
  padding: 20px;
  background-color: #1e293b;
  border-radius: 8px;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
`;

const Table = styled.table`
  width: 100%;
  color: #fff;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  tr {
    background-color: #334155;
  }

  th {
    padding: 10px;
    text-align: left;
    color: #cbd5e1;
  }
`;

const TableBody = styled.tbody`
  tr {
    &:nth-child(even) {
      background-color: #2d3748;
    }
  }

  td {
    padding: 10px;
    color: #e2e8f0;
  }
`;

const PraticeProblem = () => {
  interface ProblemDetailType{
    name:string;
    status:"SOLVED"|"UNSOLVED";
  }
  const problems:ProblemDetailType[] = [
    { name: "Code Output - MCQ", status: "SOLVED" },
    { name: "Print Coding, Chef!", status: "SOLVED" },
    { name: "Identify Correct Syntax", status: "SOLVED" },
    { name: "Print difference of 10 and 3", status: "SOLVED" },
    { name: "Correct Syntax for Header", status: "SOLVED" },
    { name: "Print String num", status: "SOLVED" },
    { name: "Print 6 divided by 2", status: "SOLVED" },
    { name: "Identify Incorrect Syntax", status: "SOLVED" },
    { name: "Print 108 using 9 and 12", status: "SOLVED" },
  ];

  return (
    <TableWrapper>
      <Table>
        <TableHead>
          <tr>
            <th>Problem Name</th>
            <th>Status</th>
          </tr>
        </TableHead>
        <TableBody>
          {problems.map((problem, index) => (
            <tr key={index}>
              <td>
              <Link
                    className="problem-highlight"
                    to={`/pratice/c/1234567890`}
                  > {problem.name}</Link>
              </td>
              <td>{problem.status}</td>
            </tr>
          ))}
        </TableBody>
      </Table>
    </TableWrapper>
  );
};

export default PraticeProblem;