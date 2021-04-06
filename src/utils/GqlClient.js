import { print } from "graphql/language/printer";
import extractFiles from "./extract-files";

export default class GqlClient {
  constructor({ url, errorHandler }) {
    this.url = url;
    this.errorHandler = errorHandler;
  }

  async query(query, variables, options = {}) {
    const { headers, ...others } = options;
    // Extracts all files from variables and replaces them
    // with null
    const files = extractFiles(variables);
    let fetchOptions;

    // uncomment below to debug query

    // Creates a stringfied query
    const graphqlQuery = JSON.stringify({
      query: print(query), // "print" changes graphql AST into normal string
      variables
    });

    // Uncomment to the debug👇

    // (headers, JSON.stringify(variables, null, 2))
    // console.log(
    //   print(query),
    //   JSON.stringify(variables)
    // )

    // Checks if there are any files in the query
    // if there is then ...
    if (files.length) {
      // ...then creates a form object
      const body = new FormData();
      // appends query into body
      body.append("operations", graphqlQuery);
      // apppend files into body
      files.forEach(({ path, file }) => body.append(path, file));
      // sets fetchOptions
      fetchOptions = {
        method: "POST",
        body,
        ...options
      };
    } else {
      // sets fetchOption without any body append
      // because there are no files here and we
      // directly assign body to graphqlQuery
      fetchOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: graphqlQuery,
        ...others
      };
    }
    try {
      // fetches the Data
      const response = await fetch(this.url, fetchOptions);
      const result = await response.json();
      // Checks if there are any error in result
      if (result.errors) {
        // throw the result
        throw result;
      }
      // otherwise just normally return them
      return result;
    } catch (e) {
      // For other normal errors
      // just throw them
      throw Object({
        status: this.errorHandler(e),
        ...e
      });
    }
  }
}
