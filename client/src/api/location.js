const fetchLocations = async (setLocations) => {
  await fetch("/api/locations/", {
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => setLocations(result))
    .catch(console.error);
};

const addLocation = async (
  token,
  city,
  state,
  address,
  apartment,
  main,
  zipcode
) => {
  try {
    const response = await fetch("/api/locations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        city,
        state,
        address,
        apartment,
        main,
        zipcode,
      }),
    });
    const data = response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const fetchLocationsByUserID = async (userId) => {
  try {
    const response = await fetch(`/api/locations/${userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const updateLocation = async (
  token,
  locationId,
  city,
  state,
  address,
  apartment,
  main,
  zipcode
) => {
  try {
    const response = await fetch(`/api/locations/${locationId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        city,
        state,
        address,
        apartment,
        main,
        zipcode,
      }),
    });

    const data = response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const deleteLocation = async (token, locationId) => {
  await fetch(`/api/locations/${locationId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => {
      console.log(error);
    });
};

export {
  fetchLocations,
  addLocation,
  fetchLocationsByUserID,
  updateLocation,
  deleteLocation,
};
