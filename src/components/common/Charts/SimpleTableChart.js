import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";

export default function SimpleTable({ tableData, showNumberColumn = true }) {
  const { columns, rows } = tableData;

  return (
    <TableContainer sx={{ height: "100%" }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow
            sx={{
              "& th": {
                backgroundColor: "primary.secondary",
                color: "primary.main",
                fontWeight: "bold",
              },
              height: "60px",
            }}
          >
            {showNumberColumn && (
              <TableCell
                sx={{
                  borderTopLeftRadius: "20px",
                  borderBottomLeftRadius: "20px",
                  width: "10%",
                  paddingTop: "5px",
                  paddingBottom: "5px",
                }}
              >
                #
              </TableCell>
            )}
            {columns.map((column, index) => (
              <TableCell
                key={column.id}
                sx={{
                  width: showNumberColumn ? "22.5%" : `${90 / columns.length}%`,
                  ...(!showNumberColumn && index === 0
                    ? {
                        borderTopLeftRadius: "20px",
                        borderBottomLeftRadius: "20px",
                      }
                    : {}),
                  ...(index === columns.length - 1
                    ? {
                        borderTopRightRadius: "20px",
                        borderBottomRightRadius: "20px",
                      }
                    : {}),
                }}
              >
                <Typography display={"block"} variant={"label3"}>
                  {column.label}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody
          sx={{
            "& tr:first-of-type td:first-of-type": {
              borderTopLeftRadius: "20px",
            },
            "& tr:first-of-type td:last-of-type": {
              borderTopRightRadius: "20px",
            },
            "& tr:last-of-type td:first-of-type": {
              borderBottomLeftRadius: "20px",
            },
            "& tr:last-of-type td:last-of-type": {
              borderBottomRightRadius: "20px",
            },
          }}
        >
          {rows.map((row, rowIndex) => (
            <TableRow
              key={row.id}
              sx={{ backgroundColor: "white", pt: "12px" }}
            >
              {showNumberColumn && <TableCell>{rowIndex + 1}</TableCell>}
              {columns.map((column) => (
                <TableCell key={`${row.id}-${column.id}`}>
                  <Typography>{row[column.id]}</Typography>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
