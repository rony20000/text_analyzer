import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import textrazorApi from "./services/textrazorApi";
import Header from "./components/Header";
import Upload from "./components/Upload";
import Result from "./components/Result";

const App = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState("");
  const [entities, setEntities] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (file) => {
    setFile(file);
    setIsLoading(true);
  };

  const readFile = () => {
    const reader = new FileReader();
    reader.onload = (e) => setData(e.target.result);
    reader.readAsText(file);
    setIsLoading(true);
  };

  const filterEntities = (entities) =>
    entities.filter(
      (entity) =>
        entity.type?.some((type) => ["Country", "Person"].includes(type)) ||
        entity.filterFreebaseTypes?.some((filterFreebaseType) =>
          ["/location/country", "/people/person"].includes(filterFreebaseType)
        )
    );

  const transformEntities = (entities) => {
    const entitiesObj = {};
    for (const entity of entities) {
      if (entitiesObj[entity.entityId]) {
        entitiesObj[entity.entityId].repetition += 1;
      } else {
        entitiesObj[entity.entityId] = {
          name: entity.entityId,
          repetition: 1,
          type:
            entity.type?.some((type) => ["Country"].includes(type)) ||
            entity.filterFreebaseTypes?.some((filterFreebaseType) =>
              ["/location/country"].includes(filterFreebaseType)
            )
              ? "Country"
              : "Person",
        };
      }
    }
    return entitiesObj;
  };

  const analyizeText = async () => {
    const entities = await textrazorApi.analyizeText(data);
    if (Array.isArray(entities)) {
      const filteredEntities = filterEntities(entities);
      const parsedEntities = transformEntities(filteredEntities);
      setEntities(parsedEntities);
      setIsLoading(false);
    } else {
      setEntities(null);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (file && file.type === "text/plain") {
      readFile();
      setIsLoading(true);
    }
  }, [file]);

  useEffect(() => {
    if (data && data.length > 0) {
      analyizeText();
      setIsLoading(true);
    }
  }, [data]);

  return (
    <>
      <Header />
      <Container>
        <Row>
          <Col>
            <Upload handleChange={handleChange} />
          </Col>
        </Row>
        <Row>
          <Col>
            {(data || isLoading) && (
              <Result data={entities} isLoading={isLoading} />
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default App;
