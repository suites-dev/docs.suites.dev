import React from "react";
import Layout from "@theme/Layout";
import NotFoundContent from "../components/NotFoundContent";

export default function NotFound(): React.ReactElement {
  return (
    <Layout
      title="Page not found"
      description="The page you are looking for does not exist."
    >
      <NotFoundContent />
    </Layout>
  );
}
