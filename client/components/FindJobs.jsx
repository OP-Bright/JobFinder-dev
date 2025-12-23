import React from 'react';

import SuggestedJobList from './SuggestedJobList.jsx';

export default function FindJobs({ jobs, getJobListings }) {

    return (
        <SuggestedJobList jobs={jobs} getJobListings={getJobListings}/>
    );

}

