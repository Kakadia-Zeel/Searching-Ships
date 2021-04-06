const isObject = value => typeof value === "object" && value !== null;

const extractFiles = (tree, treePath = "") => {
  const files = [];

  const recurse = (node, nodePath) => {
    Object.keys(node).forEach(key => {
      if (!isObject(node[key])) return;
      const path = `${nodePath}${key}`;
      if (
        (typeof File !== "undefined" && node[key] instanceof File) ||
        (typeof Blob !== "undefined" && node[key] instanceof Blob)
      ) {
        files.push({ path, file: node[key] });
        node[key] = null; // eslint-disable-line no-param-reassign
        return;
      }

      if (typeof FileList !== "undefined" && node[key] instanceof FileList) {
        node[key] = Array.prototype.slice.call(node[key]); // eslint-disable-line no-param-reassign
      }
      recurse(node[key], `${path}.`);
    });
  };

  if (isObject(tree)) {
    recurse(tree, treePath === "" ? treePath : `${treePath}.`);
  }
  return files;
};

export default extractFiles;
