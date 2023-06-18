import { BackdropDiv } from "../../styles/components/popup.style";
import { ModelDiv } from "../../styles/components/popup.style";

const ShowClassifiedRow = ({ onRowOut, children, scrollx, scrolly }) => {
  return (
    <div>
      <BackdropDiv onClick={onRowOut} />
      <ModelDiv
        background="#ffffff;"
        className={`${scrollx && "overflow-x-scroll"} ${
          scrolly && "overflow-y-scroll"
        }`}
      >
        <table className={`border-collapse table-auto w-full text-sm`}>
          {children}
        </table>
      </ModelDiv>
    </div>
  );
};

export default ShowClassifiedRow;
