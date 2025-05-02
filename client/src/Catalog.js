import React from 'react';

function Catalog() {
  return (
    <div className="catalog">
      <a href="/man" className="man-button">Мужчинам</a>
      <a href="/woman" className="woman-button">женщинам</a>
      <a href="/kids" className="kids-button">детям</a>
      <a href="/sport" className="sport-button">виды спорта</a>
      <a href="/brand" className="brand-button">бренды</a>
    </div>
  );
}

export default Catalog;
