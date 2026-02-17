import styled, { keyframes } from "styled-components";

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
  margin: 0.5rem;
`;

export const TitleEditContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
`;

export const TitleInput = styled.input`
  font-size: 3rem;
  font-weight: bold;
  color: ${primaryColor};
  background-color: transparent;
  border: none;
  width: 60%;
  padding: 0.5rem;
  outline: none;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  font-family: inherit;
  border-radius: 0.5rem;
  transition:
    background-color,
    box-shadow 0.3s ease;
  &:focus {
    outline: none;
    background-color: #fafafa;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

export const TitleDisplay = styled.div`
  cursor: text;
  display: inline-flex;
  align-items: center;
  gap: 10px;

  span {
    display: inline-block;
    transition: transform 0.2s ease-in-out;
  }

  &:hover span {
    transform: rotate(15deg) scale(1.1);
  }
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
  transition:
    background-color,
    box-shadow 0.3s ease;

  &:focus {
    outline: none;
    background-color: #fafafa;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const fadeInOut = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  10% {
    opacity: 1;
    transform: translateY(0);
  }
  90% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
`;

export const ErrorMessage = styled.p`
  color: ${secondaryColor};
  font-size: 1.6rem;
  margin-bottom: 0.5rem;
  animation: ${fadeInOut} 5s ease-in-out;
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
    right: 1.5rem;
    transition: color 0.3s ease;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }
  & button:hover {
    color: ${secondaryColor};
  }
`;
export const CategoryContainer = styled.div`
  border-bottom: 2px solid rgba(33, 90, 222, 0.5);
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;);
`;

export const Category = styled.h2`
  display: flex;
  align-items: center;
  font-size: 1.6rem;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-right: 0.5rem;
  margin-top: 1rem;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  margin-left: 0.5rem;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition:
    background-color,
    box-shadow 0.3s ease;

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
    top: 1rem;
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
  position: relative;
  font-size: 1.6rem;
  cursor: pointer;
  color: ${neutralColor};
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 0.5rem;
  transition:
    background-color,
    box-shadow 0.3s ease;
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
    border: none;
    cursor: pointer;
    position: absolute;
    right: 1.5rem;
    background-color: transparent;
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
  display flex;
  align-items: space-between;
  justify-content: space-between;
  font-size: 1.6rem;
`;

export const RemoveAllButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.6rem;
  padding: 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
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

export const NewListButton = styled.button`
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

export const HistoryButton = styled(NewListButton)``;

export const HistoryDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: ${neutralColor};
  border: 1px solid ${primaryColor};
  border-radius: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 10;
  min-width: 200px;
  max-height: 300px;
  overflow-y: auto;
`;

export const HistoryList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0.5rem;
`;

export const HistoryListItem = styled.li`
  padding: 0.8rem 1.2rem;
  color: ${primaryColor};
  text-shadow: none;
  font-size: 1.4rem;
  white-space: nowrap;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background-color: ${primaryColor};
    color: ${neutralColor};
  }

  a {
    text-decoration: none;
    color: inherit;
    display: block;
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }
`;

export const HistoryContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const HeaderActionsContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

export const RemoveHistoryButton = styled.button`
  background: transparent;
  border: none;
  color: ${secondaryColor};
  cursor: pointer;
  font-size: 1.6rem;
  padding: 0 0.5rem;
  margin-left: 1rem;
  opacity: 0.6;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);

  &:hover {
    opacity: 1;
    transform: scale(1.2);
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: ${neutralColor};
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 400px;
  width: 90%;
  color: #333;
  text-shadow: none;
`;

export const ModalMessage = styled.p`
  margin-bottom: 1.5rem;
  font-size: 1.6rem;
  line-height: 1.5;
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

export const ModalButton = styled.button`
  padding: 0.8rem 1.6rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-size: 1.6rem;
  background-color: ${(props) =>
    props.color === "danger" ? secondaryColor : primaryColor};
  color: white;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }
`;

const blinkAnimation = keyframes`
  50% {
    opacity: 0.4;
  }
`;

export const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1.5rem;
  font-weight: bold;
  color: #f39c12; /* An orangeish color */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
  animation: ${blinkAnimation} 1.5s linear infinite;
`;

export const LanguageSwitchButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.4rem;
  padding: 0.8rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: ${primaryColor};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  font-weight: bold;
  min-width: 3.5rem;

  &:hover {
    background-color: ${primaryColor};
    color: ${neutralColor};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transform: scale(1.05);
  }
`;
