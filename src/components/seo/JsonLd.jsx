/**
 * Renders one or more JSON-LD graphs into the document.
 *
 * Next.js strips unknown tags from `metadata`, so structured data is emitted
 * as a script element from the page body — which Google parses either way.
 *
 * @param {{ schema: object | object[] }} props
 */
const JsonLd = ({ schema }) => {
  const graphs = (Array.isArray(schema) ? schema : [schema]).filter(Boolean);

  return graphs.map((graph, index) => (
    <script
      key={index}
      type="application/ld+json"
      // Values come from local content files, never from user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  ));
};

export default JsonLd;
