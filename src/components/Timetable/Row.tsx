// src/components/Timetable/Row.tsx
import React from "react";
import Cell, { CellProps } from "./Cell";

export interface RowProps {
  cellsProps: CellProps[];
}

const Row: React.FC<RowProps> = ({ cellsProps }) => {
  return (
    <tr>
      {cellsProps.map((cell, index) => (
        <Cell key={index} {...cell} />
      ))}
    </tr>
  );
};

export default Row; // Ensure this line is present
