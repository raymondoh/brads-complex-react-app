import React from "react";
import { Link } from "react-router-dom";
import Page from "./Page";

const NotFound = () => {
  return (
    <Page title="Not Found">
      <div className="text-center"></div>
      <h2>Oops, we can't find that page.</h2>
      <p className="lead text-muted">
        Go back to <Link to={`/`}>home page</Link>{" "}
      </p>
    </Page>
  );
};

export default NotFound;
