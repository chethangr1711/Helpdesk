// @mui
import PropTypes from 'prop-types';
import { Card, Typography, CardHeader, CardContent } from '@mui/material';
import { Timeline, TimelineDot, TimelineItem, TimelineContent, TimelineSeparator, TimelineConnector } from '@mui/lab';
// utils
import { fDateTime } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

AppOrderTimeline.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

export default function AppOrderTimeline({ title, subheader, list, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <CardContent
        sx={{
          '& .MuiTimelineItem-missingOppositeContent:before': {
            display: 'none',
          },
        }}
      >
        <Timeline>
          {list.map((item, index) => (
            <OrderItem key={item.id} item={item} isLast={index === list.length - 1} />
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

OrderItem.propTypes = {
  isLast: PropTypes.bool,
  item: PropTypes.shape({
    time: PropTypes.instanceOf(Date),
    title: PropTypes.string,
    type: PropTypes.string,
    desc: PropTypes.string,
    closedby:PropTypes.string,
    created: PropTypes.string,

    status: PropTypes.string,
    updatedby:PropTypes.string,
    comments:PropTypes.string,
  }),
};

function OrderItem({ item, isLast }) {
  const { comments, title, time, desc, closedAt,closedby,created,updatedAt,status,updatedby,reassignedto,updatedcomment } = item;
  return (
    <>
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          color="success"
        />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>

      <TimelineContent>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="subtitle2">{desc}</Typography>
        <Typography variant="subtitle2">Ticket Status : Open</Typography>
        <Typography variant="subtitle2">Created By :-  {created}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Created On {fDateTime(time)}
        </Typography>


       
      </TimelineContent>
    </TimelineItem>

    <TimelineItem>
  
  {(updatedAt) && (
        <>
          <TimelineSeparator>
      <TimelineDot
        color="info"
        
      />
      {isLast ? null : <TimelineConnector />}
    </TimelineSeparator>
          <TimelineContent>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="subtitle2">Ticket Status : {status}</Typography>
        <Typography variant="subtitle2">Updated By :-  {updatedby}</Typography>
        {reassignedto && (
        <Typography variant="subtitle2">Reassigned To: {reassignedto}</Typography>
      )}
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Updated On {fDateTime(updatedAt)}
          </Typography>
          
          </TimelineContent>
        </>
      )}
  </TimelineItem>

    <TimelineItem>
  
    {(closedAt) && (
          <>
            <TimelineSeparator>
        <TimelineDot
          color= 'warning'
        />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>
            <TimelineContent>
          <Typography variant="subtitle2">{title}</Typography>
          <Typography variant="subtitle2">{updatedcomment}</Typography>
          <Typography variant="subtitle2">Ticket Status : {status}</Typography>
          <Typography variant="subtitle2">Closed By :-  {closedby}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Closed On {fDateTime(closedAt)}
            </Typography>
            
            </TimelineContent>
          </>
        )}
    </TimelineItem>
    </>
  );
}
