import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format, isWithinInterval, parse } from 'date-fns';
import {
  Box,
  TextField,
  MenuItem,
  IconButton,
  InputAdornment,
  Paper,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { eventTypeIcons, eventTypeColors } from '../calendar/EventCard';

const SearchFilters = ({ currentTrip, onFilterChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState(
    searchParams.get('type') || ''
  );
  const [selectedDate, setSelectedDate] = useState(
    searchParams.get('date')
      ? parse(searchParams.get('date'), 'yyyy-MM-dd', new Date())
      : null
  );

  // Update URL and trigger filter change
  const updateFilters = (newFilters) => {
    const params = {};
    if (newFilters.search) params.search = newFilters.search;
    if (newFilters.type) params.type = newFilters.type;
    if (newFilters.date) params.date = format(newFilters.date, 'yyyy-MM-dd');

    setSearchParams(params);

    onFilterChange({
      search: newFilters.search,
      type: newFilters.type,
      date: newFilters.date,
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch('');
    setSelectedType('');
    setSelectedDate(null);
    setSearchParams({});
    onFilterChange({ search: '', type: '', date: null });
  };

  // Handle search input
  const handleSearchChange = (e) => {
    const newSearch = e.target.value;
    setSearch(newSearch);
    updateFilters({
      search: newSearch,
      type: selectedType,
      date: selectedDate,
    });
  };

  // Handle type selection
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setSelectedType(newType);
    updateFilters({
      search: search,
      type: newType,
      date: selectedDate,
    });
  };

  // Handle date selection
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    updateFilters({
      search: search,
      type: selectedType,
      date: newDate,
    });
  };

  return (
    <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search events..."
          value={search}
          onChange={handleSearchChange}
          size="small"
          sx={{ flexGrow: 1, minWidth: '200px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: search && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => {
                    setSearch('');
                    updateFilters({
                      search: '',
                      type: selectedType,
                      date: selectedDate,
                    });
                  }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select
          size="small"
          value={selectedType}
          onChange={handleTypeChange}
          sx={{ minWidth: '150px' }}
          label="Event Type"
        >
          <MenuItem value="">All Types</MenuItem>
          {Object.entries(eventTypeIcons).map(([type]) => (
            <MenuItem key={type} value={type}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: eventTypeColors[type],
                  }}
                />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Box>
            </MenuItem>
          ))}
        </TextField>
        <DatePicker
          value={selectedDate}
          onChange={handleDateChange}
          minDate={
            currentTrip?.trip_start_date
              ? new Date(currentTrip.trip_start_date)
              : undefined
          }
          maxDate={
            currentTrip?.trip_end_date
              ? new Date(currentTrip.trip_end_date)
              : undefined
          }
          slotProps={{
            textField: {
              size: 'small',
              sx: { minWidth: '150px' },
              error: Boolean(
                selectedDate &&
                  currentTrip &&
                  !isWithinInterval(selectedDate, {
                    start: new Date(currentTrip.trip_start_date),
                    end: new Date(currentTrip.trip_end_date),
                  })
              ),
              helperText:
                selectedDate &&
                currentTrip &&
                !isWithinInterval(selectedDate, {
                  start: new Date(currentTrip.trip_start_date),
                  end: new Date(currentTrip.trip_end_date),
                })
                  ? 'Date outside trip range'
                  : '',
            },
          }}
        />

        {(search || selectedType || selectedDate) && (
          <IconButton
            size="small"
            onClick={clearFilters}
            sx={{ alignSelf: 'center' }}
          >
            <ClearIcon />
          </IconButton>
        )}
      </Box>
    </Paper>
  );
};

export default SearchFilters;
