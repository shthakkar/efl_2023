import React from "react";
import settings from './settings.json'

export default function SetupTeams(){

  const baseURL = process.env.REACT_APP_BASE_URL;

    fetch(baseURL+'/setup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settings.setup)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error(error);
    });
}
