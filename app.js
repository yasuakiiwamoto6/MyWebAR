const createEntity = ({ location: { latitude, longitude }, model, scale: [x, y, z] }) => {
  const $entity = document.createRange().createContextualFragment(`
    <a-entity
      gltf-model="${model}"
      scale="${x} ${y} ${z}"
      gps-entity-place="latitude: ${latitude}; longitude: ${longitude};"
    ></a-entity>
  `);

  $entity.addEventListener('loaded', () => {
    window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'));
  });

  return $entity;
};

const renderPlace = ({ location }) => {
  const $scene = document.querySelector('a-scene');
  const $entity = createEntity({
    location,
    model: '#asset-eevee',
    scale: ['0.5', '0.5', '0.5'],
  });
  $scene.appendChild($entity);
};

const staticLoadPlaces = () => [
  {
    location: {
      latitude: 35.658581,
      longitude: 139.745433,
    },
  },
];

const createPlaces = ({ latitude, longitude }) => [
  [-1, -1],
  [-1,  1],
  [ 1, -1],
  [ 1,  1],
].map(([cy,  cx]) => ({
  location: {
    latitude : latitude  + 0.000009 * cy,
    longitude: longitude + 0.000011 * cx,
  },
}));

window.onload = () => {
  navigator.geolocation.getCurrentPosition(
    position => {
      const places = createPlaces(position.coords);
      places.forEach(renderPlace);
    },
    err => console.error('Error in retrieving position', err),
    {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 27000
    }
  );
};
