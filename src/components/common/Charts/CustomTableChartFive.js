import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export const CustomTableChartFive = ({ headers, rows }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="recent activity table">
        <TableHead>
          <TableRow sx={{ backgroundColor: 'primary.secondary' }}>
            {headers.map((header, index) => (
              <TableCell
                key={index}
                align={index === 0 ? "center" : "right"}
                sx={{
                  paddingTop: '6px',
                  paddingBottom: '6px',
                  color: 'primary.main',
                  fontWeight: 'bold',
                  lineHeight: 1.1,
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  height: '40px',
                  verticalAlign: 'middle'
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={index}
              sx={{ height: '60px' }}
            >
              {Object.entries(row).map(([key, value], cellIndex) => (
                <TableCell
                  key={cellIndex}
                  align={cellIndex === 0 ? "center" : "right"}
                  sx={{
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {value}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};