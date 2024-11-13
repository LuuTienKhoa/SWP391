import React from "react";
import styled from "styled-components";

const Pagination = ({ totalPosts, postPerPage, paginate }) => {
  let pages = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postPerPage); i++) {
    pages.push(i);
  }

  return (
    <PaginationWrapper>
      {pages.map((page, index) => (
        <StyledButton key={index} onClick={() => paginate(page)}>
          {page}
        </StyledButton>
      ))}
    </PaginationWrapper>
  );
};

// Pagination Wrapper to center the buttons
const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center; /* Center the buttons */
  align-items: center;
  margin-top: 20px;
`;

// Styled button component with a more standard design
const StyledButton = styled.button`
  border: 1px solid #ddd; /* Light gray border */
  outline: none;
  background-color: #fff; /* White background */
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #333; /* Dark text color */
  border-radius: 5px;
  margin: 0 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f0f0f0; /* Light gray on hover */
  }

  &:active {
    background-color: #ddd; /* Darker gray on click */
    transform: translateY(2px);
  }

  &:disabled {
    background-color: #e0e0e0; /* Disabled button */
    cursor: not-allowed;
  }
`;

export default Pagination;
