import React from "react";

export default function SuggestedListEntry({ name, link, description }) {
  return (
    <div style={{ border: "2px solid black" }}>
      <p>Job Title: {name}</p>
      <a href={link} target="_blank" rel="noopner noreferrer">
        Click here to apply directly
      </a>
      {/* Descriptions end in... will need let client know to go to job posting for full description*/}
      <p>Description: {description}</p>
    </div>
  );
}
