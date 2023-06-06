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
    <div className="card-header row m-0 p-3">
      <div
        className={`col-12 row mx-auto align-items-center p-0 ${searchClass}`}
      >
        <div className="col-12 col-md-8 p-0">{title}</div>

        <div className="col-12 col-md-4 p-0">
          <Form
            className={`d-flex align-items-center gap-2`}
            onSubmit={formHandle}
          >
            <Form.Control
              type="search"
              placeholder="Search"
              className="h-25 m-0"
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
        </div>
      </div>
    </div>
  );
};

export default CardTitleWithSearch;
