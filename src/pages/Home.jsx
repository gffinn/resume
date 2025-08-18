import React from "react";
import Header from "../components/Header";
function Home() {
  return (
    <div>
      <Header />
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Welcome to my personal portfolio</p>
        <p>I plan to have bi-weekkly deployments</p>
          <li>First Style - I am working on bringing in some style</li>
          <li>Functionality - I am going to add some new functionality and test out some different 'challenges'</li>
          <li>Resume - I intend this to be used as my portfolio as well as my resume</li>
      </div>
    </div>
  );
}

export default Home;
