/**
 * CustomWideLayout wraps table components to provide consistent padding and alignment
 * with pagination components. This component ensures visual consistency across the application.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The table component to be wrapped
 * @param {string} [props.className] - Additional CSS classes to be applied
 * @returns {React.ReactElement} Wrapped table component with consistent padding
 *
 * @example
 * <CustomWideLayout>
 *   <TableComponent {...tableProps} />
 * </CustomWideLayout>
 */
const CustomWideLayout = ({ children, className = "" }) => {
  return <div className={`px-6 w-full ${className}`}>{children}</div>;
};

export default CustomWideLayout;
