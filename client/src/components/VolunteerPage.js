//VolunteerPage.js

import React from 'react';
import VolunteerForm from './VolunteerForm';

const VolunteerPage = () => {
  return (
    <div style={{ textAlign: 'left' }}>
      <h2>Partner Relationship Lead</h2>
		<ul style={{marginLeft: '1em', paddingLeft:'1em'}}>
		<li>Would be involved in reaching out to the organizations and having them engaged in ensuring we have enough organizations working on our common goals.
		</li>
		<li>Engage leaders in different areas so that they can be onboarded on site.
		</li>
		<li>Design Partnership plans to work with different organizations in different geographies.
		</li>
		<li>Develop post for different social media platforms like linkedin, twitter, insta, youtube, tiktok etc.
		</li>
		<li>Hire other volunteers in different geography.
		</li>
		<li>Develop strategy with the core-team to ensure new ideas are implemented.
		</li>
		</ul>

      <h3>Apply for this position</h3>
      <VolunteerForm />
    </div>
  );
};

export default VolunteerPage;
