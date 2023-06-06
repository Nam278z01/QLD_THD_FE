import { useRef } from "react";
import { Form, Button } from "react-bootstrap";

const CardTitleWithSearch = ({
  title,
  searchHandle,
  middleExtra,
  noSearch,
  currentSearch,
  searchClass,
}) => {
  const searchRef = useRef();

  function formHandle(e) {
    e.preventDefault();
    searchHandle(searchRef.current.value);
  }

  return (
    <div className="card-header row m-0 p-3 align-items-center">
      <div className="col-12 col-md-10">
        <h4 className="card-title user-select-none text-center text-md-start mb-2 m-md-0">
          {title}
        </h4>
      </div>
      <div className="col-md-2 col-12">
        {!noSearch && (
          <Form
            className={`d-flex align-items-center mb-1 ${searchClass}`}
            onSubmit={formHandle}
          >
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2 h-25 m-0"
              aria-label="Search"
              onBlur={() => {
                searchHandle(searchRef.current.value);
              }}
              ref={searchRef}
              defaultValue={currentSearch}
            />
            <Button
              variant="primary"
              onClick={(e) => {
                formHandle(e);
                e.target.blur();
              }}
            >
              <i className="fas fa-magnifying-glass" />
            </Button>
          </Form>
        )}
      </div>
      {middleExtra && <div className="col-12">{middleExtra}</div>}
    </div>
  );
};

export default CardTitleWithSearch;
