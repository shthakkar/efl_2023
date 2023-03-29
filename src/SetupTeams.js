import React from "react";
import settings from './settings.json'

export default function SetupTeams(){

    fetch('https://efl2023.azurewebsites.net/setup', {
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
