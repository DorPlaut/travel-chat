import { Avatar, Chip, Icon, Typography } from '@mui/material';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import TrainIcon from '@mui/icons-material/Train';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import SailingIcon from '@mui/icons-material/Sailing';
import HotelIcon from '@mui/icons-material/Hotel';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import GroupsIcon from '@mui/icons-material/Groups';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import ParkIcon from '@mui/icons-material/Park';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import AttractionsIcon from '@mui/icons-material/Attractions';
import EventIcon from '@mui/icons-material/Event';
import MuseumIcon from '@mui/icons-material/Museum';

export const eventTypeColors = {
  flight: '#3b82f6',
  'train trip': '#10b981',
  'bus trip': '#facc15',
  'boat trip': '#06b6d4',
  accommodation: '#a855f7',
  'live event': '#ec4899',
  restaurant: '#f97316',
  meeting: '#ef4444',
  museum: '#6366f1',
  beach: '#38bdf8',
  park: '#10b981',
  shopping: '#8b5cf6',
  attraction: '#f59e0b',
  other: '#9ca3af',
};

export const eventTypeIcons = {
  flight: <AirplanemodeActiveIcon sx={{ fontSize: '1rem' }} />,
  'train trip': <TrainIcon />,
  'bus trip': <DirectionsBusIcon />,
  'boat trip': <SailingIcon />,
  accommodation: <HotelIcon />,
  'live event': <TheaterComedyIcon />,
  restaurant: <RestaurantIcon />,
  meeting: <GroupsIcon />,
  museum: <MuseumIcon />,
  beach: <BeachAccessIcon />,
  park: <ParkIcon />,
  shopping: <ShoppingBasketIcon />,
  attraction: <AttractionsIcon />,
  other: <EventIcon />,
};

export const formatTime = (timeString) => {
  try {
    let timeObject;

    if (timeString.match(/^\d{2}:\d{2}:\d{2}$/)) {
      const [hours, minutes] = timeString.split(':');
      timeObject = new Date();
      timeObject.setHours(parseInt(hours, 10));
      timeObject.setMinutes(parseInt(minutes, 10));
    } else {
      timeObject = new Date(timeString);
    }

    if (isNaN(timeObject.getTime())) {
      throw new Error('Invalid date');
    }

    return timeObject.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch (error) {
    console.error('Error formatting time:', error.message);
    return 'Invalid time';
  }
};

const EventCard = ({ event }) => {
  const eventType = event.event_type.toLowerCase();
  const backgroundColor = eventTypeColors[eventType] || '#9ca3af';
  const { event_start_time, event_end_time, event_name } = event;

  const timeString = () => {
    if (event_start_time && event_end_time) {
      return `${formatTime(event_start_time)} - ${formatTime(event_end_time)}`;
    } else if (event_start_time) {
      return formatTime(event_start_time);
    }
    return '';
  };

  // const truncatedName = `${event_name.slice(0, 5)}...`;

  return (
    <Chip
      label={
        <>
          <Typography
            variant="caption"
            sx={{
              ml: -1,
              fontSize: '0.75rem',
              opacity: 0.85,
            }}
          >
            {timeString()}
          </Typography>
          {'  - ' + event_name}
        </>
      }
      avatar={
        <Avatar sx={{ scale: 0.55, p: 2 }}>{eventTypeIcons[eventType]}</Avatar>
      }
      size="medium"
      sx={{
        color: 'white',
        backgroundColor: backgroundColor,
        fontSize: '0.8rem',
        height: 20,
        mb: 0.5,
        width: '100%',
        justifyContent: 'flex-start',
      }}
    ></Chip>
  );
};

export default EventCard;
