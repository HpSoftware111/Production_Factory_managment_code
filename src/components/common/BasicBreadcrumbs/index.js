import React from "react";
import { Link, useLocation } from "react-router-dom";
import arrowForward from "../../../assets/images/arrowForward.svg";

const GROUPED_SEGMENTS = [
  'cleaning-procedure',
  'maintenance-procedure',
];

const BREADCRUMB_CONFIG = {
  showIds: true  // Global flag to toggle ID display in breadcrumbs
};

const isIdSegment = (segment) => !isNaN(segment) || segment === "new";

const formatLabel = (str) => {
  return str
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

const transformPathnames = (pathnames) => {
  if (!BREADCRUMB_CONFIG.showIds) {
    // If showIds is false, filter out any ID segments
    pathnames = pathnames.filter(segment => !isIdSegment(segment));
  }

  return pathnames.map((segment, index) => {
    const previousSegment = index > 0 ? pathnames[index - 1] : null;
    const path = '/' + pathnames.slice(0, index + 1).join('/');

    return {
      label: formatLabel(segment),
      path: path,
      isId: isIdSegment(segment),
      previousLabel: previousSegment ? formatLabel(previousSegment) : null,
      isGroupedSegment: GROUPED_SEGMENTS.includes(segment)
    };
  });
};

const createBreadcrumbItems = (transformedSegments) => {
  const items = [];
  let i = 0;

  while (i < transformedSegments.length) {
    const current = transformedSegments[i];
    const next = transformedSegments[i + 1];

    // Handle segments with IDs or "new"
    if (next && next.isId) {
      if (current.isGroupedSegment) {
        // For grouped segments, combine into single link
        const nextLabel = next.label === "New"
          ? "New"
          : `ID ${next.label}`;

        items.push({
          primaryLabel: `${current.label} ${nextLabel}`,
          primaryPath: next.path,
          secondaryLabel: null,
          secondaryPath: null
        });
      } else {
        // For non-grouped segments, keep separate links
        const nextLabel = next.label === "New"
          ? "New"
          : `ID ${next.label}`;

        items.push({
          primaryLabel: current.label,
          primaryPath: current.path,
          secondaryLabel: nextLabel,
          secondaryPath: next.path
        });
      }
      i += 2; // Skip both the current segment and its ID/new
    } else {
      // Regular segment
      items.push({
        primaryLabel: current.label,
        primaryPath: current.path,
        secondaryLabel: null,
        secondaryPath: null
      });
      i++;
    }
  }

  return items;
};
const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const transformedSegments = transformPathnames(pathnames);
  const breadcrumbItems = createBreadcrumbItems(transformedSegments);

  return (
    <nav className="flex items-center text-white text-base pt-2">
      <Link to="/" className="text-white hover:text-[#1479FF] capitalize">
        Dashboard
      </Link>

      {breadcrumbItems.map((item, index) => {
        const isActive = location.pathname === item.primaryPath ||
          location.pathname === item.secondaryPath;

        return (
          <span key={item.primaryPath} className="flex items-center">
            <img
              className="mx-4 w-[10px] h-auto"
              src={arrowForward}
              alt="arrowForward"
            />
            <Link
              to={item.primaryPath}
              className={isActive ? "text-[#1479FF] font-bold text-[17px]" : "text-white hover:text-[#1479FF]"}
            >
              {item.primaryLabel}
            </Link>
            {item.secondaryLabel && (
              <span className="flex items-center gap-1">
                <span>&nbsp;</span>
                <Link
                  to={item.secondaryPath}
                  className={isActive ? "text-[#1479FF] font-bold text-[17px]" : "text-white hover:text-[#1479FF]"}
                >
                  {item.secondaryLabel}
                </Link>
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;

// const Breadcrumb = () => {
//   const location = useLocation();
//   const pathnames = location.pathname.split("/").filter((x) => x);
//
//   const transformedPathnames = transformPathnames(pathnames)
//   console.log(transformedPathnames)
//
//   const formatBreadcrumb = (str) => {
//     return str
//       .replace(/-/g, " ") // Replace dashes with spaces
//       .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize each word
//   };
//
//   // Filter out segments that match the :id pattern
//   const filteredPathnames = pathnames.filter((segment) => !/^\d+$/.test(segment));
//   console.log(pathnames)
//
//   return (
//     <nav className="flex items-center text-white text-base pt-2">
//       <Link to="/" className="text-white hover:text-[#1479FF] capitalize">
//         Dashboard
//       </Link>
//       {filteredPathnames.map((value, index) => {
//         const to = `/${filteredPathnames.slice(0, index + 1).join("/")}`;
//         const isLast = index === filteredPathnames.length - 1;
//
//         return (
//           <span key={to} className="flex items-center">
//             {/* {index !== 0 && ( */}
//               <img
//                 className="mx-4 w-[10px] h-auto"
//                 src={arrowForward}
//                 alt="arrowForward"
//               />
//             {/* )} */}
//             {isLast ? (
//               <span className="text-[#1479FF] capitalize font-bold text-[17px]">
//                 {formatBreadcrumb(value)}
//               </span>
//             ) : (
//               <Link
//                 to={to}
//                 className="text-white hover:text-[#1479FF] capitalize"
//               >
//                 {formatBreadcrumb(value)}
//               </Link>
//             )}
//           </span>
//         );
//       })}
//     </nav>
//   );
// };
//
// export default Breadcrumb;
