import GqlClient from "./GqlClient";

const handleGraphqlResponseErrors = error => {
  console.log(error);
};

const client = new GqlClient({
  url: "https://api.spacex.land/graphql",
  errorHandler: handleGraphqlResponseErrors
});
const requestToGraphql = async (query, variables) => {
  return client.query(query, variables);
};

export default requestToGraphql;
