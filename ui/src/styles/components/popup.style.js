import styled from "@emotion/styled";

export const BackdropDiv = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 20;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ModelDiv = styled.div`
    position: fixed;
    top: 20vh;
    left: 5%;
    width: 90%;
    background: ${(props) => props.background}
    padding: 16px;
    border-radius: 14px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.25);
    z-index: 30;

    @media (min-width: 768px){
        & {
            width: 40rem;
            left: calc(50% - 20rem);
        }
    }
`;