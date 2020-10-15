DROP TABLE IF EXISTS locationdata;

CREATE TABLE locationdata (
  id SERIAL PRIMARY KEY,
  formatted_query VARCHAR(255),
  search_query VARCHAR(255),
  latitude NUMERIC,
  longitude NUMERIC
);


