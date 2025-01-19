import { useEffect } from "react";
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
interface QuestionType{
  id?:string,
  problemName?:string,
  language?: "java"|"c"|"cpp"|"go",
  status?:"SOLVED"|"UNSOLVED"
}
interface propType{
  Question:QuestionType[]
}
const PraticeProblem = (prop:propType) => {
 
  useEffect(() => {
    console.log(prop.Question);
   
  }, [])
  
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
          {prop.Question.map((problem, index) => (
            <tr key={index}>
              <td>
              <Link
                    className="problem-highlight"
                    to={`/pratice/${problem.language}/${problem.id}`}
                  > {problem.problemName}</Link>
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