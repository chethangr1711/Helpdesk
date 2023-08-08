// @mui
import { useState } from 'react';

import PropTypes from 'prop-types';
import { Modal, Box, Stack, Link, Card, Divider, Typography, CardHeader, Button } from '@mui/material';
// utils
import { fToNow } from '../../../utils/formatTime';
// components

import Scrollbar from '../../../components/scrollbar';

// ----------------------------------------------------------------------

AppNewsUpdate.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

export default function AppNewsUpdate({ title, subheader, list, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {list.map((news) => (
            <NewsItem key={news.id} news={news} />
          ))}
        </Stack>
      </Scrollbar>

      <Divider />
    </Card>
  );
}

// ----------------------------------------------------------------------

NewsItem.propTypes = {
  news: PropTypes.shape({
    description: PropTypes.string,
    image: PropTypes.string,
    postedAt: PropTypes.instanceOf(Date),
    title: PropTypes.string,
    status: PropTypes.string,
    comments: PropTypes.string,
    created:PropTypes.string,
  }),
};

function NewsItem({ news }) {
  const [popupdata, setPopupdata] = useState('');
  const { image, title, description, postedAt,comments,created,business } = news;
  const [open, setOpen] = useState(false);
  const openPopup = (news) => {
    setPopupdata(news);
    setOpen(true);
  };

  const closePopup = () => {
    setOpen(false);
  };

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box component="img" alt={title} src={image} sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }} />

      <Box sx={{ minWidth: 240, flexGrow: 1 }}>
        <Link color="inherit" variant="subtitle2" underline="hover" noWrap>
          {/* {title} */}
          <Button onClick={() => openPopup(news)}>{title}</Button>
        </Link>

        <Typography variant="body2" sx={{ color: 'text.secondary', padding: '0px 7px' }} noWrap>
          {description}
        </Typography>
      </Box>

      <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
        {fToNow(postedAt)}
      </Typography>

      <Modal open={open} onClose={closePopup}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            maxWidth: 600,
            maxHeight: 600,
            overflow: 'auto',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Ticket ID : {popupdata.title}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Business Name : {popupdata.business}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Subject : {popupdata.description}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Status : {popupdata.status}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Created By : {created} @ {fToNow(postedAt)}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Comments : {comments}
          </Typography>
         
          <Button variant="contained" sx={{ mr: 5 }} onClick={closePopup}>
            Close
          </Button>
        </Box>
      </Modal>
    </Stack>
  );
}
