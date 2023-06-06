import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector, { timelineConnectorClasses } from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, {
    timelineOppositeContentClasses,
  } from '@mui/lab/TimelineOppositeContent';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { StepConnector } from '@mui/material';
import { style } from '@mui/system';



const CampaignTimeline = () => {
    // const [steps,addSteps] = useState({});
    // const [steps,clearSteps] = useState({});

    const steps = [
        {"time":'2022/01/01', "point":0},
        {"time":'2022/10/01', "point":100},
        {"time":'2022/10/30', "point":50},
        {"time":'2022/12/31', "point":-20},
        {"time":'2023/01/30', "point":-50},
      ];
    return (
        
      <div>
          <p> </p>
          <Box sx={{ width: '100%' }}>
                <Stepper activeStep={2} alternativeLabel 
                    
                >
                    {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label.time}</StepLabel>
                        <p className="" hidden={label.point === 0}>{label.point}</p>
                    </Step>
                ))}
                </Stepper>
            </Box>
      </div>
    )
  };
  
  export default CampaignTimeline;