import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Corn', 50, "lbs", "Arriving Soon", "Arriving Soon"),
  createData('Beef', 60, "lbs", "Arriving Soon", 4.3),
  createData('Eggs', 30, "flat", "Arriving Soon", 6.0),
  createData('Pork', 20, "lbs", "Ordered Recently", 4.3),
  createData('Salmon', 12, "lbs", "Ordered Recently", 3.9),
  createData('Rice', 40, "lbs", "Ordered Recently", 4.0),
  createData('Oil', 10, "lbs", "Not Yet Ordered", 4.3),
  createData('Turkey', 22, "lbs", "Not Yet Ordered", 6.0),
  createData('Salt', 31, "lbs", "Not Yet Ordered", 4.3),
  createData('Sugar', 15, "lbs", "Not Yet Ordered", 3.9),
];

export default function SimpleTableChartTwo() {
  return (
    <TableContainer component={Paper}>
      <Table  aria-label="simple table" >
        <TableHead>
          <TableRow sx={{ backgroundColor: 'primary.secondary' }}>
            <TableCell sx={{ paddingTop: '6px', paddingBottom: '6px', color: 'primary.main', fontWeight: 'bold' }}>Inventory Item</TableCell>
            <TableCell sx={{ paddingTop: '6px', paddingBottom: '6px', color: 'primary.main', fontWeight: 'bold' }} align="right">Qty Remaining</TableCell>
            <TableCell sx={{ paddingTop: '6px', paddingBottom: '6px', color: 'primary.main', fontWeight: 'bold' }} align="right">Unit</TableCell>
            <TableCell sx={{ paddingTop: '6px', paddingBottom: '6px', color: 'primary.main', fontWeight: 'bold' }} align="right">Reorder Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{
                height: '20px' // or whatever height you want
              }}
            >
              <TableCell sx={{ paddingTop: '5px', paddingBottom: '5px' }} component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell sx={{ paddingTop: '5px', paddingBottom: '5px' }} align="right">{row.calories}</TableCell>
              <TableCell sx={{ paddingTop: '5px', paddingBottom: '5px' }} align="right">{row.fat}</TableCell>
              <TableCell sx={{ paddingTop: '5px', paddingBottom: '5px' }} align="right">{row.carbs}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}