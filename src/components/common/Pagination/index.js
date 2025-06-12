import React from "react";
import MuiPagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import { PaginationItem } from "@mui/material";

const PaginationComponent = ({ currentPage, totalPage, setCurrentPage }) => {
  console.log("totalPage=>", totalPage)
  if (totalPage != 0 && totalPage != undefined) {
    return (
      <Stack
        spacing={2} // This spacing appears to have no effect when commented out
        className="h-14 flex text-center w-full justify-center"
        sx={{ padding: 2, borderRadius: 1 }} // Why does stack have border radius?
      >
        <MuiPagination
          count={totalPage}
          page={currentPage}
          siblingCount={1}
          onChange={(e, page) => setCurrentPage(page)}
          renderItem={(item) => (
            <PaginationItem
              {...item}
              components={{
                previous: () => (
                  <div className="bg-BtnBg px-6 py-3 rounded-xl flex items-center gap-1 hover:bg-opacity-80 transition-all mr-auto">
                    <ArrowBackIosNew sx={{ fontSize: 12, color: "#fff" }} />
                    <span className="text-base font-normal text-BtnText">
                      Previous
                    </span>
                  </div>
                ),
                next: () => (
                  <div className="bg-BtnBg px-6 py-3 rounded-xl flex items-center gap-1 hover:bg-opacity-80 transition-all ml-auto">
                    <span className="text-base font-normal text-BtnText">
                      Next
                    </span>
                    <ArrowForwardIos sx={{ fontSize: 12, color: "#fff" }} />
                  </div>
                ),
              }}
            />
          )}
        />
      </Stack>
    );
  }

};

export default PaginationComponent;
