import styled from "styled-components";

// Color Palette
const primaryColor = "#215ADE"; // Razzle Dazzle Blue
const secondaryColor = "#e10000"; // Razzle Dazzle Rose
const neutralColor = "#efefef"; // Gray

export const Container = styled.div`
  font-family: Arial, sans-serif;
  padding: 1rem;
  background: linear-gradient(135deg, ${neutralColor}, ${primaryColor});
  max-width: 60rem;
  margin: 1rem auto;
  border-radius: 2rem;
  min-height: calc(100dvh - 4rem);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

export const Title = styled.h2`
  color: ${primaryColor};
  font-size: 3rem;
  margin-bottom: 1rem;
`;

export const Input = styled.input`
  padding: 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.6rem;
  width: calc(100% - 2rem);
  background-color: ${neutralColor};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-bottom: 0.5rem;
  transition: background-color, box-shadow 0.3s ease;

  &:focus {
    outline: none;
    background-color: #fafafa;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

export const ErrorMessage = styled.p`
  color: ${secondaryColor};
  font-size: 1.6rem;
  margin-bottom: 0.5rem;
`;
export const ListsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const List = styled.ul`
  list-style: none;
  border: 2px solid rgba(33, 90, 222, 0.2);
  border-radius: 1rem;
  padding: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 47%;
`;

export const ListItem = styled.li`
  margin-bottom: 0.5rem;
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  width: calc(100% - 0.6rem);
  & button {
    /* Styles for the X button */
    background-color: transparent;
    border: none;
    cursor: pointer;
    position: absolute;
    right: 1rem;
    transition: color 0.3s ease;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }
  & button:hover {
    color: ${secondaryColor};
  }
`;

export const Label = styled.label`
  display: flex;
  align-items: center;
  font-size: 1.6rem;
  cursor: pointer;
  width: 100%;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-right: 0.5rem;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color, box-shadow 0.3s ease;

  &:hover {
    background-color: ${neutralColor};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Increase shadow size for 3D effect */
  }
`;

export const CheckboxInput = styled.input`
  margin-right: 0.5rem;
  cursor: pointer;
  appearance: none;
  width: 1.6rem;
  min-width: 1.6rem;
  height: 1.6rem;
  border: 1px solid;
  border-radius: 0.3rem;
  outline: none;
  transition: border 0.3s ease;
  &:hover {
    border: none;
  }

  &:hover::after {
    opacity: 1;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    transition: opacity 0.3s ease;
  }
  &::after {
    content: "✔"; /* Unicode for check symbol */
    opacity: 0; /* Initially hide the check symbol */
    position: absolute;
    top: 0.5rem;
  }
`;

export const CheckedItemsContainer = styled.div`
  width: 47%;
`;

export const CheckedItemsTitle = styled.h3`
  font-size: 1.8rem;
`;

export const CheckedItemsList = styled.ul`
  list-style: none;
  border: 2px solid rgba(239, 239, 239, 0.2);
  border-radius: 1rem;
  padding: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

export const CheckedItem = styled.li`
  font-size: 1.6rem;
  cursor: pointer;
  color: ${neutralColor};
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 0.5rem;
  transition: background-color, box-shadow 0.3s ease;
  width: calc(100% - 2rem);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${primaryColor};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  & button {
    /* Styles for the X button */
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: ${neutralColor};
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    transition: color 0.3s ease;
  }
  & button:hover {
    color: ${secondaryColor};
  }
`;

export const CheckedItemName = styled.span`
  margin-right: 0.5rem;
`;

export const Message = styled.p`
  font-size: 1.4rem;
  width: 101%;
  margin-bottom: 0.5rem;
`;

export const RemoveAllButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.6rem;
  padding: 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  color: ${secondaryColor};
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    background-color: ${neutralColor};
  }
`;

export const SortButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.6rem;
  padding: 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 0.5rem;
  color: ${primaryColor};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: ${primaryColor};
    color: ${neutralColor};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;
